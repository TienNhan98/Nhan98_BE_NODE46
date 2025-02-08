import Cars from "../models/cars.model.js";
import carservice from "../services/car.service.js";
import {
  responseSuccess,
  responseError,
} from "../common/helper/responseSuccess.helper.js";

const carController = {
  carList: async (request, response, next) => {
    try {
      const cars = await carservice.carList(request);

      const resData = responseSuccess(cars, "lấy danh sách thành công", 200);

      // // trả dữ liệu về
      response.status(resData.code).json(resData);
    } catch (error) {
      // console.log(error.stack);

      next(error);
    }
  },
};
export default carController;
