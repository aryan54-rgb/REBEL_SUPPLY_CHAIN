/**
 * ============================================================
 * Dynamic Risk Engine
 * 
 * Calculates supplier risk based on:
 * - Regional conditions (geopolitical, weather, logistics)
 * - Supplier base risk
 * - Multi-dimensional risk factors
 * - [NEW] Live Weather Simulation
 * 
 * Formula Weights:
 *   finalRiskScore = (Impact * Probability) + Dependency
 *   where:
 *   Probability = 0.4 * geo + 0.3 * log + 0.3 * weather
 * ============================================================
 */

/**
 * Simulates a "Live Weather" risk bit based on coordinates and current time.
 * In a real-world app, this would call an API like OpenWeather.
 * We use a deterministic sine-wave based on lat/lon to simulate "moving" weather patterns.
 */
export function getLiveWeatherRisk(lat: number, lon: number): number {
  const time = Date.now() / (1000 * 60 * 60); // hours since epoch
  const latPhase = Math.sin(lat * 0.1 + time * 0.05);
  const lonPhase = Math.cos(lon * 0.1 + time * 0.03);

  // Base risk 20-80 range
  let risk = 50 + (latPhase + lonPhase) * 15;

  // High risk "storms" near equator during certain cycles
  if (Math.abs(lat) < 20 && Math.sin(time * 0.1) > 0.8) {
    risk += 20;
  }

  return Math.round(Math.max(0, Math.min(100, risk)));
}

import { getRegionalRiskProfile } from "./regionRisk";

export interface RiskCalculationInput {
  region: string;
  supplierBaseRisk: number;
  geopoliticalRisk?: number;
  weatherRisk?: number;
  shippingRisk?: number;
}

export interface RiskCalculationResult {
  finalRiskScore: number;
  regionalRiskComponent: number;
  logisticsRiskComponent: number;
  weatherRiskComponent: number;
  baseRiskComponent: number;
  breakdown: {
    regional: number;
    logistics: number;
    weather: number;
    base: number;
  };
}

/**
 * Calculate supplier risk based on region and supplier characteristics
 * 
 * @param region - Geographic region of supplier
 * @param supplierBaseRisk - Inherent supplier risk (0-100)
 * @returns Normalized risk score (0-100)
 */
export function calculateSupplierRisk(
  region: string,
  supplierBaseRisk: number
): number {
  const result = calculateDetailedSupplierRisk(region, supplierBaseRisk);
  return result.finalRiskScore;
}

/**
 * Calculate supplier risk with detailed breakdown
 * Updated to use Live Weather and (Impact * Probability) formula
 */
export function calculateDetailedSupplierRisk(
  region: string,
  supplierBaseRisk: number, // Used as "Impact" weight
  lat?: number,
  lon?: number,
  geopoliticalRisk?: number,
  weatherRisk?: number,
  shippingRisk?: number,
  dependencyCount: number = 0
): RiskCalculationResult {
  const regionalProfile = getRegionalRiskProfile(region);

  // Use live weather if lat/lon provided, else fallback
  const liveWeather = (lat !== undefined && lon !== undefined)
    ? getLiveWeatherRisk(lat, lon)
    : (weatherRisk ?? regionalProfile.weather);

  const actualShippingRisk = shippingRisk ?? regionalProfile.logistics;
  const actualGeopoliticalRisk = geopoliticalRisk ?? regionalProfile.geopolitical;

  // Probability Math (0-100)
  const probabilityScore = (
    0.4 * actualGeopoliticalRisk +
    0.3 * actualShippingRisk +
    0.3 * liveWeather
  );

  // Formula: (Impact * Probability) + Dependency
  // Normalizing Impact (supplierBaseRisk) to a 0-1 multiplier (Impact / 100)
  const impactMultiplier = supplierBaseRisk / 100;

  // Dependency weight: 5 points per connection, max 20
  const dependencyWeight = Math.min(20, dependencyCount * 5);

  let finalRiskScore = (impactMultiplier * probabilityScore) + dependencyWeight;

  // Clamp to 0-100 range
  finalRiskScore = Math.max(0, Math.min(100, finalRiskScore));

  return {
    finalRiskScore: Math.round(finalRiskScore),
    regionalRiskComponent: Math.round(actualGeopoliticalRisk),
    logisticsRiskComponent: Math.round(actualShippingRisk),
    weatherRiskComponent: Math.round(liveWeather),
    baseRiskComponent: supplierBaseRisk,
    breakdown: {
      regional: Math.round(0.4 * actualGeopoliticalRisk),
      logistics: Math.round(0.3 * actualShippingRisk),
      weather: Math.round(0.3 * liveWeather),
      base: Math.round(dependencyWeight), // Re-purposing base for dependency for now
    },
  };
}

/**
 * Apply dynamic risk calculations to a list of suppliers
 * Returns new nodes with updated risk scores
 * Uses supplier's existing risk components when available
 */
export function applyDynamicRiskToNodes<
  T extends {
    id: string
    risk_score: number
    region: string
    lat: number
    lon: number
    geopolitical_risk?: number
    weather_risk?: number
    shipping_risk?: number
  }
>(nodes: T[]): T[] {
  return nodes.map((node) => {
    const detailedRisk = calculateDetailedSupplierRisk(
      node.region,
      40, // Base impact weight
      node.lat,
      node.lon,
      node.geopolitical_risk,
      node.weather_risk,
      node.shipping_risk
    );

    return {
      ...node,
      risk_score: detailedRisk.finalRiskScore,
    };
  });
}

/**
 * Recalculate average risk across nodes
 * Updated to reflect dynamic risk scores
 */
export function calculateAverageRisk(nodes: { risk_score: number }[]): number {
  if (nodes.length === 0) return 0;
  const total = nodes.reduce((sum, node) => sum + node.risk_score, 0);
  return Math.round(total / nodes.length);
}

/**
 * Count high-risk suppliers (risk_score > threshold)
 */
export function countHighRiskSuppliers(
  nodes: { risk_score: number }[],
  threshold: number = 55
): number {
  return nodes.filter((node) => node.risk_score > threshold).length;
}

/**
 * Get risk analysis summary for a node
 * Useful for detailed risk breakdowns in UI
 */
export function getRiskAnalysisSummary(
  nodeName: string,
  region: string,
  currentRiskScore: number,
  riskDetails: RiskCalculationResult
): string {
  return `${nodeName} in ${region} has a dynamic risk score of ${currentRiskScore} (Geopolitical: ${riskDetails.breakdown.regional}, Logistics: ${riskDetails.breakdown.logistics}, Weather: ${riskDetails.breakdown.weather}, Base: ${riskDetails.breakdown.base})`;
}
