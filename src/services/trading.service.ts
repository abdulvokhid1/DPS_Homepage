/** @format */

// No Prisma in your Node.js project — we return mock matched user (or null)

export interface TradingMatchedUser {
  id: string;
  accountNumber: string;
  email?: string;
  name?: string;
  userNumber?: number;
  approvalStatus?: string | null;
  paymentStatus?: string | null;
  accessExpiresAt?: string | Date | null;
}

export interface TradingOrder {
  infoCode?: number | string | null;
  accountNumber?: string | number | null;
  lots?: string | number | null;
  AckInfo?: string | number | null;
  [key: string]: any;
}

export interface TradingDataItem {
  round: number | string;
  contracts: number;
  loss: number;
  mark: "W" | "L";
  accountNumber: string | null;
}

let orders: TradingOrder[] = [];

export class TradingService {
  /**
   * In your Node backend, you said:
   * ❗ We do NOT connect to Prisma
   * Therefore we simulate user lookup (always null for now)
   */
  async addOrder(order: TradingOrder): Promise<TradingMatchedUser | null> {
    orders.push(order);

    // 🔹 No actual DB lookup — always return null (or implement your logic)
    return null;
  }

  getOrders(): TradingOrder[] {
    return orders;
  }

  getTradingData(): {
    tradingData: TradingDataItem[];
    totalLoss: number;
  } {
    const toNumber = (v: any): number => {
      if (typeof v === "number" && Number.isFinite(v)) return v;
      if (typeof v === "string") {
        const cleaned = v.replace(/[^0-9.\-]/g, "");
        const n = parseFloat(cleaned);
        return Number.isNaN(n) ? 0 : n;
      }
      const n = Number(v);
      return Number.isNaN(n) ? 0 : n;
    };

    const tradingData: TradingDataItem[] = orders.map((order, index) => {
      const lossValue = Math.trunc(toNumber(order.AckInfo)) || 0;

      const accountNumber =
        order.accountNumber != null
          ? String(order.accountNumber)
          : order.lots != null
          ? String(order.lots)
          : null;

      return {
        round: order.infoCode ?? index + 1,
        contracts: 0,
        loss: lossValue,
        mark: lossValue >= 0 ? "W" : "L",
        accountNumber,
      };
    });

    const totalLoss = tradingData.reduce((sum, item) => sum + item.loss, 0);

    return { tradingData, totalLoss };
  }

  resetOrders() {
    orders = [];
    console.log("♻ Orders reset");
  }
}

export const tradingService = new TradingService();
