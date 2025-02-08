// node js: môi trường để chạy code javascript trên máy tính

import express from "express";
import { DataTypes, Sequelize } from "sequelize";
import initModels from "./src/models/init-models.js";
import rootRouter from "./src/routes/root.router.js";
import { responseError } from "./src/common/helper/responseSuccess.helper.js";
import { handleError } from "./src/common/helper/error.helper.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import prisma from "./src/common/prisma/init.prisma.js";

const app = express();

// Middlewere giúp phân giải dữ liệu từ json sang đối tượng javascript
app.use(express.json());

app.use(cors({ origin: ["http://localhost:5173", "google.com"] }));

app.use(rootRouter);

app.use(handleError);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on("connection", (socket) => {
  console.log(`id: ${socket.id}`);

  socket.on("join-room", (data) => {
    console.log("📢 [sever.js:34]", data);
    const { user_id_sender, user_id_recipient } = data;
    // tạo roomID: sắp xếp 2 id lại với nhau
    const roomId = [user_id_sender, user_id_recipient]
      .sort((a, b) => a - b)
      .join("_");

    // Đảm bảo thoát hết room trước khi join room
    socket.rooms.forEach((roomId) => {
      socket.leave(roomId);
    });
    socket.join(roomId);
  });

  socket.on("send-message", async (data) => {
    console.log({ data });
    const { message, user_id_sender, user_id_recipient } = data;
    const roomId = [user_id_sender, user_id_recipient]
      .sort((a, b) => a - b)
      .join("_");
    io.to(roomId).emit("receive-message", data);
    await prisma.chats.create({
      data: {
        message: message,
        user_id_sender: user_id_sender,
        user_id_recipient: user_id_recipient,
      },
    });
  });

  // Nến lấy danh sách message khởi tạo ban đầu bằng API
  // Không nên dùng bằng socket như phía dưới
  socket.on("get-list-message", async (data) => {
    console.log("get-list-message", { data });
    const { user_id_sender, user_id_recipient } = data;
    const chats = await prisma.chats.findMany({
      where: {
        OR: [
          // Lấy tin nhắn của mình
          {
            user_id_recipient: user_id_recipient,
            user_id_sender: user_id_sender,
          },
          // Lấy tin nhắn của đối phương
          {
            user_id_sender: user_id_sender,
            user_id_recipient: user_id_recipient,
          },
        ],
      },
    });
    socket.emit("get-list-message", chats);
  });
});

// app.use(
//   (req, res, next) => {
//     console.log("Middlewere 1");
//     const payload = "payload";
//     res.payload = payload;
//     next(123);
//   },
//   (req, res, next) => {
//     console.log("Middlewere 2");
//     console.log(res.payload);
//     next();
//   },
//   (req, res, next) => {
//     console.log("Middlewere 3");
//     next();
//   }
// );

// const sequelize = new Sequelize("postgres://user:pass@example.com:5432/dbname"); // Example for postgres

// const sequelize = new Sequelize(
//   "mysql://root:1234@localhost:3307/db_cyber_media"
// );

// // Kiếm trả kết nối với cơ sở dữ liệu
// sequelize
//   .authenticate()
//   .then((res) => {
//     console.log("thành công");
//   })
//   .catch((err) => {
//     "thất bại", err;
//   });

// Khi clg, hoặc chạy mà gặp trường hợp trả về Promise hoặc Pending thì mình sẽ cần thêm await trước dữ liệu cho biến đó

// const cars = await sequelize.query(`SELECT * FROM cars`);
// console.log("📢[sever.js:85]: cars: ", cars);

// Khi dùng async await, nếu không biết thêm async ở đâu, tìm thì arown function bọc nó gần nhất và thêm async
// app.get(`/cars`, async (request, response, next) => {
//   const cars = await sequelize.query(`SELECT * FROM cars`);
//   console.log("📢[sever.js:85]: cars: ", cars);
//   // trả dữ liệu về
//   response.json(cars);
// });

/**
 * Code first
 * Đi từ code tạo ra table
 *    tạo table bằng code javascript
 */

