import { calculatePortfolioPerformance, PortfolioPerformance, getLargestHolding, Asset } from "../src/portfolio/portfolioPerformance";

describe("calculatePortfolioPerformance", () => {
  it("should return significant gain when profit is more than 20%", () => {
    const result: PortfolioPerformance = calculatePortfolioPerformance(10000, 17000);
    expect(result.profitOrLoss).toBe(7000);
    expect(result.percentageChange).toBeCloseTo(70);
    expect(result.performanceSummary).toBe("The portfolio has gained significantly with a profit of $7000.");
  });

  it("should return slight loss when portfolio loses less than 10%", () => {
    const result: PortfolioPerformance = calculatePortfolioPerformance(10000, 9400);
    expect(result.profitOrLoss).toBe(-600);
    expect(result.percentageChange).toBeCloseTo(-6);
    expect(result.performanceSummary).toBe("The portfolio has lost slightly with a loss of $-600.");
  });

  it("should return no change when initialInvestment equals currentValue", () => {
    const result: PortfolioPerformance = calculatePortfolioPerformance(20000, 20000);
    expect(result.profitOrLoss).toBe(0);
    expect(result.percentageChange).toBe(0);
    expect(result.performanceSummary).toBe("The portfolio has no change.");
  });
});

describe("getLargestHolding", () => {
  it("should return null if the assets array is empty", () => {
    const assets: Asset[] = [];
    const result = getLargestHolding(assets);
    expect(result).toBeNull();
  });

  it("should return the asset with the highest value", () => {
    const assets: Asset[] = [
      { name: "House", value: 50000 },
      { name: "Stocks", value: 30000 },
      { name: "Bonds", value: 20000 },
    ];
    const result = getLargestHolding(assets);
    expect(result).toEqual({ name: "House", value: 50000 });
  });
});