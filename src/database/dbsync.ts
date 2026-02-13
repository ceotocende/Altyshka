import { Model, ModelStatic } from "sequelize";
import sequelize from "./sequelize";

export async function TableSync() {
  try {

    await sequelize.sync({ alter: true });
    console.log('Таблицы синхронизированы');

    await sequelize.authenticate();
    console.log(`[${sequelize.getDatabaseName()}]: авторизованна`)

  } catch (err) {
    console.log(`[Произошла ошибка в базе данных]: ${new Date()} ${err}`)
  }
};
