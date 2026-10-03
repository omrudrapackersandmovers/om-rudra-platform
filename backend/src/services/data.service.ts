import { sql } from "drizzle-orm";
import { getDb } from "../db/client";
import {
  leads,
  quotations,
  jobs,
  invoices,
  bilties,
  vehicles,
  staff,
  jobVehicles,
  jobStaff,
  jobExpenses,
  invoicePayments,
} from "../db/schema";
import { Bindings } from "../types";

/**
 * Get count and status of operational data in the database
 */
export const getDataStatus = async (env: Bindings) => {
  const db = getDb(env.DB);

  const [
    leadsCount,
    quotesCount,
    jobsCount,
    invoicesCount,
    biltiesCount,
    vehiclesCount,
    staffCount,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(leads),
    db.select({ count: sql<number>`count(*)` }).from(quotations),
    db.select({ count: sql<number>`count(*)` }).from(jobs),
    db.select({ count: sql<number>`count(*)` }).from(invoices),
    db.select({ count: sql<number>`count(*)` }).from(bilties),
    db.select({ count: sql<number>`count(*)` }).from(vehicles),
    db.select({ count: sql<number>`count(*)` }).from(staff),
  ]);

  const counts = {
    leads: leadsCount[0]?.count || 0,
    quotations: quotesCount[0]?.count || 0,
    jobs: jobsCount[0]?.count || 0,
    invoices: invoicesCount[0]?.count || 0,
    bilties: biltiesCount[0]?.count || 0,
    vehicles: vehiclesCount[0]?.count || 0,
    staff: staffCount[0]?.count || 0,
  };

  const totalRecords =
    counts.leads +
    counts.quotations +
    counts.jobs +
    counts.invoices +
    counts.bilties +
    counts.vehicles +
    counts.staff;

  const hasData = totalRecords > 0;

  return {
    hasData,
    totalRecords,
    counts,
  };
};

/**
 * Reset all operational data (wipes transactions, preserves admin & settings)
 */
export const resetOperationalData = async (env: Bindings) => {
  const db = getDb(env.DB);

  // Delete in reverse dependency order to avoid foreign key conflicts
  await db.delete(jobExpenses);
  await db.delete(jobStaff);
  await db.delete(jobVehicles);
  await db.delete(invoicePayments);
  await db.delete(bilties);
  await db.delete(invoices);
  await db.delete(jobs);
  await db.delete(quotations);
  await db.delete(leads);
  await db.delete(vehicles);
  await db.delete(staff);

  return {
    success: true,
    message: "All operational records (leads, quotes, jobs, fleet, team, invoices, bilties) successfully reset.",
  };
};

/**
 * Load realistic sample data
 * Strictly allowed only when there is NO operational data
 */
