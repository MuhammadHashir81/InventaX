import { Router } from "express";
import { getAllTenants, getRevenueStats } from "../controllers/super.admin.controller.js";
import { getSuperDashboardContext } from "../controllers/super.admin.dashboard.controller.js";
export const superAdminRouter = Router()


superAdminRouter.get('/get-all-tenants',getAllTenants)
superAdminRouter.get('/get-revenue',getRevenueStats)
superAdminRouter.post('/get-dashboard-context',getSuperDashboardContext)