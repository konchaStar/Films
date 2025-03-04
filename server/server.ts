import express, { Express, Request, Response } from "express";
import cors from "cors";
import db from "./model";
import controller, { OrderField, OrderType } from "./controller";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "./model/user";
import path from "path";
import fs from "fs";
import { FilmModel } from "./model/film";
import multer from "multer";

export const JWT_SECRET =
  "521933e2b2f5f058652a03c8f9a3875cd18bd50ea188c1cbb08c6ed56f88b5ba23d0221768e0444c7928012fc032eda853bddefd440e36581076e21d7760ceec";

const app: Express = express();
const port: number = 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "films/");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req: Request, res: Response) => {});

app.post(
  "/films/add",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const { year, title, description, image } = req.body;
    const file = req.file ? req.file.filename : "";
    const film = await controller.createFilm({
      year: +(year as string),
      title: title as string,
      description: description as string,
      image: image as string,
      content: file,
    } as FilmModel);
    res.status(200).json({ film });
  }
);

app.post("/reg", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!(await controller.getUserByEmail(email))) {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await controller.createUser({
      email,
      password: hash,
      role: "User",
    } as UserModel);
    const token = jwt.sign({ email, role: "User", id: newUser.id }, JWT_SECRET);
    res.status(200).json({ token });
  } else {
    res.status(400).json({ message: "User already exists" });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await controller.getUserByEmail(email);
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign(
        { email, role: user.role, id: user.id },
        JWT_SECRET
      );
      res.status(200).json({ token });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

app.get("/films", async (req: Request, res: Response) => {
  const { search, type, order, page } = req.query;
  const films = await controller.getFilms(
    search as string,
    type as OrderField,
    order as OrderType,
    +(page as string)
  );
  if (films) {
    const count = await controller.getFilmsCount(search as string);
    res.status(200).json({ films, count });
  } else {
    res.status(404);
  }
});

app.get("/favourites/contains", async (req: Request, res: Response) => {
  const { userId, filmId } = req.query;

  if (
    await controller.getFavouriteByUserAndFilm(
      +(userId as string),
      +(filmId as string)
    )
  ) {
    res.status(200).json({ message: "Contains" });
  } else {
    res.status(400).json({ message: "Doesn't contain" });
  }
});

app.post("/favourites/add", async (req: Request, res: Response) => {
  const { userId, filmId } = req.body;
  controller.addToFavourites(userId, filmId);
  res.status(200).json({ message: "Added" });
});

app.post("/favourites/remove", async (req: Request, res: Response) => {
  const { userId, filmId } = req.body;
  controller.removeFromFavourites(userId, filmId);
  res.status(200).json({ message: "Removed" });
});

app.get("/favourites/:id", async (req: Request, res: Response) => {
  const id = +req.params.id;
  const favourites = await controller.getFavouritesByUserId(id);
  const filmPromises = favourites.map((favourite) =>
    controller.getFilmById(favourite.filmId)
  );
  const films = await Promise.all(filmPromises);
  res.status(200).json({ films: films, count: favourites.length });
});

app.get("/film/:id", async (req: Request, res: Response) => {
  const id = +req.params.id;

  res.status(200).json(await controller.getFilmById(id));
});

app.get("/films/:filename", (req: Request, res: Response) => {
  if (req.params.filename) {
    const videoPath = path.join(__dirname, "films", req.params.filename);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunkSize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });
      fs.createReadStream(videoPath).pipe(res);
    }
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
