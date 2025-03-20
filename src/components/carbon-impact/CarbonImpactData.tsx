
export const carbonImpactCategories = [
  {
    id: "directImpact",
    name: "Project Description",
    subcategories: [
      { name: "Methodology", status: "verified", info: "Uses verified GHG accounting methodology" },
      { name: "Standard/Registry", status: "verified", info: "Follows ISO 14064 standards for GHG inventories" },
      { name: "Third Party Review", status: "pending", info: "Independent verification in progress" },
      { name: "Location Coordinates", status: "verified", info: "Geographic boundaries properly defined and documented" },
    ]
  },
  {
    id: "carbonImpact",
    name: "Carbon Impact",
    subcategories: [
      { name: "Permanence", status: "verfied", info: "Carbon removal will be maintained for 40+ years" },
      { name: "Additionality", status: "verified", info: "Project would not have occurred without carbon financing" },
      { name: "CO2 Equation", status: "verified", info: "Accurate carbon accounting methodology validated" },
      { name: "Baseline", status: "verified", info: "Properly established baseline scenario" },
      { name: "Durability & Reversal Risks", status: "at-risk", info: "Some risk of carbon reversal in certain scenarios" },
      { name: "Mitigation Plan", status: "verified", info: "Comprehensive risk mitigation strategies in place" },
      { name: "Risks", status: "at-risk", info: "Some implementation risks identified" },
      { name: "Leakage", status: "verified", info: "Mechanisms to prevent carbon leakage implemented" },
    ]
  },
  {
    id: "beyondCarbon",
    name: "Beyond Carbon",
    subcategories: [
      { name: "Social", status: "verified", info: "Positive community impact verified" },
      { name: "Environmental", status: "verified", info: "Additional environmental co-benefits documented" },
      { name: "Governance & Policies", status: "pending", info: "Governance framework under review" },
      { name: "Economic", status: "verified", info: "Creates sustainable economic opportunities" },
      { name: "Capacity Building", status: "verified", info: "Local community training and education provided" },
      { name: "Human Rights", status: "verified", info: "Respects and protects human rights" },
      { name: "Welfare", status: "pending", info: "Welfare impact assessment in progress" },
      { name: "Biodiversity", status: "verified", info: "Positive biodiversity impacts documented" },
      { name: "Water & Air", status: "verified", info: "Improves water and air quality" },
      { name: "Soil & Land", status: "verified", info: "Soil health improvements measured" },
      { name: "Energy & Waste", status: "pending", info: "Energy efficiency and waste reduction metrics being developed" },
      { name: "Governance", status: "pending", info: "Governance structure assessment in progress" },
      { name: "Benefit Sharing", status: "verified", info: "Equitable benefit sharing mechanisms in place" },
      { name: "Policies", status: "pending", info: "Policy alignment under review" },
      { name: "Maintenance Management", status: "pending", info: "Long-term maintenance plan being developed" },
    ]
  },
  {
    id: "reportingProcess",
    name: "Reporting Process (MRV)",
    subcategories: [
      { name: "Reporting", status: "verified", info: "Comprehensive reporting framework implemented" },
      { name: "Measuring", status: "verified", info: "Robust measurement methodologies in place" },
      { name: "Verification", status: "pending", info: "Third-party verification process initiated" },
      { name: "Direct Effect", status: "verified", info: "Primary carbon impact properly quantified" },
      { name: "Indirect Effect", status: "at-risk", info: "Secondary effects need additional monitoring" },
    ]
  },
  {
    id: "qualityAssurance",
    name: "Quality Assurance",
    subcategories: [
      { name: "Reputation", status: "verified", info: "Project developer has strong track record" },
      { name: "Compliance", status: "verified", info: "Meets all regulatory requirements" },
      { name: "SDGs", status: "verified", info: "Contributes to multiple UN Sustainable Development Goals" },
      { name: "External Rating", status: "pending", info: "External rating/certification in progress" },
    ]
  }
];

export const qualityScoreData = [
  { category: "Carbon Accounting", score: 92 },
  { category: "Additionality", score: 88 },
  { category: "Permanence", score: 85 },
  { category: "Co-Benefits", score: 94 },
  { category: "Verification", score: 90 },
  { category: "Overall", score: 90 },
];
