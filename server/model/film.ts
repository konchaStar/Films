import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export interface FilmModel
  extends Model<
    InferAttributes<FilmModel>,
    InferCreationAttributes<FilmModel>
  > {
  id: CreationOptional<number>;
  title: string;
  year: number;
  description: string;
  image: string;
  content: string;
}

const getFilm = (sequelize: Sequelize) => {
  const Film = sequelize.define<FilmModel>("films", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    year: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING,
    },
  });

  return Film;
};

export default getFilm;