export const loadSampleData = async (env: Bindings) => {
  const currentStatus = await getDataStatus(env);
  if (currentStatus.hasData) {
    throw new Error(
      "Sample data can only be loaded when the database has no operational data. Please reset existing data first."
    );
  }

  const db = getDb(env.DB);

  // 1. Seed Sample Fleet
  const sampleVehicles = [
    {
      vehicleNumber: "JH-01-BK-8842",
      vehicleType: "Tata 407 (Closed Container)",
      capacityTons: 2.5,
      capacityCft: 450,
      defaultDriverName: "Manoj Yadav",
      defaultDriverPhone: "9835123456",
      status: "available" as const,
      notes: "Dedicated for Ranchi local and Patna-Ranchi routes",
    },
    {
      vehicleNumber: "BR-01-GA-5419",
      vehicleType: "Mahindra Bolero Pickup",
      capacityTons: 1.5,
      capacityCft: 280,
      defaultDriverName: "Sunil Kumar",
      defaultDriverPhone: "9431876543",
      status: "available" as const,
      notes: "Ideal for intra-city moves and narrow city lanes",
    },
    {
      vehicleNumber: "JH-05-CD-9901",
      vehicleType: "14ft Container Truck",
      capacityTons: 4.0,
      capacityCft: 800,
      defaultDriverName: "Rajesh Paswan",
      defaultDriverPhone: "9123456780",
      status: "available" as const,
      notes: "Heavy container for 3BHK inter-state household relocation",
    },
    {
      vehicleNumber: "BR-02-EE-3312",
      vehicleType: "19ft Container Truck",
      capacityTons: 7.5,
      capacityCft: 1250,
      defaultDriverName: "Vikram Singh",
      defaultDriverPhone: "9876543210",
      status: "available" as const,
      notes: "Commercial office relocation and large interstate moves",
    },
  ];

  const insertedVehicles: any[] = [];
  for (const v of sampleVehicles) {
    const res = await db.insert(vehicles).values(v).returning();
    insertedVehicles.push(res[0]);
  }

  // 2. Seed Sample Staff
  const sampleStaff = [
    {
      name: "Ramesh Sharma",
      phone: "9835011223",
      role: "supervisor" as const,
      specialization: "Operations & On-site Assessment",
      status: "available" as const,
      dailyWage: 900,
      idType: "Aadhaar",
      idNumber: "8921-4321-9988",
      address: "Kankarbagh, Patna",
    },
    {
      name: "Manoj Yadav",
      phone: "9835123456",
      role: "driver" as const,
      specialization: "Heavy Container Truck Driver",
      status: "available" as const,
      dailyWage: 800,
      idType: "Driving License",
      idNumber: "JH01-2018-00921",
      address: "Harmu, Ranchi",
    },
    {
      name: "Sunil Kumar",
      phone: "9431876543",
      role: "driver" as const,
      specialization: "Intra-City Logistics",
      status: "available" as const,
      dailyWage: 750,
      idType: "Driving License",
      idNumber: "BR01-2019-00543",
      address: "Rajendra Nagar, Patna",
    },
    {
      name: "Deepak Paswan",
      phone: "9122334455",
      role: "packer" as const,
      specialization: "Fragile Glassware & Furniture Wrapping",
      status: "available" as const,
      dailyWage: 650,
      idType: "Aadhaar",
      idNumber: "4532-8812-7700",
      address: "Danapur, Patna",
    },
    {
      name: "Amit Verma",
      phone: "9334112233",
      role: "loader" as const,
      specialization: "Heavy Appliances Handling",
      status: "available" as const,
      dailyWage: 600,
      idType: "Aadhaar",
      idNumber: "3298-1122-6644",
      address: "Dhurwa, Ranchi",
    },
    {
      name: "Sanjay Mahto",
      phone: "9470123456",
      role: "helper" as const,
      specialization: "Unpacking & Setting at Destination",
      status: "available" as const,
      dailyWage: 550,
      idType: "Aadhaar",
      idNumber: "7721-0099-3311",
      address: "Namkum, Ranchi",
    },
  ];

  const insertedStaff: any[] = [];
  for (const s of sampleStaff) {
    const res = await db.insert(staff).values(s).returning();
    insertedStaff.push(res[0]);
  }

  // 3. Seed Sample Leads
  const sampleLeads = [
    {
      name: "Dr. Alok Ranjan",
      phone: "9835120011",
      email: "alok.ranjan@aiims.edu.in",
      movingFrom: "Kankarbagh, Patna, Bihar",
      movingTo: "Morabadi, Ranchi, Jharkhand",
      moveType: "Domestic",
      service: "Home Shifting",
      timeline: "Within a week",
      status: "converted" as const,
      notes: "3BHK household goods, piano & fragile medical reference library",
    },
    {
      name: "Priya Kumari",
      phone: "9431002233",
      email: "priya.k@tcs.com",
      movingFrom: "Boring Road, Patna",
      movingTo: "Hinoo, Ranchi",
      moveType: "Domestic",
      service: "Home Shifting",
      timeline: "Immediate",
      status: "converted" as const,
      notes: "2BHK full household shifting with double-layer bubble packing",
    },
    {
      name: "TechNova Solutions Pvt Ltd",
      phone: "9123456789",
      email: "admin@technova.co.in",
      movingFrom: "Exhibition Road, Patna",
      movingTo: "Ashok Nagar, Ranchi",
      moveType: "Domestic",
      service: "Office Relocation",
      timeline: "Within a week",
      status: "contacted" as const,
      notes: "15 workstations, server racks, and meeting room furniture",
    },
    {
      name: "Vikash Kumar Sinha",
      phone: "9876501234",
      email: "vikash.sinha@gmail.com",
      movingFrom: "Bailey Road, Patna",
      movingTo: "Danapur, Patna",
      moveType: "Within City",
      service: "Home Shifting",
      timeline: "Immediate",
      status: "new" as const,
      notes: "Local shifting of 1BHK furniture and Royal Enfield motorcycle",
    },
  ];

  const insertedLeads: any[] = [];
  for (const l of sampleLeads) {
    const res = await db.insert(leads).values(l).returning();
    insertedLeads.push(res[0]);
  }

  // 4. Seed Sample Quotations
  const sampleQuotes = [
    {
      quoteNumber: "1STOM-Q-2026-001",
      leadId: insertedLeads[0].id,
      customerName: "Dr. Alok Ranjan",
      customerPhone: "9835120011",
      movingFrom: "Kankarbagh, Patna, Bihar",
      movingTo: "Morabadi, Ranchi, Jharkhand",
      moveDate: new Date().toISOString().slice(0, 10),
      inventoryData: JSON.stringify([
        { name: "Double Bed with Mattress", category: "Bedroom", quantity: 2, cft: 70 },
        { name: "Almirah / Wardrobe", category: "Bedroom", quantity: 2, cft: 80 },
        { name: "Sofa Set (3+1+1)", category: "Living Room", quantity: 1, cft: 60 },
        { name: "Dining Table (6 Seater)", category: "Dining", quantity: 1, cft: 45 },
        { name: "Double Door Refrigerator", category: "Kitchen", quantity: 1, cft: 35 },
        { name: "Washing Machine", category: "Appliances", quantity: 1, cft: 25 },
        { name: "Carton Boxes (Books & Fragiles)", category: "Boxes", quantity: 25, cft: 125 },
      ]),
      packagingCharges: 6000,
      transportCharges: 18000,
      loadingCharges: 4000,
      unloadingCharges: 3000,
      insuranceDeclaredValue: 350000,
      insuranceRatePercent: 0.5,
      insuranceCharges: 1750,
      otherCharges: 250,
      discount: 1000,
      gstRate: 18,
      gstAmount: 5760,
      totalAmount: 37760,
      status: "accepted" as const,
      validUntil: new Date(Date.now() + 86400000 * 15).toISOString().slice(0, 10),
    },
    {
      quoteNumber: "1STOM-Q-2026-002",
      leadId: insertedLeads[1].id,
      customerName: "Priya Kumari",
      customerPhone: "9431002233",
      movingFrom: "Boring Road, Patna",
      movingTo: "Hinoo, Ranchi",
      moveDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      inventoryData: JSON.stringify([
        { name: "Single Bed with Mattress", category: "Bedroom", quantity: 1, cft: 20 },
        { name: "Double Bed with Mattress", category: "Bedroom", quantity: 1, cft: 35 },
        { name: "Single Door Refrigerator", category: "Kitchen", quantity: 1, cft: 25 },
        { name: "Washing Machine", category: "Appliances", quantity: 1, cft: 25 },
        { name: "Carton Boxes (Clothes & Utensils)", category: "Boxes", quantity: 15, cft: 75 },
      ]),
      packagingCharges: 4500,
      transportCharges: 12000,
      loadingCharges: 3000,
      unloadingCharges: 2500,
      insuranceDeclaredValue: 150000,
      insuranceRatePercent: 0.5,
      insuranceCharges: 750,
      otherCharges: 0,
      discount: 250,
      gstRate: 0,
      gstAmount: 0,
      totalAmount: 22500,
      status: "accepted" as const,
      validUntil: new Date(Date.now() + 86400000 * 15).toISOString().slice(0, 10),
    },
  ];

  const insertedQuotes: any[] = [];
  for (const q of sampleQuotes) {
    const res = await db.insert(quotations).values(q).returning();
    insertedQuotes.push(res[0]);
  }

  // 5. Seed Sample Jobs
  const sampleJobs = [
    {
      jobNumber: "1STOM-JOB-2026-001",
      quoteId: insertedQuotes[0].id,
      leadId: insertedLeads[0].id,
      customerName: "Dr. Alok Ranjan",
      customerPhone: "9835120011",
      pickupAddress: "Flat 402, Shanti Vihar, Kankarbagh, Patna - 800020",
      deliveryAddress: "Bunglow 12, Lake Avenue, Morabadi, Ranchi - 834008",
      scheduledDate: new Date().toISOString().slice(0, 10),
      scheduledTime: "08:00 AM",
      vehicleAssigned: `${insertedVehicles[2].vehicleNumber} (${insertedVehicles[2].vehicleType})`,
      driverName: insertedVehicles[2].defaultDriverName,
      driverPhone: insertedVehicles[2].defaultDriverPhone,
      crewMembers: `${insertedStaff[0].name} (supervisor), ${insertedStaff[3].name} (packer), ${insertedStaff[4].name} (loader)`,
      specialNotes: "High-value fragile items. Handle medical encyclopedias and crystal lamps with bubble wrapping.",
      status: "in_progress" as const,
    },
    {
      jobNumber: "1STOM-JOB-2026-002",
      quoteId: insertedQuotes[1].id,
      leadId: insertedLeads[1].id,
      customerName: "Priya Kumari",
      customerPhone: "9431002233",
      pickupAddress: "House 24, Anandpuri, Boring Road, Patna - 800001",
      deliveryAddress: "Road No 3, Hinoo, Ranchi - 834002",
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      scheduledTime: "07:00 AM",
      vehicleAssigned: `${insertedVehicles[0].vehicleNumber} (${insertedVehicles[0].vehicleType})`,
      driverName: insertedVehicles[0].defaultDriverName,
      driverPhone: insertedVehicles[0].defaultDriverPhone,
      crewMembers: `${insertedStaff[3].name} (packer), ${insertedStaff[5].name} (helper)`,
      specialNotes: "Lift available at pickup; 2nd floor stairs only at delivery destination.",
      status: "scheduled" as const,
    },
  ];

  const insertedJobs: any[] = [];
  for (const j of sampleJobs) {
    const res = await db.insert(jobs).values(j).returning();
    insertedJobs.push(res[0]);
  }

  // 6. Seed Job Resources & Expenses for Job 1
  await db.insert(jobVehicles).values({
    jobId: insertedJobs[0].id,
    vehicleId: insertedVehicles[2].id,
    driverName: insertedVehicles[2].defaultDriverName,
    driverPhone: insertedVehicles[2].defaultDriverPhone,
    role: "primary",
  });

  await db.insert(jobStaff).values([
    {
      jobId: insertedJobs[0].id,
      staffId: insertedStaff[0].id,
      roleOnJob: "Lead Supervisor",
      payType: "per_job",
      rateUsed: 900,
      daysWorked: 1,
      amountPayable: 900,
      amountPaid: 900,
      paymentStatus: "paid",
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMode: "upi",
    },
    {
      jobId: insertedJobs[0].id,
      staffId: insertedStaff[3].id,
      roleOnJob: "Master Packer",
      payType: "per_job",
      rateUsed: 650,
      daysWorked: 1,
      amountPayable: 650,
      amountPaid: 0,
      paymentStatus: "pending",
    },
    {
      jobId: insertedJobs[0].id,
      staffId: insertedStaff[4].id,
      roleOnJob: "Heavy Loader",
      payType: "per_job",
      rateUsed: 600,
      daysWorked: 1,
      amountPayable: 600,
      amountPaid: 0,
      paymentStatus: "pending",
    },
  ]);

  await db.insert(jobExpenses).values([
    {
      jobId: insertedJobs[0].id,
      category: "fuel",
      amount: 4200,
      description: "Diesel top-up at HP Highway Petrol Pump (Patna-Gaya-Ranchi NH)",
      paidBy: "Company Card",
      receiptNote: "HPCL-INV-4410",
    },
    {
      jobId: insertedJobs[0].id,
      category: "toll",
      amount: 650,
      description: "FASTag toll plaza charges (Koderma & Hazaribagh toll gates)",
      paidBy: "FASTag Wallet",
      receiptNote: "NHAI-TOLL-883",
    },
  ]);

  // 7. Seed Sample Invoices
  const sampleInvoices = [
    {
      invoiceNumber: "1STOM-INV-2026-001",
      jobId: insertedJobs[0].id,
      quoteId: insertedQuotes[0].id,
      customerName: "Dr. Alok Ranjan",
      customerPhone: "9835120011",
      customerGstin: "10AACCA1234F1Z5",
      pickupAddress: "Flat 402, Shanti Vihar, Kankarbagh, Patna - 800020",
      deliveryAddress: "Bunglow 12, Lake Avenue, Morabadi, Ranchi - 834008",
      sacCode: "9965",
      subtotal: 32000,
      gstRate: 18,
      gstAmount: 5760,
      totalAmount: 37760,
      advancePaid: 15000,
      balanceDue: 22760,
      paymentStatus: "partial" as const,
      paymentMode: "UPI",
    },
    {
      invoiceNumber: "1STOM-INV-2026-002",
      jobId: insertedJobs[1].id,
      quoteId: insertedQuotes[1].id,
      customerName: "Priya Kumari",
      customerPhone: "9431002233",
      customerGstin: "",
      pickupAddress: "House 24, Anandpuri, Boring Road, Patna - 800001",
      deliveryAddress: "Road No 3, Hinoo, Ranchi - 834002",
      sacCode: "9965",
      subtotal: 22500,
      gstRate: 0,
      gstAmount: 0,
      totalAmount: 22500,
      advancePaid: 5000,
      balanceDue: 17500,
      paymentStatus: "partial" as const,
      paymentMode: "Bank Transfer / NEFT",
    },
  ];

  const insertedInvoices: any[] = [];
  for (const inv of sampleInvoices) {
    const res = await db.insert(invoices).values(inv).returning();
    insertedInvoices.push(res[0]);
  }

  // Seed Invoice Payment records
  await db.insert(invoicePayments).values([
    {
      invoiceId: insertedInvoices[0].id,
      amount: 15000,
      paymentMode: "upi",
      paymentDate: new Date().toISOString().slice(0, 10),
      transactionRef: "UPI/260929/88123984",
      notes: "Advance payment received via PhonePe QR",
    },
    {
      invoiceId: insertedInvoices[1].id,
      amount: 5000,
      paymentMode: "neft",
      paymentDate: new Date().toISOString().slice(0, 10),
      transactionRef: "HDFC-NEFT-99120485",
      notes: "Advance token transfer for job booking",
    },
  ]);

  // 8. Seed Sample Bilty
  await db.insert(bilties).values({
    lrNumber: "1STOM-LR-2026-001",
    jobId: insertedJobs[0].id,
    consignorName: "Dr. Alok Ranjan",
    consignorAddress: "Flat 402, Shanti Vihar, Kankarbagh, Patna",
    consignorPhone: "9835120011",
    consigneeName: "Dr. Alok Ranjan",
    consigneeAddress: "Bunglow 12, Lake Avenue, Morabadi, Ranchi",
    consigneePhone: "9835120011",
    fromCity: "Patna",
    toCity: "Ranchi",
    truckNumber: "JH-05-CD-9901",
    driverName: "Rajesh Paswan",
    driverPhone: "9123456780",
    packagesCount: 38,
    goodsDescription: "Complete Household Articles, Refrigerator, LED TV, Furniture (Packed in bubble wrap & corrugated rolls)",
    declaredValue: 350000,
    freightAmount: 18000,
    freightStatus: "to_pay",
    riskType: "carrier_risk",
  });

  return {
    success: true,
    message: "Sample operational data loaded successfully!",
    counts: {
      vehicles: sampleVehicles.length,
      staff: sampleStaff.length,
      leads: sampleLeads.length,
      quotations: sampleQuotes.length,
      jobs: sampleJobs.length,
      invoices: sampleInvoices.length,
      bilties: 1,
    },
  };
};
