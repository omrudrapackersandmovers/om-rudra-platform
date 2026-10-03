/**
 * pricing.js — Single Source of Truth for all pricing data and relocation rates.
 *
 * Every component or page requiring rates, estimates, or estimator options
 * MUST import from this file. Never duplicate or hardcode pricing anywhere else.
 *
 * Changing a rate here updates:
 * 1. The main Pricing page (/pricing)
 * 2. All 114 city and district pages (/packers-movers-:slug)
 * 3. All 36 interstate route pages (/route/:slug)
 * 4. Move cost estimators and quotation previews
 */

/**
 * Move estimator configurations for room sizes, vehicles, and commercial relocations.
 */
export const estimatorOptions = [
  {
    id: "1bhk",
    label: "1 BHK Apartment",
    iconKey: "home",
    localPrice: "Rs 3,500 - Rs 6,500",
    interstatePrice: "Rs 8,500 - Rs 17,500",
    startingPriceLocal: 3500,
    startingPriceInterstate: 8500,
    truck: "10ft - 14ft Closed Container",
    crew: "2-3 Verified Packers",
    duration: "4-6 Hours (Local) / 2-3 Days (Interstate)",
    packingSupplies: "5-ply cartons, bubble wrap, stretch film and tape included",
  },
  {
    id: "2bhk",
    label: "2 BHK Apartment",
    iconKey: "home",
    localPrice: "Rs 5,500 - Rs 10,000",
    interstatePrice: "Rs 14,000 - Rs 27,500",
    startingPriceLocal: 5500,
    startingPriceInterstate: 14000,
    truck: "14ft - 17ft Closed Container",
    crew: "3-4 Verified Packers",
    duration: "6-8 Hours (Local) / 3-4 Days (Interstate)",
    packingSupplies: "Heavy corrugated sheets, foam rolls, wardrobe cartons",
  },
  {
    id: "3bhk",
    label: "3 BHK Apartment",
    iconKey: "home",
    localPrice: "Rs 8,500 - Rs 16,000",
    interstatePrice: "Rs 22,000 - Rs 42,000",
    startingPriceLocal: 8500,
    startingPriceInterstate: 22000,
    truck: "19ft - 22ft Dedicated Truck",
    crew: "4-6 Verified Packers",
    duration: "Full Day (Local) / 3-5 Days (Interstate)",
    packingSupplies: "Custom crating, multi-layer furniture blankets and boxes",
  },
  {
    id: "4bhk",
    label: "4+ BHK / Villa",
    iconKey: "home",
    localPrice: "Rs 14,000 - Rs 26,000",
    interstatePrice: "Rs 34,000 - Rs 65,000+",
    startingPriceLocal: 14000,
    startingPriceInterstate: 34000,
    truck: "24ft - 32ft Multi-Axle Carrier",
    crew: "6-8 Verified Packers",
    duration: "1-2 Days (Local) / 4-6 Days (Interstate)",
    packingSupplies: "Export-grade packing, wooden crates for heirlooms",
  },
  {
    id: "bike",
    label: "Two-Wheeler / Bike",
    iconKey: "bike",
    localPrice: "Rs 1,500 - Rs 2,800",
    interstatePrice: "Rs 3,500 - Rs 6,800",
    startingPriceLocal: 1500,
    startingPriceInterstate: 3500,
    truck: "Specialized Crated Carrier",
    crew: "2 Specialized Handlers",
    duration: "Same Day (Local) / 3-5 Days (Interstate)",
    packingSupplies: "Bubble wrap, corrugated wrap and timber crating",
  },
  {
    id: "car",
    label: "Car / Sedan / SUV",
    iconKey: "car",
    localPrice: "Rs 2,500 - Rs 4,500",
    interstatePrice: "Rs 9,500 - Rs 22,000",
    startingPriceLocal: 2500,
    startingPriceInterstate: 9500,
    truck: "Hydraulic Enclosed Car Carrier",
    crew: "Vehicle Logistics Specialist",
    duration: "Same Day (Local) / 4-7 Days (Interstate)",
    packingSupplies: "Wheel chocks, hydraulic ramps, protective body cover",
  },
  {
    id: "office",
    label: "Office / Commercial",
    iconKey: "office",
    localPrice: "Rs 9,000 - Rs 28,000+",
    interstatePrice: "Rs 28,000 - Rs 85,000+",
    startingPriceLocal: 9000,
    startingPriceInterstate: 28000,
    truck: "Dedicated Multi-Fleet Convoy",
    crew: "IT and Modular Relocation Team",
    duration: "Weekend / Overnight Shift",
    packingSupplies: "Anti-static server wraps, labeled file crates, modular desk packs",
  },
];

/**
 * Tab options on the pricing page.
 */
