// Define an interface
export interface PortfolioPerformance {
  initialInvestment: number;
  currentValue: number;
  profitOrLoss: number;
  percentageChange: number;
  performanceSummary: string;
}

// Add parament to connect the interface
export function calculatePortfolioPerformance(
    initialInvestment: number = 10000,
    currentValue: number = 12000
): PortfolioPerformance {
    const profitOrLoss = currentValue - initialInvestment;

    const percentageChange = (profitOrLoss / initialInvestment) * 100;

    // Use ternary expression to replace if condition
    const performanceSummary: string = (
        Number.isFinite(percentageChange)
            ? percentageChange > 20
                ? `The portfolio has gained significantly with a profit of $${profitOrLoss}.`
                : percentageChange > 10
                ? `The portfolio has gained moderately with a profit of $${profitOrLoss}.`
                : percentageChange > 0
                ? `The portfolio has gained slightly with a profit of $${profitOrLoss}.`
                : percentageChange === 0
                ? `The portfolio has no change.`
                : percentageChange > -10
                ? `The portfolio has lost slightly with a loss of $${profitOrLoss}.`
                : percentageChange > -20
                ? `The portfolio has lost moderately with a loss of $${profitOrLoss}.`
                : `The portfolio has lost significantly with a loss of $${profitOrLoss}.`
            : `Percentage change unavailable.`
    );

    return {
        initialInvestment,
        currentValue,
        profitOrLoss,
        percentageChange,
        performanceSummary,
    };
}

export interface Asset {
  name: string;
  value: number;
}

export function getLargestHolding(assets: Asset[]): Asset | null {
  if (assets.length === 0) return null; 

  let maxAsset: Asset = assets[0];
  for (const asset of assets) {
    if (asset.value > maxAsset.value) {
      maxAsset = asset;
    }
  }
  return maxAsset;
}

export interface AssetAllocation {
  name: string;
  percentage: number;
}

export function calculateAssetAllocation(assets: Asset[]): AssetAllocation[] {
  const totalValue: number = assets.reduce((sum, asset) => sum + asset.value, 0);

  return assets.map(asset => ({
    name: asset.name,
    percentage: (asset.value / totalValue) * 100,
  }));
}