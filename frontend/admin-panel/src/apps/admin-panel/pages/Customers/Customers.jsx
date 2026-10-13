import { ArrowLeft, Phone, Mail, MessageSquare, Edit2, RotateCcw, FileText, FileSpreadsheet, Truck, Receipt, ChevronRight } from "lucide-react";
import CustomersList from "./CustomersList";
import {useEffect,useState} from "react";
import {Link,useParams} from "react-router";
import {useGetCustomersQuery,useGetCustomerQuery,useUpdateCustomerMutation} from "../../../../store/apiSlices/customersApiSlice";
const card="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xs";
const input="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent p-3";
export default function Customers(){
 const [editing,setEditing]=useState(false);
 const {id}=useParams(); const [search,setSearch]=useState("");
 const list=useGetCustomersQuery(undefined,{skip:!!id}),detail=useGetCustomerQuery(id,{skip:!id});
 const [save,{isLoading:saving}]=useUpdateCustomerMutation(); const [form,setForm]=useState({name:"",email:"",notes:""}),[message,setMessage]=useState("");
 useEffect(()=>{if(detail.data?.customer){const c=detail.data.customer;setForm({name:c.name,email:c.email || "",notes:c.notes || ""});}},[detail.data]);
 const query=id ? detail : list;
 if(query.isLoading)return <p className="p-6">Loading customers…</p>;
 if(query.error)return <div className={card}><p role="alert">Could not load customer records.</p><button onClick={query.refetch}>Retry</button></div>;
 if(!id)return <CustomersList customers={list.data || []} search={search} setSearch={setSearch} refetch={list.refetch} isFetching={list.isFetching}/>;
 const data=detail.data;if(!data?.customer)return <p>Customer not found.</p>;
 async function submit(e){e.preventDefault();setMessage("");try{await save({id,...form}).unwrap();setMessage("Profile saved.");setEditing(false);}catch(err){setMessage(err.data?.error || "Could not save profile.");}}
 const customer=data.customer;
 const sections=[["leads","Enquiry History","leads",FileText],["quotes","Quotations","quotes",FileSpreadsheet],["jobs","Move Jobs","jobs",Truck],["invoices","Invoices","invoices",Receipt]];
 const phone=customer.phone.replace(/[^0-9]/g, "");
 const whatsappPhone=phone.length===10 ? `91${phone}` : phone;
 const date=value=>{if(!value)return "—";const parsed=new Date(value.includes("T") ? value : `${value.replace(" ","T")}Z`);return Number.isNaN(parsed.getTime()) ? "—" : parsed.toLocaleDateString("en-IN",{timeZone:"Asia/Kolkata"});};
 return <div className="space-y-6 pb-12 max-w-5xl mx-auto">
   <div className="print:hidden"><Link to="/customers" className="inline-flex items-center gap-1.5 self-start px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"><ArrowLeft className="w-4 h-4"/>Customers</Link></div>
   <header className={`${card} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
     <div className="flex items-center gap-3">

       <div><h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Customer #{customer.id}</h1><p className="text-xs text-slate-500 dark:text-slate-400">Contact details and history across all enquiries</p></div>
     </div>
     <div className="flex items-center gap-1.5 shrink-0">
       <button type="button" disabled={detail.isFetching || saving} onClick={()=>detail.refetch()} aria-label="Refresh customer profile" title="Refresh customer profile" className="w-10 h-10 inline-flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"><RotateCcw className={`w-4 h-4 ${detail.isFetching ? "animate-spin" : ""}`}/></button>
       <button type="button" onClick={()=>{setEditing(true);setMessage("");}} aria-label="Edit customer profile" title="Edit customer profile" className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition-colors cursor-pointer"><Edit2 className="w-4 h-4"/></button>
     </div>
   </header>
   <section className={`${card} space-y-4`}>
     <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
       <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 break-words">{customer.name}</h2>{data.leads.length>1 && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">REPEAT CUSTOMER</span>}</div>
         <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-semibold"><a href={`tel:${customer.phone}`} className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700"><Phone className="w-3.5 h-3.5"/>{customer.phone}</a><a href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700"><MessageSquare className="w-3.5 h-3.5"/>WhatsApp</a></div>
         {customer.email && <a href={`mailto:${customer.email}`} className="inline-flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400 hover:text-brand-600 break-all"><Mail className="w-3.5 h-3.5 shrink-0"/>{customer.email}</a>}
       </div>
       <button type="button" onClick={()=>{setEditing(true);setMessage("");}} className="text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer inline-flex items-center gap-1.5"><Edit2 className="w-3.5 h-3.5"/>Edit Profile</button>
     </div>
     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-4">
       {sections.map(([key,title])=><div key={key}><p className="text-[10px] font-bold uppercase text-slate-400">{title}</p><p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1">{data[key].length}</p></div>)}
     </div>
     {editing ? <form onSubmit={submit} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
       <div className="grid sm:grid-cols-2 gap-4">{["name","email"].map(key=><label key={key} className="capitalize text-xs font-semibold text-slate-600 dark:text-slate-300">{key}<input className={`${input} mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600`} required={key==="name"} type={key==="email" ? "email" : "text"} maxLength={200} value={form[key]} placeholder={key==="name" ? "Customer / company name" : "Email address (optional)"} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}</div>
       <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Customer Notes<textarea maxLength={5000} className={`${input} mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600`} value={form.notes} placeholder="Preferences, contact details or follow-up notes" onChange={e=>setForm({...form,notes:e.target.value})}/></label>
       <div className="flex justify-end gap-2"><button type="button" disabled={saving} onClick={()=>{setEditing(false);setForm({name:customer.name,email:customer.email || "",notes:customer.notes || ""});setMessage("");}} className="text-xs rounded-xl px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50">Cancel</button><button disabled={saving} className="text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-4 py-2 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving…" : "Save Profile"}</button></div>
     </form> : <div><p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Customer Notes / Preferences:</p><p className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 italic whitespace-pre-wrap">{customer.notes || "No customer notes added yet."}</p></div>}
     {message && <p role="status" className="text-xs text-slate-600 dark:text-slate-300">{message}</p>}
   </section>
   <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-brand-600"/><h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">Customer History & Associated Documents</h2></div>
   {sections.map(([key,title,route,Icon])=><section key={key} className={`${card} space-y-3`}>
     <div className="flex items-center gap-2"><span className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600"><Icon className="w-4 h-4"/></span><h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{title}</h3><span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{data[key].length}</span></div>
     {!data[key].length && <p className="text-xs text-slate-400 py-2">No {title.toLowerCase()} yet.</p>}
     <div className="space-y-3">{data[key].map(row=><div key={row.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 rounded-xl">
       <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><Link to={`/${route}/${row.id}`} className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 break-all">{row.quoteNumber || row.jobNumber || row.invoiceNumber || `Lead #${row.id}`}</Link><span className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 ${row.deletedAt ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>{row.deletedAt ? "Deleted" : (row.status || row.paymentStatus || "Recorded").replaceAll("_"," ")}</span></div><p className="text-[11px] text-slate-400 mt-1">Created on {date(row.createdAt)}</p>{row.movingFrom && <p className="text-xs text-slate-500 mt-1 break-words">{row.movingFrom} → {row.movingTo}</p>}</div>
       <div className="flex items-center gap-3 shrink-0">{row.totalAmount != null && <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">{Number(row.totalAmount).toLocaleString("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2})}</span>}<Link to={`/${route}/${row.id}`} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">View<ChevronRight className="w-3.5 h-3.5"/></Link></div>
     </div>)}</div>
   </section>)}
 </div>;
}
