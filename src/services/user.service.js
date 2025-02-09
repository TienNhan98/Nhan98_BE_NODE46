import { BadRequestException } from "../common/helper/error.helper.js";
import prisma from "../common/prisma/init.prisma.js";
import { v2 as cloudinary } from "cloudinary";

export const userService = {
  create: async function (req) {
    return `This action create`;
  },

  findAll: async function (req) {
    return `This action returns all user`;
  },

  findOne: async function (req) {
    return `This action returns a id: ${req.params.id} user`;
  },

  update: async function (req) {
    return `This action updates a id: ${req.params.id} user`;
  },

  remove: async function (req) {
    return `This action removes a id: ${req.params.id} user`;
  },

  uploadLocal: async (req) => {
    console.log({ file: req.file });
    const file = req.file;
    if (!file) {
      throw new BadRequestException(
        "Zui Lòng gửi hình ảnh lên thông qua key file (from-data)"
      );
    }

    const userId = req.user.user_id;
    await prisma.users.update({
      where: {
        user_id: Number(userId),
      },
      data: {
        avatar: file.filename,
      },
    });
    return {
      folder: "/images",
      filename: file.filename,
      imgUrl: `images/${file.path}`,
    };
  },
  uploadCloud: async (req) => {
    console.log({ file: req.file });
    const file = req.file;
    if (!file) {
      throw new BadRequestException(
        "Zui Lòng gửi hình ảnh lên thông qua key file (from-data)"
      );
    }

    const userId = req.user.user_id;

    // Configuration
    // Configuration
    cloudinary.config({
      cloud_name: "nhaantn",
      api_key: "798485242777666",
      api_secret: "hz-8mOyMOWZ4KqzRw1fJPM_5lj0", // Click 'View API Keys' above to copy your API secret
    });
    const uploadResult = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream({ folder: "images" }, (error, uploadResult) => {
          return resolve(uploadResult);
        })
        .end(file.buffer);
    });
    console.log("📢 [user.service.js:74]", uploadResult);
    await prisma.users.update({
      where: {
        user_id: Number(userId),
      },
      data: {
        avatar: uploadResult.secure_url,
      },
    });
    // Để cho FE show được hình cần đổi tên'cloud_name' `https://res.cloudinary.com/<TÊN CỦA CÁC BẠN>/image/upload/`
    // src/constant/app.constant.ts
    return {
      folder: uploadResult.asset_folder,
      filename: file.filename,
      imgUrl: uploadResult.secure_url,
    };
  },
};
