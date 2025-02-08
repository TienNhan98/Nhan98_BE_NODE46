import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SERECT } from "../constant/app.constant.js";
import prisma from "../prisma/init.prisma.js";
import { UnauthorizeExceptrion } from "../helper/error.helper.js";

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[[1]];
    // console.log(
    //   "📢[protect.middleware.js:8]: req.headers: ",
    //   req.headers.authorization
    // );
    // console.log("📢accessToken: ", accessToken);

    if (!accessToken) {
      throw new UnauthorizeExceptrion("Zui lòng cung cấp token đễ tiếp tục");
    }

    const verifyToken = jwt.verify(accessToken, ACCESS_TOKEN_SERECT);
    console.log("📢[protect.middleware.js:5]: verifyToken: ", verifyToken);
    const user = await prisma.users.findUnique({
      where: {
        user_id: verifyToken.userId,
      },
      include: {
        roles: true,
      },
    });

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
