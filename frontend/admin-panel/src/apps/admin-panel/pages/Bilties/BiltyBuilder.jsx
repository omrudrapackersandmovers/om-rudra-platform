import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Building2,
  Truck,
  FileText,
  ShieldCheck,
  Calculator,
  ClipboardCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useCreateBiltyMutation,
  useUpdateBiltyMutation,
  useGetBiltyByIdQuery,
} from "../../../../store/apiSlices/biltiesApiSlice";
import { useUnsavedChanges } from "../../../../hooks/useUnsavedChanges";
import { Select } from "../../shared/components/Select";
import {
  biltySections,
  biltyTotal,
  biltyPayload,
  initialBilty,
  biltyPlaceholders,
} from "./biltyFields";

const inputClass =
  "w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none";
const sectionAppearance = {
  "Sender and pickup": {
    title: "Consignor Details (Sender / Origin)",
    icon: Building2,
    color: "text-brand-600 dark:text-brand-300",
  },
  "Receiver and destination": {
    title: "Consignee Details (Receiver / Destination)",
    icon: Building2,
    color: "text-brand-600 dark:text-brand-300",
  },
  "Documents and schedule": {
    title: "Document References & Delivery Schedule",
    icon: FileText,
    color: "text-brand-600 dark:text-brand-300",
  },
  "Vehicle and cargo": {
    title: "Vehicle, Driver & Cargo Information",
    icon: Truck,
    color: "text-amber-600 dark:text-amber-300",
  },
  "Risk and insurance": {
    title: "Risk Coverage & Insurance",
    icon: ShieldCheck,
    color: "text-brand-600 dark:text-brand-300",
  },
  "Freight and payment": {
    title: "Charges & Payment Breakdown",
    icon: Calculator,
    color: "text-emerald-600 dark:text-emerald-300",
  },
  "Delivery acknowledgement": {
    title: "Delivery Acknowledgement",
    icon: ClipboardCheck,
    color: "text-brand-600 dark:text-brand-300",
  },
};
const money = (value) =>
  `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function BiltyBuilder() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetBiltyByIdQuery(id, { skip: !id });
  if (id && isLoading)
    return (
      <p role="status" className="p-8 text-sm">
        Loading bilty...
      </p>
    );
  if (id && (error || !data))
    return (
      <p role="alert" className="p-8 text-rose-600">
        Unable to load this bilty.
      </p>
    );
  return <BiltyForm key={id || "new"} existing={id ? data : null} />;
}

function BiltyForm({ existing }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setIsDirty, confirmNavigation, UnsavedModal } =
    useUnsavedChanges(navigate);
  const [form, setForm] = useState(() => initialBilty(existing, params));
  const [items, setItems] = useState(existing?.inventoryItems || []);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [createBilty, createState] = useCreateBiltyMutation();
  const [updateBilty, updateState] = useUpdateBiltyMutation();
  const saving = createState.isLoading || updateState.isLoading;
  const jobId = existing?.jobId || params.get("jobId");
  const total = biltyTotal(form);
  const balance =
    Math.round((total - Number(form.advancePaid || 0)) * 100) / 100;
  const change = (key, value) => {
    setIsDirty(true);
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };
  const changeItem = (index, key, value) => {
    setIsDirty(true);
    setItems((previous) =>
      previous.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    );
  };
  const submit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    const problems = {};
    for (const field of biltySections.flatMap((section) => section.fields)) {
      const value = form[field.key];
      if (field.required && String(value ?? "").trim() === "")
        problems[field.key] = "This field is required";
      if (
        field.type === "number" &&
        value !== "" &&
        (!Number.isFinite(Number(value)) ||
          Number(value) < (field.min || 0) ||
          (field.integer && !Number.isInteger(Number(value))))
      )
        problems[field.key] = "Enter a valid non-negative number";
    }
    if (balance < 0)
      problems.advancePaid = "Payment received cannot exceed total charges";
    if (Object.keys(problems).length) {
      setErrors(problems);
      setSubmitError("Please correct the highlighted fields.");
      return;
    }
    try {
      const payload = biltyPayload(form, items, jobId);
      const result = existing
        ? await updateBilty({ id: existing.id, ...payload }).unwrap()
        : await createBilty(payload).unwrap();
      setIsDirty(false);
      navigate(`/bilties/${result.bilty.id}`);
    } catch (error) {
      setErrors(
        Object.fromEntries(
          Object.entries(error.data?.fields || {}).map(([key, messages]) => [
            key,
            messages.join(". "),
          ]),
        ),
      );
      setSubmitError(
        error.data?.error || error.message || "Unable to save the bilty",
      );
    }
  };
  return (
    <div className="space-y-6 pb-10">
      <UnsavedModal />
      <div className="print:hidden"><button
            type="button"
            aria-label="Back"
            onClick={() =>
              confirmNavigation(
                existing
                  ? `/bilties/${existing.id}`
                  : jobId
                    ? `/jobs/${jobId}`
                    : "/bilties",
              )
            }
            className="inline-flex items-center gap-1.5 self-start px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back</span></button></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
        <div className="flex items-center gap-2.5 sm:gap-3">

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {existing
                ? `Edit Consignment Note ${existing.lrNumber}`
                : "Generate Consignment Note (Bilty / LR)"}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Goods receipt, transport details & delivery acknowledgement
            </p>
          </div>
        </div>
        {jobId ? (
          <div className="flex items-center gap-2 bg-brand-50 dark:bg-brand-950 text-brand-800 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <Truck className="w-4 h-4 shrink-0" />
            <span>Linked to Job #{jobId}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Standalone Bilty</span>
          </div>
        )}
      </div>
      {submitError && (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 text-rose-700">
          {submitError}
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        {biltySections.map((section) => (
          <section
            key={section.title}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              {(() => {
                const {
                  icon: Icon,
                  color,
                  title,
                } = sectionAppearance[section.title];
                return (
                  <>
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span>{title}</span>
                  </>
                );
              })()}
            </h3>
            {section.title === "Vehicle and cargo" && (
              <p className="text-xs text-slate-500">
                Record actual package count and measured weight / volume. Do not
                enter sample values.
              </p>
            )}
            {section.title === "Risk and insurance" && (
              <p className="text-xs text-slate-500">
                Higher carrier risk does not automatically mean a separate
                insurance policy is in place.
              </p>
            )}
            {section.title === "Delivery acknowledgement" && (
              <p className="text-xs text-slate-500">
                Complete after delivery. The printed document includes a
                receiver signature space.
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {section.fields.map((field) => (
                <div
                  key={field.key}
                  className={
                    field.type === "textarea" || field.fullWidth
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <label
                    htmlFor={`bilty-${field.key}`}
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-rose-600"> *</span>
                    )}
                  </label>
                  {field.type === "select" ? (
                    <Select
                      id={`bilty-${field.key}`}
                      name={field.key}
                      buttonClassName="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                      value={form[field.key]}
                      onChange={(event) =>
                        change(field.key, event.target.value)
                      }
                      aria-invalid={Boolean(errors[field.key])}
                      aria-describedby={
                        errors[field.key] ? `error-${field.key}` : undefined
                      }
                    >
                      {field.choices.map((choice) => {
                        const [value, label] = Array.isArray(choice)
                          ? choice
                          : [choice, choice];
                        return (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        );
                      })}
                    </Select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      id={`bilty-${field.key}`}
                      rows={2}
                      maxLength={field.key === "deliveryRemarks" ? 5000 : 500}
                      className={inputClass}
                      placeholder={biltyPlaceholders[field.key]}
                      value={form[field.key]}
                      required={field.required}
                      onChange={(event) =>
                        change(field.key, event.target.value)
                      }
                      aria-invalid={Boolean(errors[field.key])}
                      aria-describedby={
                        errors[field.key] ? `error-${field.key}` : undefined
                      }
                    />
                  ) : (
                    <input
                      id={`bilty-${field.key}`}
                      type={field.type}
                      placeholder={biltyPlaceholders[field.key]}
                      className={`${inputClass} ${field.type === "number" || field.type === "tel" || field.key.toLowerCase().includes("gstin") ? "font-mono" : ""}`}
                      value={form[field.key]}
                      required={field.required}
                      min={field.type === "number" ? field.min || 0 : undefined}
                      step={
                        field.type === "number"
                          ? field.integer
                            ? "1"
                            : "0.01"
                          : undefined
                      }
                      maxLength={field.type === "tel" ? 10 : 500}
                      onChange={(event) =>
                        change(field.key, event.target.value)
                      }
                      aria-invalid={Boolean(errors[field.key])}
                      aria-describedby={
                        errors[field.key] ? `error-${field.key}` : undefined
                      }
                    />
                  )}
                  {errors[field.key] && (
                    <p
                      id={`error-${field.key}`}
                      className="text-xs text-rose-600 mt-1"
                    >
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {section.title === "Freight and payment" && (
              <>
                <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Transport Freight:</span>
                    <span className="font-mono font-medium">
                      {money(form.freightAmount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Additional Charges:</span>
                    <span className="font-mono font-medium">
                      {money(total - Number(form.freightAmount || 0))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-800">
                    <span>Total Charges:</span>
                    <span className="font-mono">{money(total)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Payment Received:</span>
                    <span className="font-mono">
                      {money(form.advancePaid || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-amber-400 pt-2 border-t border-slate-800">
                    <span>Balance Due on Delivery:</span>
                    <span className="font-mono">{money(balance)}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Payment status:{" "}
                  {form.freightAmount === ""
                    ? "Enter shipment charges"
                    : balance <= 0
                      ? "Paid"
                      : "To pay"}
                  . GST, where applicable, is documented separately on the tax
                  invoice.
                </p>
              </>
            )}
          </section>
        ))}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600 dark:text-brand-300" />
              <span>Item-wise Inventory (Optional)</span>
            </h3>
            <button
              type="button"
              disabled={items.length >= 500}
              onClick={() => {
                setIsDirty(true);
                setItems((previous) => [
                  ...previous,
                  {
                    description: "",
                    quantity: "1",
                    packageType: "",
                    weightKg: "",
                    volume: "",
                  },
                ]);
              }}
              className="inline-flex items-center gap-1 text-sm text-brand-700"
            >
              <Plus size={16} />
              Add item
            </button>
          </div>
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-2 sm:grid-cols-6 gap-3 border-t border-slate-200 dark:border-slate-700 pt-4"
            >
              {[
                ["description", "Description", "text"],
                ["quantity", "Quantity", "number"],
                ["packageType", "Package type", "text"],
                ["weightKg", "Weight (kg)", "number"],
                ["volume", `Volume (${form.volumeUnit})`, "number"],
              ].map(([key, label, type]) => (
                <label
                  key={key}
                  className={`text-xs font-semibold ${key === "description" ? "col-span-2 sm:col-span-1" : ""}`}
                >
                  {label}
                  <input
                    className={`${inputClass} mt-1.5`}
                    type={type}
                    min={key === "quantity" ? 1 : 0}
                    step={key === "quantity" ? "1" : "any"}
                    maxLength={500}
                    required={key === "description" || key === "quantity"}
                    placeholder={
                      key === "description"
                        ? "Enter article description"
                        : key === "packageType"
                          ? "e.g. Box / crate / loose"
                          : key === "quantity"
                            ? "Quantity"
                            : "Measured value"
                    }
                    value={item[key] ?? ""}
                    onChange={(event) =>
                      changeItem(index, key, event.target.value)
                    }
                  />
                </label>
              ))}
              <button
                type="button"
                aria-label={`Remove item ${index + 1}`}
                onClick={() => {
                  setIsDirty(true);
                  setItems((previous) =>
                    previous.filter((_, i) => i !== index),
                  );
                }}
                className="self-end p-3 text-rose-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {errors.inventoryItems && (
            <p role="alert" className="text-xs text-rose-600">
              {errors.inventoryItems}
            </p>
          )}
        </section>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-500/20 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Consignment Note...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>
                {existing
                  ? "Save Bilty Changes"
                  : "Generate Official Consignment Note (LR)"}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
