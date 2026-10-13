import { baseApiSlice } from "./baseApiSlice";
export const customersApiSlice=baseApiSlice.injectEndpoints({endpoints:builder=>({
 getCustomers:builder.query({query:()=>"/customers",transformResponse:r=>r.customers,providesTags:["Customers","Leads","Quotes","Jobs","Invoices"]}),
 getCustomer:builder.query({query:id=>`/customers/${id}`,providesTags:["Customers","Leads","Quotes","Jobs","Invoices"]}),
 updateCustomer:builder.mutation({query:({id,...body})=>({url:`/customers/${id}`,method:"PATCH",body}),invalidatesTags:["Customers"]})
})});
export const {useGetCustomersQuery,useGetCustomerQuery,useUpdateCustomerMutation}=customersApiSlice;
