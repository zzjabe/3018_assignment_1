import request from "supertest";
import app from "../src/app";

describe("Portfolio routes", () => {
    it("GET /api/v1/portfolio/performance uses query params", async () => {
        const res = await request(app)
            .get("/api/v1/portfolio/performance")
            .query({ initialInvestment: 10000, currentValue: 12000 });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("profitOrLoss", 2000);
        expect(res.body).toHaveProperty("percentageChange");
    });

    it("GET /api/v1/portfolio/largest-holding with assets param", async () => {
        const assets = JSON.stringify([
            { name: "Houses", value: 1000 },
            { name: "Stocks", value: 2000 }
        ]);
        const res = await request(app)
            .get("/api/v1/portfolio/largest-holding")
            .query({ assets });
        expect(res.status).toBe(200);
        expect(res.body.largest).toEqual({ name: "Stocks", value: 2000 });
    });

    it("GET /api/v1/portfolio/allocation returns allocation", async () => {
        const assets = JSON.stringify([
            { name: "Houses", value: 5000 },
            { name: "Stocks", value: 5000 }
        ]);
        const res = await request(app)
            .get("/api/v1/portfolio/allocation")
            .query({ assets });
        expect(res.status).toBe(200);
        expect(res.body.allocation[0]).toHaveProperty("percentage");
        const total: number = res.body.allocation.reduce((s: number, a: any) => s + a.percentage, 0);
        expect(Math.round(total)).toBe(100);
    });
});