/**
 * Static Company & Tenant Configuration
 * For Unyrise Tech multi-client deployments:
 * Update this file with the new client's details to white-label the entire platform!
 */

export const companyConfig = {
  id: "1stom",
  name: "1st Om Packers and Movers",
  shortName: "1st Om",
  tagline: "Safer Moves, Brighter Tomorrows",
  phone: "+91 7033488691",
  whatsapp: "+91 7033488691",
  email: "hello@1stompackersandmovers.com",
  website: "https://1stompackersandmovers.com",
  contact: {
    primaryPhone: "+91 7033488691",
    email: "hello@1stompackersandmovers.com",
    whatsapp: "+91 7033488691",
  },

  // Brand Imagery
  logo: {
    primary: "/images/primary-logo.webp",
    horizontal: "/images/horizontal-lockup.webp",
    reverse: "/images/reverse-logo.webp",
    icon: "/images/icon.webp",
  },

  // Business & Tax Compliance
  legal: {
    legalName: "1st Om Packers and Movers",
    gstin: "",
    pan: "",
  },
  gstin: "", // Customizable with client's actual registered GSTIN
  pan: "",
  sacCode: "9965", // Goods Transport Agency / Road freight

  // Addresses
  headOffice: {
    address: "Ram Krishna Nagar, Soranpur, Goraiya Asthan",
    city: "Patna",
    state: "Bihar",
    pincode: "800027",
    phone: "+91 7033488691",
  },
  branches: [
    { city: "Ranchi", address: "Main Road, Overbridge", phone: "+91 7033488691" },
    { city: "Jamshedpur", address: "Bistupur Market", phone: "+91 7033488691" },
    { city: "Dhanbad", address: "Bank More", phone: "+91 7033488691" },
  ],

  // Banking & Dynamic UPI Payment Details
  bankDetails: {
    accountName: "1ST OM PACKERS AND MOVERS",
    bankName: "State Bank of India",
    accountNumber: "",
    ifsc: "",
    branch: "Patna Main",
    upiId: "1stompackers@sbi",
  },
  upi: {
    id: "1stompackers@sbi",
    payeeName: "1st Om Packers and Movers",
  },

  // Document Terms & Conditions
  terms: {
    quotation: [
      "Quotation is valid for 15 days from the date of issue.",
      "Toll tax, octroi, parking & state entry tax will be charged as actual if applicable.",
      "Transit Insurance will be charged extra at 3% on declared goods value.",
      "Payment terms: 50% advance at the time of loading, 50% balance before unloading.",
      "Packing materials remain company property unless explicitly purchased.",
    ],
    invoice: [
      "Goods are accepted for transport subject to conditions printed on Consignment Note.",
      "Payment should be made in favor of 1st Om Packers and Movers via UPI/Bank transfer.",
      "Any dispute subject to Patna jurisdiction only.",
    ],
    bilty: [
      "Consignment is carried strictly under Carrier by Road Act.",
      "Goods carried at Owner's risk unless Transit Insurance receipt is attached.",
      "Consignee must inspect all packages at delivery before signing receipt.",
      "No claims entertained after delivery verification is signed.",
    ],
  },
};
