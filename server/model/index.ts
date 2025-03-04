import { config } from "../config/db.config";
import { ModelStatic, Sequelize } from "sequelize";
import getUser, { UserModel } from "./user";
import getFilm, { FilmModel } from "./film";
import getFavourite, { FavouriteModel } from "./favourite";

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

type DB = {
  sequelize: Sequelize;
  user: ModelStatic<UserModel>;
  film: ModelStatic<FilmModel>;
  favourite: ModelStatic<FavouriteModel>;
};

const db: DB = {
  sequelize,
  user: getUser(sequelize),
  film: getFilm(sequelize),
  favourite: getFavourite(sequelize),
};

export default db;
