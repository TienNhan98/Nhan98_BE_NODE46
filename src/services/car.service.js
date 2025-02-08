import Cars from "../models/cars.model.js";
import {
  BadRequestException,
  ForbiddenException,
} from "../common/helper/error.helper.js";
const carservice = {
  carList: async (request) => {
    // Lỗi kiểm soát được

    const passNguoiDungGuiLen = 123;
    const passLayTrongDb = 12345;
    if (passNguoiDungGuiLen !== passLayTrongDb) {
      throw new ForbiddenException("pass không chính xác");
    }

    // Lỗi không kiểm soát được
    // console.log(abc);

    // const cars = await sequelize.query(`SELECT * FROM cars`);
    const { page } = request.query;
    console.log("🚀 ~ carList: ~ page:", page);
    const cars = await Cars.findAll({ raw: true });

    return cars;
  },
};

export default carservice;
