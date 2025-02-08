import {
  ACCESS_TOKEN_EXPIRED,
  ACCESS_TOKEN_SERECT,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRED,
} from "../common/constant/app.constant.js";
import {
  BadRequestException,
  UnauthorizeExceptrion,
} from "../common/helper/error.helper.js";
import sendMail from "../common/nodemailer/send-mail.nodemailer.js";
import prisma from "../common/prisma/init.prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authService = {
  // API
  register: async (req) => {
    // Bước 1: Nhận dữ liệu: full_name, email, pass
    const { full_name, email, pass_word } = req.body;
    console.log({ full_name, email, pass_word });
    // Bước 2: Lấy email và kiểm tra trong db xem có đã có người dùng đó hay chưa
    const userExist = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    // console.log("📢[auth.service.js:9]: userExist: ", userExist);
    if (userExist) {
      throw new BadRequestException("Tài khoản đã tồn tại, Zui lòng đăng nhập");
    }

    // Mã hóa pass_word
    // later
    const passHash = bcrypt.hashSync(pass_word, 10);
    // Bước 3: Tạo người dùng mới
    const userNew = await prisma.users.create({
      data: {
        email: email,
        full_name: full_name,
        pass_word: passHash,
      },
    });

    // xóa pass_word khi trả về
    delete userNew.pass_word;

    // gửi mail chào mừng
    // 1 - tốc độ: đăng ký nhanh và không cần đợi quá trình xử lý email => bỏ await không dùng
    // 2 - chắc chắn: đăng ký chậm và cần phải đợi email gửi thành công => sữ dụng await
    sendMail(`nhaantn98@gmail.com`).catch((err) => {
      console.log("Nỗi gửi email", err);
    });

    // Bước 4: Trả kết quả thành công
    return userNew;
  },
  login: async (req) => {
    const { email, pass_word } = req.body;
    // console.log("📢[auth.service.js:40]: ", { email, pass_word });
    const userExist = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    if (!userExist) {
      throw new BadRequestException("Tài khoản chưa tồn tài, Zui lòng đăng ký");
    }

    if (!userExist.pass_word) {
      if (userExist.face_app_id) {
        throw new BadRequestException(
          `Vui lòng đăng nhập bằng facebook, để cập nhật mật khẩu mới`
        );
      }
      if (userExist.goole_id) {
        throw new BadRequestException(
          `Zui lòng đăng nhập bằng google, để cập nhật mật khẩu mới`
        );
      }
      throw new BadRequestException(` Không hợp lệ, vui lòng liên hệ anh Long`);
    }
    // so sánh password người dùng nhập với pass_word đang có trong db
    const isPassword = bcrypt.compareSync(pass_word, userExist.pass_word);

    if (!isPassword) {
      throw new BadRequestException("Mật khẩu chưa chính xác");
    }

    const tokens = authService.createTokens(userExist.user_id);
    // console.log("🚀 ~ login: ~ accessToken:", accessToken);
    return tokens;
  },
  faceBookLogin: async (req) => {
    // console.log(req.body);
    const { name, email, picture, id } = req.body;
    const avt = picture.data.url;
    // console.log({ name, email, avt, id });

    let userExists = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      userExists = await prisma.users.create({
        data: {
          email: email,
          full_name: name,
          face_app_id: id,
        },
      });
    }

    const tokens = authService.createTokens(userExists.user_id);

    return tokens;
  },
  refreshToken: async (req) => {
    const refreshToken = req.headers.authorization?.split(" ")[[1]];

    if (!refreshToken) {
      throw new UnauthorizeExceptrion("Zui lòng cung cấp token đễ tiếp tục");
    }

    const accessToken = req.headers[`x-access-token`];
    if (!accessToken) {
      throw new UnauthorizeExceptrion("Zui lòng cung cấp token đễ tiếp tục");
    }

    const decodeRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const decodeaccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SERECT, {
      ignoreExpiration: true,
    });

    console.log({
      decodeRefreshToken,
      decodeaccessToken,
    });

    if (decodeRefreshToken.userId !== decodeaccessToken.userId) {
      throw new UnauthorizeExceptrion(`Cặp Token không hợp lệ`);
    }

    const userExists = await prisma.users.findUnique({
      where: {
        user_id: decodeRefreshToken.userId,
      },
    });

    if (!userExists) throw new UnauthorizeExceptrion(`User không tồn tại`);

    const tokens = authService.createTokens(userExists.user_id);

    return tokens;
  },
  getInfo: async (req) => {
    delete req.user.pass_word;
    return req.user;
  },

  // function
  createTokens: (userId) => {
    if (!userId) throw new BadRequestException(`Không có userId để tạo token`);

    const accessToken = jwt.sign({ userId: userId }, ACCESS_TOKEN_SERECT, {
      expiresIn: ACCESS_TOKEN_EXPIRED,
    });

    const refreshToken = jwt.sign({ userId: userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRED,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
};
export default authService;