export const pricingTabs = [
  { id: "local", label: "Local Home Shifting" },
  { id: "interstate", label: "Interstate Corridors" },
  { id: "vehicles", label: "Vehicle Transport" },
  { id: "addons", label: "Add-Ons & Services" },
];

/**
 * Detailed local household shifting rate cards.
 */
export const localHouseholdRates = [
  {
    size: "1 BHK (Studio / 1 Bedroom)",
    packing: "5-ply cartons, bubble wrap and cling film",
    vehicle: "Tata Ace / 10ft Closed Container",
    crew: "2-3 Men",
    time: "4 - 6 Hours",
    priceRange: "Rs 3,500 - Rs 6,500",
    slug: "home-shifting",
  },
  {
    size: "2 BHK (Standard Apartment)",
    packing: "Heavy corrugated sheets, foam and cartons",
    vehicle: "14ft - 17ft Closed Container",
    crew: "3-4 Men",
    time: "6 - 8 Hours",
    priceRange: "Rs 5,500 - Rs 10,000",
    slug: "home-shifting",
  },
  {
    size: "3 BHK (Large Apartment)",
    packing: "Multi-layer furniture padding and crating",
    vehicle: "19ft Dedicated Closed Truck",
    crew: "4-6 Men",
    time: "1 Full Day",
    priceRange: "Rs 8,500 - Rs 16,000",
    slug: "home-shifting",
  },
  {
    size: "4+ BHK / Independent Villa",
    packing: "Comprehensive master packing and wardrobe boxes",
    vehicle: "22ft - 32ft Container or 2 Trucks",
    crew: "6-8 Men",
    time: "1 - 2 Days",
    priceRange: "Rs 14,000 - Rs 26,000",
    slug: "home-shifting",
  },
];

/**
 * High-volume interstate corridors with price ranges by apartment size.
 */
export const interstateCorridors = [
  {
    corridor: "Bihar to Delhi NCR (Gurgaon, Noida, Delhi)",
    distance: "~1,050 km",
    transit: "2 - 3 Days",
    truckType: "Dedicated Sealed Container",
    range1BHK: "Rs 12,000 - Rs 18,000",
    range2BHK: "Rs 18,000 - Rs 28,000",
    range3BHK: "Rs 28,000 - Rs 48,000",
  },
  {
    corridor: "Bihar to West Bengal (Kolkata, Siliguri)",
    distance: "~580 km",
    transit: "1 - 2 Days",
    truckType: "Dedicated Sealed Container",
    range1BHK: "Rs 9,000 - Rs 14,000",
    range2BHK: "Rs 14,000 - Rs 22,000",
    range3BHK: "Rs 22,000 - Rs 36,000",
  },
  {
    corridor: "Bihar to Jharkhand (Ranchi, Jamshedpur, Dhanbad)",
    distance: "~340 km",
    transit: "1 Day (Overnight)",
    truckType: "Dedicated Sealed Container",
    range1BHK: "Rs 7,500 - Rs 12,000",
    range2BHK: "Rs 11,000 - Rs 18,000",
    range3BHK: "Rs 18,000 - Rs 30,000",
  },
  {
    corridor: "Bihar to Uttar Pradesh (Lucknow, Kanpur, Varanasi)",
    distance: "~520 km",
    transit: "1 - 2 Days",
    truckType: "Dedicated Sealed Container",
    range1BHK: "Rs 8,500 - Rs 13,500",
    range2BHK: "Rs 13,000 - Rs 21,000",
    range3BHK: "Rs 21,000 - Rs 35,000",
  },
  {
    corridor: "Bihar to Maharashtra (Mumbai, Pune, Nagpur)",
    distance: "~1,850 km",
    transit: "4 - 5 Days",
    truckType: "Dedicated Sealed Container",
    range1BHK: "Rs 18,000 - Rs 28,000",
    range2BHK: "Rs 26,000 - Rs 42,000",
    range3BHK: "Rs 40,000 - Rs 72,000",
  },
  {
    corridor: "Bihar to Karnataka & South (Bengaluru, Hyderabad)",
    distance: "~2,050 km",
    transit: "4 - 6 Days",
    truckType: "Dedicated Sealed Container",
    range1BHK: "Rs 20,000 - Rs 32,000",
    range2BHK: "Rs 28,000 - Rs 48,000",
    range3BHK: "Rs 45,000 - Rs 80,000",
  },
];

/**
 * Standard vehicle transport rates.
 */