// // Tạo ra Model từ define
// const Cars = sequelize.define(
//   "Cars",
//   {
//     car_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//     },
//     description: {
//       type: DataTypes.TEXT,
//     },
//     passengers: {
//       type: DataTypes.INTEGER,
//     },
//     max_speed: {
//       type: DataTypes.STRING,
//     },
//     gearbox_type: {
//       type: DataTypes.STRING,
//     },
//     fuel_type: {
//       type: DataTypes.STRING,
//     },
//     price_per_day: {
//       type: DataTypes.DOUBLE,
//     },
//     discount_percentage: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0,
//     },
//     image_url: {
//       type: DataTypes.STRING,
//     },
//     created_at: {
//       type: DataTypes.DATE,
//     },
//     updated_at: {
//       type: DataTypes.DATE,
//     },
//   },
//   { tableName: "cars", timestamps: false }
// );

// // Đồng bộ giữa code và table
// Cars.sync()

//   .then((result) => {
//     console.log("📢[sever.js:158]: Thành Công: ", result);
//   })

//   .catch((err) => {
//     console.log("📢[sever.js:162]: Thất Bại: ", err);
//   });

// app.get(`/cars`, async (request, response, next) => {
//   // const cars = await sequelize.query(`SELECT * FROM cars`);
//   const cars = await Cars.findAll({ raw: true });
//   console.log("📢[sever.js:163]: cars: ", cars);

//   // // trả dữ liệu về
//   response.json(cars);
// });

/**
 * Database first
 * Đi từ câu lệnh SQL để tạo ra table
 *    - tạo table bằng câu lệnh SQL
 *    - sequelize-auto
 *    - npm i sequelize-auto
 *
 *    - npx sequelize-auto -h localhost -d db_cyber_media -u root -x 1234 -p 3307  --dialect mysql -o src/models -a src/models/additional.json -l esm
 */

// const models = initModels(sequelize);
// app.get(`/videos-list`, async (request, response, next) => {
//   const videos = await models.videos.findAll({ raw: true });
//   // // trả dữ liệu về
//   response.json(videos);
// });

// tham số: port: 8386 ~ thường sẽ đễ từ 3000 trở lên ~ ứng dụng nào cũng cần có
// tham số: callbackfunction: chạy port

//------
// app.listen(8386, () => {
//   console.log(`Sever online at port 8386`);
// });
// Sau khi cài đặt socket.io thì sẽ thay thế thành http.listen
httpServer.listen(8386, () => {
  console.log(`Sever online at port 8386`);
});
//------
//------------ LƯU lẠI
/**
 * request: ~~ object ~~ Lấy data từ client
 * response: ~~ object ~~ Trả data về client  --> Tại sao lại là response.json ~~ dữ liệu gửi đi qua lại giữa frontend và backend là json
 * next:
 */

// app.get("/", (request, response, next) => {
//   console.log("123");
//   response.json(`hello world`);
// });

// Cách 1
// /**
//  * Query Parameters
//  * Thường dùng khi: phân trang, search, fillter
//  */

// app.get("/query", (request, response, next) => {
//   console.log(request.query);

//   const { email, password } = request.query;

//   console.log(email, password);

//   response.json("Query Parameters");
// });

// Cách 2
// /**
//  * Path Parameters
//  * Thường dùng khi: Muốn lấy chi tiết (detail) của một user, product,...
//  */

// app.get("/path/:id", (request, response, next) => {
//   console.log(request.params);
//   response.json("Path Parameters");
// });

// Cách 3
// /**
//  * Headers
//  */

// app.get("/headers", (request, response, next) => {
//   console.log(request.headers);
//   response.json("Headers Parameters");
// });

// Cách 4
// /**
//  * Body ~~ Nhớ chuyển sang POST
//  * Để nhận được dữ liệu từ body phải có
//  * app.use(express.json)
//  * hoặc là: dùng thư viện parser
//  */

// app.post("/body", (request, response, next) => {
//   console.log(request.body);
//   response.json("Body Parameters");
// });

// -------------------------------------------------------------

/**
 * PRISMA
 *    - npm i prisma
 *    - npm i @prisma/client
 *
 *    - npx prisma init: khởi tạo prisma
 *       - tạo ra .env
 *       - tạo ra prisma/schema.prisma
 *
 *   - Nếu thay đổi (cập nhật) thông tin ở data base. Thì sẽ chạy lại 2 câu này
 *    - npx prisma db pull
 *    - npx prisma generate
 *
 * ** npm i dotenv chạy này để đọc file env.
 * ** npm i dotenv
 * ** import 'dotenv/config
 */

/**
 * 
 * Dòng code bên sprit của postman
 * 
 * const response = pm.response.json()

if(response.status === "error") return

const accessToken = response.metaData.accessToken
const refreshToken = response.metaData.refreshToken

pm.globals.set("accessToken", accessToken);
pm.globals.set("refreshToken", refreshToken);
 */
