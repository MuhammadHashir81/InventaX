import { Router } from "express";
import { verifyUser } from "../middlware/UserMiddleware.js";
import { handleAddOutflow, handleDeleteOutflow, handleGetAllOutflows } from "../controllers/outflow.controller.js";
import { subscriptionCheck } from "../middlware/SubscriptionCheck.js";

const outflowRouter = Router();

outflowRouter.post("/add", verifyUser, subscriptionCheck,handleAddOutflow);
outflowRouter.get("/get-all", verifyUser, subscriptionCheck,handleGetAllOutflows);
outflowRouter.delete("/delete/:id", verifyUser, subscriptionCheck,handleDeleteOutflow);

export { outflowRouter };