export const vehicleRates = [
  {
    vehicleType: "Standard Bike / Scooter (100cc - 150cc)",
    method: "Timber Crate Packaging + Bubble Foam",
    insurance: "Included (Up to Rs 50,000 declared)",
    localRate: "Rs 1,500 - Rs 2,500",
    interstateRate: "Rs 3,500 - Rs 5,500",
    slug: "bike-transportation",
  },
  {
    vehicleType: "Sports / Cruiser Motorcycle (200cc - 500cc+)",
    method: "Reinforced Heavy Timber Crate",
    insurance: "Included (Up to Rs 1,50,000 declared)",
    localRate: "Rs 2,000 - Rs 3,200",
    interstateRate: "Rs 4,800 - Rs 8,000",
    slug: "bike-transportation",
  },
  {
    vehicleType: "Hatchback Car (Swift, i10, Baleno, Tiago)",
    method: "Hydraulic Enclosed Multi-Car Carrier",
    insurance: "Transit Insurance with Pre-Inspection",
    localRate: "Rs 2,500 - Rs 3,800",
    interstateRate: "Rs 8,500 - Rs 15,000",
    slug: "car-transportation",
  },
  {
    vehicleType: "Sedan Car (City, Verna, Ciaz, Slavia)",
    method: "Hydraulic Enclosed Multi-Car Carrier",
    insurance: "Transit Insurance with Pre-Inspection",
    localRate: "Rs 2,800 - Rs 4,200",
    interstateRate: "Rs 10,500 - Rs 18,000",
    slug: "car-transportation",
  },
  {
    vehicleType: "SUV / Luxury EV (Creta, Fortuner, XUV700)",
    method: "Hydraulic Enclosed Carrier (Dedicated Slot)",
    insurance: "Transit Insurance with Pre-Inspection",
    localRate: "Rs 3,500 - Rs 5,000",
    interstateRate: "Rs 13,500 - Rs 24,000",
    slug: "car-transportation",
  },
];

/**
 * Standalone add-on services and equipment.
 */
export const addOnServices = [
  {
    service: "Packing & Unpacking Labor Only",
    description: "Export-grade cartons, bubble wrap and professional packers without transport",
    rate: "Rs 1,800 - Rs 10,000",
    unit: "Per move based on items",
    slug: "packing-unpacking",
  },
  {
    service: "Loading & Unloading Crew Only",
    description: "Trained crew with appliance dollies and lifting straps for client vehicle",
    rate: "Rs 1,500 - Rs 7,500",
    unit: "Per shift / floor levels",
    slug: "loading-unloading",
  },
  {
    service: "Secure Warehousing & Storage",
    description: "Moisture-free, 24/7 CCTV guarded warehouse bays with barcode inventory",
    rate: "Rs 1,200 - Rs 8,500",
    unit: "Per month / volume",
    slug: "warehousing-storage",
  },
  {
    service: "Wooden Crating for Delicate Goods",
    description: "Custom carpentry timber box for LED TVs (>55\"), crystal chandeliers and mirrors",
    rate: "Rs 1,200 - Rs 3,500",
    unit: "Per crated article",
    slug: "packing-unpacking",
  },
  {
    service: "Comprehensive Goods Transit Insurance",
    description: "All-risk 100% declared valuation policy with fast company-assisted claims",
    rate: "1.5% of Declared Value",
    unit: "Optional add-on",
    slug: "goods-insurance",
  },
];

/**
 * Standard inclusions versus optional extra charges.
 */
export const inclusionsVsExtras = [
  {
    feature: "5-Ply Virgin Corrugated Cartons & Bubble Wrap",
    included: true,
    note: "All standard boxes, tape, and padding are included in your quote.",
  },
  {
    feature: "Dedicated Closed-Body Container Truck",
    included: true,
    note: "Your goods never share space with another consignment.",
  },
  {
    feature: "Full Loading, Transport & Room-by-Room Unloading",
    included: true,
    note: "Items placed directly in the respective bedrooms and living spaces.",
  },
  {
    feature: "Basic Furniture Dismantling & Reassembly",
    included: true,
    note: "Double beds, dining tables, and modular furniture dismantled and rebuilt.",
  },
  {
    feature: "Highway Toll Taxes, Fuel Surcharges & Driver Allowance",
    included: true,
    note: "No surprise toll bills or driver meal charges requested on the road.",
  },
  {
    feature: "Dedicated Move Coordinator with WhatsApp Updates",
    included: true,
    note: "Single point of contact from pre-move survey to delivery.",
  },
  {
    feature: "Wooden Crating for Large LED TVs (>55\") & Crystal Mirrors",
    included: false,
    note: "Quoted transparently at Rs 1,200 to Rs 3,500 per item if needed.",
  },
  {
    feature: "Manual Rope Hoisting (if no elevator & narrow stairwells)",
    included: false,
    note: "Quoted upfront if balcony hoisting is necessary for oversized sofas.",
  },
  {
    feature: "All-Risk Transit Insurance Policy",
    included: false,
    note: "Calculated transparently at 1.5% of your declared inventory valuation.",
  },
  {
    feature: "Extended Warehousing Storage Beyond Transit Window",
    included: false,
    note: "Billed on flexible weekly or monthly terms from Rs 1,200 per month.",
  },
];

