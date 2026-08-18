import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  bookingServiceOptions,
  commonItemSuggestions,
  MAX_PHOTOS,
  MAX_PHOTO_SIZE_MB,
  timeWindowOptions,
  usStates,
} from "@/lib/booking-constants";
import { createBooking, type BookingItemEntry, type LocationDetails } from "@/lib/bookings-store";
import { toast } from "sonner";
import { serviceBySlug } from "@/lib/site-content";
import { cn } from "@/lib/utils";

const title = "Book Now | Assurance Trucking LLC";
const description =
  "Request a quote for moving, trucking, delivery, or junk removal. Tell us about your job, add photos, and we'll follow up with pricing and availability.";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: BookPage,
});

const emptyLocation: LocationDetails = {
  address: "",
  unit: "",
  city: "",
  state: "",
  zip: "",
  contactName: "",
  contactPhone: "",
  date: "",
  timeWindow: "",
  elevator: "",
  stairs: "",
  parkingDifficult: "",
  accessNotes: "",
};

interface FormState {
  service: string;
  serviceOther: string;
  pickup: LocationDetails;
  dropoff: LocationDetails;
  items: BookingItemEntry[];
  rooms: string;
  estimatedBoxes: string;
  heavyItems: string;
  specialHandling: string;
  largeItemDescription: string;
  photos: File[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredContact: "phone" | "text" | "email" | "";
    notes: string;
    agree: boolean;
  };
}

const initialState: FormState = {
  service: "",
  serviceOther: "",
  pickup: { ...emptyLocation },
  dropoff: { ...emptyLocation },
  items: [],
  rooms: "",
  estimatedBoxes: "",
  heavyItems: "",
  specialHandling: "",
  largeItemDescription: "",
  photos: [],
  customer: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContact: "",
    notes: "",
    agree: false,
  },
};

const STEP_LABELS = ["Service", "Pickup", "Drop-off", "Items & Photos", "Your Info", "Review"];

function BookPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function updatePickup(patch: Partial<LocationDetails>) {
    setForm((f) => ({ ...f, pickup: { ...f.pickup, ...patch } }));
  }
  function updateDropoff(patch: Partial<LocationDetails>) {
    setForm((f) => ({ ...f, dropoff: { ...f.dropoff, ...patch } }));
  }
  function updateCustomer(patch: Partial<FormState["customer"]>) {
    setForm((f) => ({ ...f, customer: { ...f.customer, ...patch } }));
  }

  function validateStep(current: number): string[] {
    const errs: string[] = [];
    if (current === 0) {
      if (!form.service) errs.push("Please select a service.");
      if (form.service === "other" && !form.serviceOther.trim())
        errs.push("Please describe the service you need.");
    }
    if (current === 1) {
      if (!form.pickup.address.trim()) errs.push("Pickup address is required.");
      if (!form.pickup.city.trim()) errs.push("Pickup city is required.");
      if (!form.pickup.state) errs.push("Pickup state is required.");
      if (!form.pickup.zip.trim()) errs.push("Pickup ZIP code is required.");
      if (!form.pickup.contactName.trim()) errs.push("Pickup contact name is required.");
      if (!form.pickup.contactPhone.trim()) errs.push("Pickup contact phone is required.");
      if (!form.pickup.date) errs.push("Preferred pickup date is required.");
    }
    if (current === 2) {
      if (!form.dropoff.address.trim()) errs.push("Drop-off address is required.");
      if (!form.dropoff.city.trim()) errs.push("Drop-off city is required.");
      if (!form.dropoff.state) errs.push("Drop-off state is required.");
      if (!form.dropoff.zip.trim()) errs.push("Drop-off ZIP code is required.");
    }
    if (current === 3) {
      if (form.items.length === 0) errs.push("Add at least one item, or a general description.");
    }
    if (current === 4) {
      if (!form.customer.firstName.trim()) errs.push("First name is required.");
      if (!form.customer.lastName.trim()) errs.push("Last name is required.");
      if (!form.customer.email.trim()) errs.push("Email is required.");
      if (!form.customer.phone.trim()) errs.push("Phone is required.");
      if (!form.customer.preferredContact) errs.push("Please select a preferred contact method.");
      if (!form.customer.agree) errs.push("Please confirm the information provided is accurate.");
    }
    return errs;
  }

  function goNext() {
    const errs = validateStep(step);
    setErrors(errs);
    if (errs.length > 0) return;
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setErrors([]);
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    const errs = validateStep(4);
    setErrors(errs);
    if (errs.length > 0) {
      setStep(4);
      return;
    }
    setSubmitting(true);
    try {
      const booking = await createBooking({
        service: form.service,
        serviceOther: form.serviceOther,
        pickup: form.pickup,
        dropoff: form.dropoff,
        items: form.items,
        rooms: form.rooms,
        estimatedBoxes: form.estimatedBoxes,
        heavyItems: form.heavyItems,
        specialHandling: form.specialHandling,
        largeItemDescription: form.largeItemDescription,
        photos: form.photos,
        customer: {
          firstName: form.customer.firstName,
          lastName: form.customer.lastName,
          email: form.customer.email,
          phone: form.customer.phone,
          preferredContact: form.customer.preferredContact,
          notes: form.customer.notes,
        },
      });
      navigate({ to: "/book/confirmation", search: { booking: booking.bookingNumber } });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong submitting your request.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const serviceName =
    form.service === "other"
      ? form.serviceOther || "Other"
      : (serviceBySlug(form.service)?.name ?? "");

  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-10 md:py-14">
          <p className="eyebrow">Book Now</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
            Request your service
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            This is a quote request, not a final price. We'll review the details and follow up with
            written pricing and availability.
          </p>
          <StepProgress step={step} />
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="mx-auto max-w-2xl">
          {errors.length > 0 ? (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            >
              <ul className="list-inside list-disc space-y-1">
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {step === 0 ? <StepService form={form} setForm={setForm} /> : null}
          {step === 1 ? (
            <StepLocation
              title="Pickup details"
              value={form.pickup}
              onChange={updatePickup}
              accessLabel="pickup"
            />
          ) : null}
          {step === 2 ? (
            <StepLocation
              title="Drop-off details"
              value={form.dropoff}
              onChange={updateDropoff}
              accessLabel="drop-off"
            />
          ) : null}
          {step === 3 ? <StepItemsPhotos form={form} setForm={setForm} /> : null}
          {step === 4 ? <StepCustomer value={form.customer} onChange={updateCustomer} /> : null}
          {step === 5 ? (
            <StepReview form={form} serviceName={serviceName} onEditStep={setStep} />
          ) : null}

          <div className="mt-10 flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button type="button" variant="outline" size="lg" onClick={goBack}>
                Back
              </Button>
            ) : (
              <span />
            )}
            {step < STEP_LABELS.length - 1 ? (
              <Button type="button" variant="hero" size="lg" onClick={goNext}>
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                variant="hero"
                size="lg"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                Submit Request
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function StepProgress({ step }: { step: number }) {
  return (
    <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
      {STEP_LABELS.map((label, i) => (
        <li key={label} className="flex items-center gap-2 text-sm">
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
              i < step
                ? "bg-accent text-accent-foreground"
                : i === step
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground",
            )}
          >
            {i < step ? <Check className="size-3.5" /> : i + 1}
          </span>
          <span
            className={cn(i === step ? "font-medium text-foreground" : "text-muted-foreground")}
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function StepService({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-semibold">What service do you need?</h2>
      <RadioGroup
        value={form.service}
        onValueChange={(v) => setForm((f) => ({ ...f, service: v }))}
        className="grid gap-3 sm:grid-cols-2"
      >
        {bookingServiceOptions.map((opt) => (
          <label
            key={opt.value}
            htmlFor={`service-${opt.value}`}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border border-input px-4 py-3 text-sm transition-colors",
              form.service === opt.value ? "border-primary bg-secondary" : "hover:bg-secondary/60",
            )}
          >
            <RadioGroupItem value={opt.value} id={`service-${opt.value}`} />
            {opt.label}
          </label>
        ))}
      </RadioGroup>
      {form.service === "other" ? (
        <Field label="Please describe the service" htmlFor="serviceOther">
          <Input
            id="serviceOther"
            value={form.serviceOther}
            onChange={(e) => setForm((f) => ({ ...f, serviceOther: e.target.value }))}
          />
        </Field>
      ) : null}
    </div>
  );
}

function StepLocation({
  title,
  value,
  onChange,
  accessLabel,
}: {
  title: string;
  value: LocationDetails;
  onChange: (patch: Partial<LocationDetails>) => void;
  accessLabel: string;
}) {
  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-semibold">{title}</h2>

      <Field label="Address" htmlFor={`${accessLabel}-address`}>
        <Input
          id={`${accessLabel}-address`}
          value={value.address}
          onChange={(e) => onChange({ address: e.target.value })}
        />
      </Field>
      <Field label="Apartment / Suite (optional)" htmlFor={`${accessLabel}-unit`}>
        <Input
          id={`${accessLabel}-unit`}
          value={value.unit}
          onChange={(e) => onChange({ unit: e.target.value })}
        />
      </Field>
      <FieldRow>
        <Field label="City" htmlFor={`${accessLabel}-city`}>
          <Input
            id={`${accessLabel}-city`}
            value={value.city}
            onChange={(e) => onChange({ city: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="State" htmlFor={`${accessLabel}-state`}>
            <Select value={value.state} onValueChange={(v) => onChange({ state: v })}>
              <SelectTrigger id={`${accessLabel}-state`}>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {usStates.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="ZIP code" htmlFor={`${accessLabel}-zip`}>
            <Input
              id={`${accessLabel}-zip`}
              value={value.zip}
              onChange={(e) => onChange({ zip: e.target.value })}
            />
          </Field>
        </div>
      </FieldRow>

      <FieldRow>
        <Field label="Contact name" htmlFor={`${accessLabel}-contactName`}>
          <Input
            id={`${accessLabel}-contactName`}
            value={value.contactName}
            onChange={(e) => onChange({ contactName: e.target.value })}
          />
        </Field>
        <Field label="Contact phone" htmlFor={`${accessLabel}-contactPhone`}>
          <Input
            id={`${accessLabel}-contactPhone`}
            type="tel"
            value={value.contactPhone}
            onChange={(e) => onChange({ contactPhone: e.target.value })}
          />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Preferred date" htmlFor={`${accessLabel}-date`}>
          <Input
            id={`${accessLabel}-date`}
            type="date"
            value={value.date}
            onChange={(e) => onChange({ date: e.target.value })}
          />
        </Field>
        <Field label="Preferred time window" htmlFor={`${accessLabel}-window`}>
          <Select
            value={value.timeWindow}
            onValueChange={(v) => onChange({ timeWindow: v as LocationDetails["timeWindow"] })}
          >
            <SelectTrigger id={`${accessLabel}-window`}>
              <SelectValue placeholder="Select a window" />
            </SelectTrigger>
            <SelectContent>
              {timeWindowOptions.map((w) => (
                <SelectItem key={w.value} value={w.value}>
                  {w.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldRow>

      <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-3">
        <YesNoField
          label="Is there an elevator?"
          value={value.elevator}
          onChange={(v) => onChange({ elevator: v })}
        />
        <YesNoField
          label="Are there stairs?"
          value={value.stairs}
          onChange={(v) => onChange({ stairs: v })}
        />
        <YesNoField
          label="Is parking difficult?"
          value={value.parkingDifficult}
          onChange={(v) => onChange({ parkingDifficult: v })}
        />
      </div>

      <Field label="Special access instructions (optional)" htmlFor={`${accessLabel}-notes`}>
        <Textarea
          id={`${accessLabel}-notes`}
          value={value.accessNotes}
          onChange={(e) => onChange({ accessNotes: e.target.value })}
          rows={3}
        />
      </Field>
    </div>
  );
}

function YesNoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: LocationDetails["elevator"];
  onChange: (v: LocationDetails["elevator"]) => void;
}) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as LocationDetails["elevator"])}
        className="flex gap-4"
      >
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <RadioGroupItem value="yes" /> Yes
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <RadioGroupItem value="no" /> No
        </label>
      </RadioGroup>
    </div>
  );
}

function StepItemsPhotos({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  function addItem(name: string) {
    if (!name.trim()) return;
    setForm((f) => ({
      ...f,
      items: [...f.items, { id: crypto.randomUUID(), name: name.trim(), quantity: 1 }],
    }));
  }

  function updateItemQty(id: string, quantity: number) {
    setForm((f) => ({
      ...f,
      items: f.items.map((it) => (it.id === id ? { ...it, quantity: Math.max(1, quantity) } : it)),
    }));
  }

  function removeItem(id: string) {
    setForm((f) => ({ ...f, items: f.items.filter((it) => it.id !== id) }));
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setPhotoError(null);
    const incoming = Array.from(files);
    const tooBig = incoming.find((f) => f.size > MAX_PHOTO_SIZE_MB * 1024 * 1024);
    if (tooBig) {
      setPhotoError(
        `"${tooBig.name}" is larger than ${MAX_PHOTO_SIZE_MB}MB. Please choose a smaller photo.`,
      );
      return;
    }
    setForm((f) => {
      const combined = [...f.photos, ...incoming];
      if (combined.length > MAX_PHOTOS) {
        setPhotoError(`You can upload up to ${MAX_PHOTOS} photos.`);
        return f;
      }
      return { ...f, photos: combined };
    });
  }

  function removePhoto(index: number) {
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== index) }));
  }

  const [customItem, setCustomItem] = useState("");

  return (
    <div className="grid gap-8">
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">What are you moving?</h2>
        <div className="flex flex-wrap gap-2">
          {commonItemSuggestions.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => addItem(name)}
              className="rounded-full border border-input px-3 py-1.5 text-sm hover:bg-secondary"
            >
              + {name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add another item"
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem(customItem);
                setCustomItem("");
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              addItem(customItem);
              setCustomItem("");
            }}
          >
            <Plus className="size-4" /> Add
          </Button>
        </div>

        {form.items.length > 0 ? (
          <ul className="grid gap-2">
            {form.items.map((it) => (
              <li
                key={it.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-2.5"
              >
                <span className="text-sm">{it.name}</span>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={1}
                    value={it.quantity}
                    onChange={(e) => updateItemQty(it.id, Number(e.target.value) || 1)}
                    className="h-8 w-16"
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${it.name}`}
                    onClick={() => removeItem(it.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No items added yet.</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Number of rooms" htmlFor="rooms">
          <Input
            id="rooms"
            value={form.rooms}
            onChange={(e) => setForm((f) => ({ ...f, rooms: e.target.value }))}
          />
        </Field>
        <Field label="Estimated number of boxes" htmlFor="estimatedBoxes">
          <Input
            id="estimatedBoxes"
            value={form.estimatedBoxes}
            onChange={(e) => setForm((f) => ({ ...f, estimatedBoxes: e.target.value }))}
          />
        </Field>
      </div>
      <Field label="Heavy or oversized items (optional)" htmlFor="heavyItems">
        <Textarea
          id="heavyItems"
          rows={2}
          value={form.heavyItems}
          onChange={(e) => setForm((f) => ({ ...f, heavyItems: e.target.value }))}
        />
      </Field>
      <Field label="Special handling requirements (optional)" htmlFor="specialHandling">
        <Textarea
          id="specialHandling"
          rows={2}
          value={form.specialHandling}
          onChange={(e) => setForm((f) => ({ ...f, specialHandling: e.target.value }))}
        />
      </Field>
      <Field label="Large item description (optional)" htmlFor="largeItemDescription">
        <Textarea
          id="largeItemDescription"
          rows={2}
          value={form.largeItemDescription}
          onChange={(e) => setForm((f) => ({ ...f, largeItemDescription: e.target.value }))}
        />
      </Field>

      <div className="grid gap-3">
        <h3 className="text-lg font-semibold">Photos</h3>
        <p className="text-sm text-muted-foreground">
          Photos help us understand your job and provide a more accurate quote.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input px-6 py-10 text-center hover:bg-secondary/50"
        >
          <ImagePlus className="size-6 text-muted-foreground" />
          <span className="text-sm font-medium">Tap to add photos</span>
          <span className="text-xs text-muted-foreground">
            Furniture, rooms, stairs, entrances — up to {MAX_PHOTOS}
          </span>
        </button>
        {photoError ? <p className="text-sm text-destructive">{photoError}</p> : null}
        {form.photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {form.photos.map((file, i) => (
              <PhotoThumb key={`${file.name}-${i}`} file={file} onRemove={() => removePhoto(i)} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PhotoThumb({ file, onRemove }: { file: File; onRemove: () => void }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg border border-border">
      <img src={url} alt={file.name} className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

function StepCustomer({
  value,
  onChange,
}: {
  value: FormState["customer"];
  onChange: (patch: Partial<FormState["customer"]>) => void;
}) {
  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-semibold">Your information</h2>
      <FieldRow>
        <Field label="First name" htmlFor="firstName">
          <Input
            id="firstName"
            value={value.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
          />
        </Field>
        <Field label="Last name" htmlFor="lastName">
          <Input
            id="lastName"
            value={value.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
          />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            value={value.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <Input
            id="phone"
            type="tel"
            value={value.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </Field>
      </FieldRow>

      <div className="grid gap-2">
        <span className="text-sm font-medium">Preferred contact method</span>
        <RadioGroup
          value={value.preferredContact}
          onValueChange={(v) =>
            onChange({ preferredContact: v as FormState["customer"]["preferredContact"] })
          }
          className="flex flex-wrap gap-4"
        >
          {["phone", "text", "email"].map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm capitalize">
              <RadioGroupItem value={opt} /> {opt}
            </label>
          ))}
        </RadioGroup>
      </div>

      <Field label="Additional notes (optional)" htmlFor="notes">
        <Textarea
          id="notes"
          rows={3}
          value={value.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </Field>

      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <Checkbox
          checked={value.agree}
          onCheckedChange={(c) => onChange({ agree: c === true })}
          className="mt-0.5"
        />
        I agree that the information provided is accurate to the best of my knowledge.
      </label>
    </div>
  );
}

function SummaryBlock({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-medium text-primary hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="mt-2 grid gap-1 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function StepReview({
  form,
  serviceName,
  onEditStep,
}: {
  form: FormState;
  serviceName: string;
  onEditStep: (step: number) => void;
}) {
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Review your request</h2>

      <SummaryBlock title="Service" onEdit={() => onEditStep(0)}>
        <p>{serviceName || "—"}</p>
      </SummaryBlock>

      <SummaryBlock title="Pickup" onEdit={() => onEditStep(1)}>
        <p>
          {form.pickup.address} {form.pickup.unit}, {form.pickup.city}, {form.pickup.state}{" "}
          {form.pickup.zip}
        </p>
        <p>
          {form.pickup.date || "No date selected"} ·{" "}
          {form.pickup.timeWindow || "No window selected"}
        </p>
        <p>
          Contact: {form.pickup.contactName} {form.pickup.contactPhone}
        </p>
      </SummaryBlock>

      <SummaryBlock title="Drop-off" onEdit={() => onEditStep(2)}>
        <p>
          {form.dropoff.address} {form.dropoff.unit}, {form.dropoff.city}, {form.dropoff.state}{" "}
          {form.dropoff.zip}
        </p>
        <p>
          {form.dropoff.date || "No date selected"} ·{" "}
          {form.dropoff.timeWindow || "No window selected"}
        </p>
      </SummaryBlock>

      <SummaryBlock title="Items & photos" onEdit={() => onEditStep(3)}>
        <p>
          {form.items.map((it) => `${it.name} (${it.quantity})`).join(", ") || "No items listed"}
        </p>
        <p>{form.photos.length} photo(s) attached</p>
      </SummaryBlock>

      <SummaryBlock title="Your information" onEdit={() => onEditStep(4)}>
        <p>
          {form.customer.firstName} {form.customer.lastName}
        </p>
        <p>
          {form.customer.email} · {form.customer.phone}
        </p>
        <p className="capitalize">Preferred contact: {form.customer.preferredContact || "—"}</p>
      </SummaryBlock>

      <p className="text-sm text-muted-foreground">
        Submitting sends a quote request — it does not book or charge anything. We'll follow up with
        pricing and availability. See our{" "}
        <Link to="/legal/terms" className="underline">
          terms
        </Link>{" "}
        for details.
      </p>
    </div>
  );
}
