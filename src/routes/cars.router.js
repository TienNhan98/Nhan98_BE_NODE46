import express from "express";
import Cars from "../models/cars.model.js";
import carController from "../controllers/car.controllers.js";

const carRouter = express.Router();

carRouter.get(`/cars`, carController.carList);

export default carRouter;

const sum = (a, b) => {
  return a + b;
};

sum(1, 3);
