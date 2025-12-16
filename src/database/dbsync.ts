import { Model, ModelStatic } from "sequelize";
import { Users } from "./Models/MainModels/Users";
import { MessageDB } from "./Models/Message/MessageModel";
import sequelize from "./sequelize";

export async function TableSync() {
  try {
    await Users.sync();
    await MessageDB.sync();

    await sequelize.sync({ alter: true });
    console.log('Таблицы синхронизированы');

    await sequelize.authenticate();
    console.log(`[${sequelize.getDatabaseName()}]: авторизованна`)

  } catch (err) {
    console.log(`[Произошла ошибка в базе данных]: ${new Date()} ${err}`)
  }
};
