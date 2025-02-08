import express from "express";
import videoRouter from "./video.router.js";
import carRouter from "./cars.router.js";
import authRouter from "./auth.router.js";
import roleRouter from "./role.router.js";
import permissionRouter from "./permission.router.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../common/swagger/init.swagger.js";
import chatRouter from "./chat.router.js";

const rootRouter = express.Router();

rootRouter.use("/api-docs", swaggerUi.serve);
rootRouter.get(
  "/api-docs",
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: { persistAuthorization: true },
  })
);

rootRouter.get(`/`, (request, response, next) => {
  response.json(`ok`);
});

rootRouter.use("/video", videoRouter);

rootRouter.use("/car", carRouter);

rootRouter.use("/auth", authRouter);

rootRouter.use("/role", roleRouter);

rootRouter.use("/permission", permissionRouter);

rootRouter.use("/chat", chatRouter);

rootRouter.use("/facebook-login", authRouter);

// rootRouter.use('/user', userRouter)
// rootRouter.use('/role', roleRouter)

export default rootRouter;
