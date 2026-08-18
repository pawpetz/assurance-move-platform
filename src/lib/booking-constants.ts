import { services } from "@/lib/site-content";

export const bookingServiceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.name })),
  { value: "other", label: "Other" },
] as const;

export const timeWindowOptions = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "flexible", label: "Flexible" },
] as const;

export const usStates = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export const commonItemSuggestions = [
  "Sofa",
  "Bed",
  "Dresser",
  "Table",
  "Chairs",
  "Boxes",
  "Appliances",
  "Office Equipment",
];

export const MAX_PHOTOS = 12;
export const MAX_PHOTO_SIZE_MB = 10;