/**
 * Direct comparison highlighting how 1st Om beats rogue movers and hidden aggregator fees.
 */
export const scamComparison = [
  {
    aspect: "Initial Quoted Price",
    scam: "Artificially low bait quote (Rs 2,500 - Rs 3,500) given over the phone without questions.",
    firstOm: "Transparent, realistic estimate based on inventory volume, distance, and floor access.",
  },
  {
    aspect: "Moving Day Cartons & Tape",
    scam: "Arrives with minimal supplies; demands Rs 3,000 to Rs 5,000 extra for special boxes.",
    firstOm: "100% all-inclusive. All boxes, bubble wrap, and stretch film are covered in the quote.",
  },
  {
    aspect: "Stairs & Floor Surcharges",
    scam: "Demands extra Rs 500 to Rs 1,000 per floor suddenly midway through carrying furniture.",
    firstOm: "Survey accounts for floor access upfront. Zero surprise surcharge on moving day.",
  },
  {
    aspect: "Vehicle Allocation",
    scam: "Goods co-loaded in open-top trucks with strangers' cargo; high risk of rain or loss.",
    firstOm: "100% dedicated closed container locked and sealed exclusively for your family.",
  },
  {
    aspect: "Final Amount Paid",
    scam: "Ends up costing 2x to 3x more than quoted, with goods held hostage until paid in cash.",
    firstOm: "Exact binding quote agreed prior to packing. Transparent payment with official GST invoice.",
  },
];

/**
 * Standard relocation pricing FAQs.
 */
export const pricingFaqs = [
  {
    q: "Why do moving quotes differ between two similar 2 BHK apartments?",
    a: "Every household is unique. Relocation pricing depends on the actual physical volume (cubic feet) of furniture, quantity of delicate glassware or electronics requiring custom crating, floor levels and elevator availability at both locations, walking distance from truck to doorway, and total transit distance. A pre-move survey ensures you receive an accurate, binding quote tailored to your exact inventory.",
  },
  {
    q: "Are packing materials and cartons included in the written price?",
    a: "Yes. All standard packing supplies including export-grade 5-ply cartons, bubble wrap, stretch film, heavy corrugated sheets, and industrial sealing tape are fully covered in your written quotation. There are zero surprise box fees on moving day.",
  },
  {
    q: "Do I have to pay an advance before the survey is conducted?",
    a: "No. Our pre-move surveys (both in-person and video call) are 100% complimentary with zero booking fees and zero obligation. You only confirm with a standard booking token once you are completely satisfied with our written itemized quote.",
  },
  {
    q: "Can you provide an official GST invoice for corporate relocation reimbursement?",
    a: "Yes, absolutely. 1st Om Packers and Movers Pvt. Ltd. is a legally registered corporate entity. We issue full GST-compliant tax invoices, consignment notes (LR copy), and itemized packing lists required for employer relocation reimbursements.",
  },
  {
    q: "What happens if my relocation date changes? Is there a cancellation fee?",
    a: "We understand moving schedules can shift. You can reschedule your moving date with 24 hours prior notice with zero cancellation or rescheduling penalties before the dedicated vehicle is dispatched.",
  },
  {
    q: "How is Goods Transit Insurance calculated and is it compulsory?",
    a: "Transit insurance is optional but strongly recommended for long-distance and interstate moves. The premium is calculated at 1.5% of your declared consignment value. In the rare event of transit damage, our dedicated coordinator manages the claim directly with the insurance provider.",
  },
];

/**
 * Standard competitive advantages beating local market aggregators.
 */
export const competitiveAdvantages = [
  {
    title: "Zero Hidden Charges",
    description: "Written quote covers packing, loading, highway toll taxes, fuel, and room placement. No surprise moving-day demands.",
  },
  {
    title: "Dedicated Sealed Containers",
    description: "Your goods travel in a locked, weather-proof container vehicle assigned exclusively to your move. No shared cargo.",
  },
  {
    title: "Free Doorstep & Video Survey",
    description: "Accurate volumetric calculation before quoting ensures zero rate disputes on moving day.",
  },
  {
    title: "Verified In-House Ground Crew",
    description: "Trained and background-verified packers with furniture disassembly tools, mattress bags, and floor runners.",
  },
];

/**
 * Standard pricing disclaimer used across location, route, and quote components.
 */
export const pricingDisclaimer =
  "Rates listed are estimated indicative market ranges based on standard domestic move configurations. Final binding quotation is provided after our complimentary video or doorstep volumetric survey based on exact inventory volume, floor access, elevator availability, and preferred moving date.";
