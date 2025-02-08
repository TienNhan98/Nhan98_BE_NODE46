import express from "express";
import { chatController } from "../controllers/chat.controllers.js";
import { protect } from "../common/middlewares/protect.middleware.js";

const chatRouter = express.Router();

// Tạo route CRUD
chatRouter.post("/", chatController.create);
chatRouter.get("/", chatController.findAll);
chatRouter.get("/list-user-chat", protect, chatController.listUserChat);
// tại sao ở .get này có /detail ~~ là do mình thiết kế để tránh conflict khi gọi api đều chung 1 phương thức là .get
chatRouter.get("/detail/:id", chatController.findOne);
chatRouter.patch("/:id", chatController.update);
chatRouter.delete("/:id", chatController.remove);

export default chatRouter;
