import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export interface FavouriteModel
  extends Model<
    InferAttributes<FavouriteModel>,
    InferCreationAttributes<FavouriteModel>
  > {
  id: CreationOptional<number>;
  userId: number;
  filmId: number;
}

const getFavourite = (sequelize: Sequelize) => {
  const Favourite = sequelize.define<FavouriteModel>("favourites", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    filmId: {
      type: DataTypes.INTEGER,
    },
  });

  return Favourite;
};

export default getFavourite;
