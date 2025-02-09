import multer from "multer";
import { responseError } from "./responseSuccess.helper.js";
import jwt from "jsonwebtoken";

export const handleError = (error, request, response, next) => {
  console.log("📢[error.helper.js:3]: error: ", error);

  // 401: log out
  // 403: refreshToken ( token hết hạn)
  // 2 lỗi này BE và FE sẽ quyết định cùng với nhau
  if (error instanceof jwt.JsonWebTokenError) {
    error.code = 401;
  }

  if (error instanceof jwt.TokenExpiredError) {
    error.code = 403;
  }
  if (error instanceof multer.MulterError) {
    error.code = 400;
  }
  const resData = responseError(error.message, error.code, error.stack);
  response.status(resData.code).json(resData);
};

export class BadRequestException extends Error {
  constructor(message = "BadRequestException") {
    super(message);
    this.code = 400;
  }
}

export class ForbiddenException extends Error {
  constructor(message = "ForbiddenException") {
    super(message);
    this.code = 403;
  }
}

export class UnauthorizeExceptrion extends Error {
  constructor(message = "UnauthorizeExceptrion") {
    super(message);
    this.code = 401;
  }
}
