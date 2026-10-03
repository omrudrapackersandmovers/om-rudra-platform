import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getApiBaseUrl = () => {
  let url = (import.meta.env.VITE_API_URL || "http://localhost:8787/api/admin").trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  url = url.replace(/\/+$/, "");
  if (!url.endsWith("/api/admin")) {
    if (url.endsWith("/api")) {
      url = `${url}/admin`;
    } else {
      url = `${url}/api/admin`;
    }
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();

export const baseApiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Settings",
    "AdminProfile",
    "Leads",
    "Quotes",
    "Jobs",
    "Invoices",
    "Bilties",
    "Vehicles",
    "Staff",
    "JobResources",
    "InvoicePayments",
    "Finance",
    "DataStatus",
  ],
  endpoints: () => ({}),
});
