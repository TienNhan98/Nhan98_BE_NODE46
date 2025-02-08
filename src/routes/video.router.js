import express from "express";
import models from "../common/sequelize/init.sequelize.js";
import videoController from "../controllers/video.controllers.js";
import { protect } from "../common/middlewares/protect.middleware.js";
import checkPermission from "../common/middlewares/check-permission,middleware.js";

const videoRouter = express.Router();

videoRouter.get(
  "/video-list",
  protect,
  checkPermission,
  videoController.videoList
);

videoRouter.get("/video-detail/:id", protect, videoController.videoDetail);

export default videoRouter;
