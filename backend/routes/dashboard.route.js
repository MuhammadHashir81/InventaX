import { Router } from "express";
import { verifyUser } from "../middlware/UserMiddleware.js";
import {
    handleGetDashboardSummary,
    handleGetTopCustomers,
    handleGetTopProducts,
} from "../controllers/dashboard.controller.js";
import { subscriptionCheck } from "../middlware/SubscriptionCheck.js";

const dashboardRouter = Router();

dashboardRouter.post("/summary", verifyUser,subscriptionCheck, handleGetDashboardSummary);
dashboardRouter.post("/top-products", verifyUser,subscriptionCheck, handleGetTopProducts);
dashboardRouter.post("/top-customers", verifyUser,subscriptionCheck, handleGetTopCustomers);

export { dashboardRouter };
