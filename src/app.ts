import express, { Express } from "express";
import { calculatePortfolioPerformance, PortfolioPerformance, getLargestHolding, Asset, 
    AssetAllocation, calculateAssetAllocation} from "../src/portfolio/portfolioPerformance";

// Initialize Express application
const app: Express = express();

// Define a route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

/*
1. Heath check endpoint
*/
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

/*
Helper: parse assets from query param `assets`
Expect assets query as JSON string like:
?assets=[{"name":"Stocks","value":5000},{"name":"Bonds","value":5000}]
*/
function parseAssetsQuery(q: any): Asset[] | null {
    if (!q) return null;
    try {
        if (typeof q === "string") {
            const parsed = JSON.parse(q);
            if (Array.isArray(parsed)) return parsed as Asset[];
    }
    if (Array.isArray(q)) return q as Asset[];
    } catch (e) {
        return null;
    }
    return null;
}

/*
 2. Portfolio performance endpoint
 GET /api/v1/portfolio/performance?initialInvestment=10000&currentValue=12000
 If no params provided, use defaults inside calculatePortfolioPerformance
*/
app.get("/api/v1/portfolio/performance", (req, res) => {
    const initial = req.query.initialInvestment ? Number(req.query.initialInvestment) : undefined;
    const current = req.query.currentValue ? Number(req.query.currentValue) : undefined;

    // If provided but NaN -> bad request
    if ((initial !== undefined && Number.isNaN(initial)) || (current !== undefined && Number.isNaN(current))) {
    return res.status(400).json({ error: "initialInvestment and currentValue must be numbers" });
    }

    // call function with supplied values or defaults
    const result: PortfolioPerformance =
        initial !== undefined && current !== undefined
        ? calculatePortfolioPerformance(initial, current)
        : calculatePortfolioPerformance(); // use defaults
    return res.json(result);
});

/*
3. Largest holding endpoint
GET /api/v1/portfolio/largest-holding?assets=[{"name":"Houses","value":100},{"name":"Stocks","value":200}]
If assets not provided -> return example or error (choose your preference)
*/
app.get("/api/v1/portfolio/largest-holding", (req, res) => {
    const raw = req.query.assets;
    const parsed = parseAssetsQuery(raw);

    if (!parsed) {
        const example: Asset[] = [
            { name: "House", value: 300000 },
            { name: "Stocks", value: 50000 },
            { name: "Bonds", value: 20000 },
        ];
        const largest = getLargestHolding(example);
        return res.json({ note: "No assets provided - returning example result", largest });
    }

    const largest = getLargestHolding(parsed);
    return res.json({ largest });
});

/*
4. Asset allocation endpoint
GET /api/v1/portfolio/allocation?assets=[{"name":"Houses","value":100},{"name":"Stocks","value":200}]
*/
app.get("/api/v1/portfolio/allocation", (req, res) => {
    const raw = req.query.assets;
    const parsed = parseAssetsQuery(raw);

    if (!parsed) {
        return res.status(400).json({ error: "Missing or invalid 'assets' query parameter. Provide a JSON array." });
    }

    const allocation: AssetAllocation[] = calculateAssetAllocation(parsed);
    return res.json({ allocation });
});

export default app;