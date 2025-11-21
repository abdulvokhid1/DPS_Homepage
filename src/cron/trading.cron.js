/** @format */

import cron from "node-cron";
import { tradingService } from "../services/trading.service.js";

cron.schedule("0 0 6 * * 1", () => {
  tradingService.resetOrders();
});
