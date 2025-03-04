import sequelize, { Sequelize } from "sequelize";
import db from "../model";
import { UserModel } from "../model/user";
import { Op } from "sequelize";
import { FilmModel } from "../model/film";

const User = db.user;
const Film = db.film;
const Favourite = db.favourite;

export type OrderType = "asc" | "desc";
export type OrderField = "title" | "year";

class Controller {
  createUser = async (user: UserModel) => {
    const newUser = await User.create(user);
    return newUser;
  };

  createFilm = async (film: FilmModel) => {
    const newFilm = await Film.create(film);
    return newFilm;
  };

  getUserByEmail = async (email: string) => {
    const user = await User.findOne({ where: { email } });
    return user ? user : null;
  };

  getFilms = async (
    search: string,
    type: OrderField,
    order: OrderType,
    page: number
  ) => {
    let orderBy: [OrderField, OrderType][] = [];
    if (type && order) {
      orderBy.push([type, order]);
    }
    const films = await Film.findAll({
      where: {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      },
      order: orderBy,
      limit: 12,
      offset: (page - 1) * 12,
    });
    return films ? films : null;
  };

  getFilmsCount = async (search: string) => {
    return await Film.count({
      where: {
        title: { [Op.iLike]: `%${search}%` },
      },
    });
  };

  getFilmById = async (id: number) => {
    return await Film.findOne({ where: { id } });
  };

  getFavouritesByUserId = async (id: number) => {
    const favourite = await Favourite.findAll({ where: { userId: id } });
    return favourite ? favourite : [];
  };

  addToFavourites = async (userId: number, filmId: number) => {
    const fav = await Favourite.create({ userId, filmId });
    return fav ? true : false;
  };

  removeFromFavourites = async (userId: number, filmId: number) => {
    Favourite.destroy({
      where: {
        userId,
        filmId,
      },
    });
  };

  getFavouriteByUserAndFilm = async (userId: number, filmId: number) => {
    const fav = await Favourite.findOne({
      where: {
        userId,
        filmId,
      },
    });
    return fav ? true : false;
  };
}

export default new Controller();
