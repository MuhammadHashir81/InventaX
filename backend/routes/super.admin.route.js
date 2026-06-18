import { Router } from "express";
import { getAllTenants, getRevenueStats } from "../controllers/super.admin.controller.js";
export const superAdminRouter = Router()


superAdminRouter.get('/get-all-tenants',getAllTenants)
superAdminRouter.get('/get-revenue',getRevenueStats)