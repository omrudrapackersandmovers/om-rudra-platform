/**
 * fareEstimator.js
 * Computes realistic, transparent moving fare estimates based on:
 * - Service Category
 * - Move Size (BHK / Volume)
 * - Scope (Local, Same State, Interstate)
 */

export function calculateFareEstimate({ service = "Home shifting", moveSize = "", moveType = "" }) {
  const normService = (service || "").toLowerCase();
  const normSize = (moveSize || "").toLowerCase();
  const isInterstate = normTypeIncludes(moveType, "another state", "interstate");
  const isSameState = normTypeIncludes(moveType, "within the state", "same state");

  // Bike Transport
  if (normService.includes("bike")) {
    if (isInterstate) return { min: "Rs 3,500", max: "Rs 6,800", unit: "complete crated transit" };
    if (isSameState) return { min: "Rs 2,800", max: "Rs 4,500", unit: "doorstep delivery" };
    return { min: "Rs 1,500", max: "Rs 2,800", unit: "door-to-door local" };
  }

  // Car Transport
  if (normService.includes("car")) {
    if (isInterstate) return { min: "Rs 9,500", max: "Rs 22,000", unit: "hydraulic enclosed carrier" };
    if (isSameState) return { min: "Rs 5,500", max: "Rs 8,500", unit: "dedicated carrier" };
    return { min: "Rs 2,500", max: "Rs 4,500", unit: "towing & city transit" };
  }

  // Office Shifting
  if (normService.includes("office") || normSize.includes("office")) {
    if (isInterstate) return { min: "Rs 25,000", max: "Rs 65,000+", unit: "dedicated closed container" };
    if (isSameState) return { min: "Rs 15,000", max: "Rs 32,000+", unit: "full commercial crew" };
    return { min: "Rs 7,000", max: "Rs 16,000+", unit: "weekend / zero-downtime" };
  }

  // Storage / Warehousing
  if (normService.includes("storage") || normService.includes("warehousing")) {
    return { min: "Rs 1,800", max: "Rs 4,500", unit: "per month (CCTV secure)" };
  }

  // Home Shifting: Evaluate by move size
  if (normSize.includes("4+") || normSize.includes("villa") || normSize.includes("4 bhk")) {
    if (isInterstate) return { min: "Rs 32,000", max: "Rs 52,000", unit: "dedicated 22ft container" };
    if (isSameState) return { min: "Rs 20,000", max: "Rs 30,000", unit: "large volume crew" };
    return { min: "Rs 12,000", max: "Rs 18,000", unit: "all packing & floor placement" };
  }

  if (normSize.includes("3 bhk") || normSize.includes("3-bhk")) {
    if (isInterstate) return { min: "Rs 24,000", max: "Rs 38,000", unit: "dedicated container transit" };
    if (isSameState) return { min: "Rs 14,500", max: "Rs 21,500", unit: "full household packing" };
    return { min: "Rs 8,000", max: "Rs 12,500", unit: "5-layer packing & setup" };
  }

  if (normSize.includes("2 bhk") || normSize.includes("2-bhk")) {
    if (isInterstate) return { min: "Rs 16,000", max: "Rs 26,000", unit: "doorstep delivery & insurance" };
    if (isSameState) return { min: "Rs 10,500", max: "Rs 15,500", unit: "door-to-door transit" };
    return { min: "Rs 5,500", max: "Rs 8,500", unit: "complete 2BHK relocation" };
  }

  if (normSize.includes("1 bhk") || normSize.includes("1-bhk")) {
    if (isInterstate) return { min: "Rs 12,000", max: "Rs 18,000", unit: "safe transit & unloading" };
    if (isSameState) return { min: "Rs 6,500", max: "Rs 10,500", unit: "protective wrapping" };
    return { min: "Rs 3,500", max: "Rs 5,500", unit: "materials + transport" };
  }

  if (normSize.includes("few") || normSize.includes("single room")) {
    if (isInterstate) return { min: "Rs 7,500", max: "Rs 13,000", unit: "shared container route" };
    if (isSameState) return { min: "Rs 4,500", max: "Rs 7,500", unit: "express mini-van" };
    return { min: "Rs 2,500", max: "Rs 4,000", unit: "mini-truck & 2 loaders" };
  }

  // Default ballpark when move size is yet to be picked
  if (isInterstate) return { min: "Rs 12,000", max: "Rs 28,000", unit: "route-based estimate" };
  if (isSameState) return { min: "Rs 7,000", max: "Rs 16,000", unit: "regional transit" };
  return { min: "Rs 3,500", max: "Rs 8,500", unit: "local city relocation" };
}

function normTypeIncludes(typeStr, ...needles) {
  const s = (typeStr || "").toLowerCase();
  return needles.some((n) => s.includes(n));
}
