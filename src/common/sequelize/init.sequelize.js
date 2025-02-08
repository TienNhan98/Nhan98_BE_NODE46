import { Sequelize } from "sequelize";
import initModels from "../../models/init-models.js";
import { DATABASE_URL } from "../constant/app.constant.js";

export const sequelize = new Sequelize(DATABASE_URL, { logging: false });
const models = initModels(sequelize);

// Kiếm trả kết nối với cơ sở dữ liệu
sequelize
  .authenticate()
  .then((res) => {
    console.log("thành công");
  })
  .catch((err) => {
    "thất bại", err;
  });

export default models;
