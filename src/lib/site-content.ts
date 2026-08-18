/**
 * Central editable business content.
 * Everything here is intended to be moved into admin Settings / database later.
 * Placeholder values are clearly marked and must be confirmed by the owner.
 */

export const business = {
  name: "Assurance Trucking LLC",
  tagline: "Moving Made Simple. Delivered With Confidence.",
  website: "https://assurancetruckingllc.com",
  /** Placeholder — confirm with owner before publishing. */
  phone: "",
  email: "",
  address: "",
  hours: [
    { day: "Monday – Friday", value: "To be confirmed" },
    { day: "Saturday", value: "To be confirmed" },
    { day: "Sunday", value: "To be confirmed" },
  ],
};

export type ServiceSlug =
  | "residential-moving"
  | "commercial-office-moving"
  | "local-moving"
  | "long-distance-moving"
  | "interstate-moving"
  | "trucking-freight"
  | "furniture-delivery"
  | "junk-removal"
  | "storage";

export type Service = {
  slug: ServiceSlug;
  name: string;
  icon: string;
  short: string;
  overview: string;
  includes: string[];
  expect: string[];
  faqs: { q: string; a: string }[];
  featured?: boolean;
};

export const services: Service[] = [
  {
    slug: "residential-moving",
    name: "Residential Moving",
    icon: "Home",
    short: "Household moves handled carefully, from a studio apartment to a full house.",
    overview:
      "Whether you're moving across town or to another state, Assurance Trucking LLC helps make the process organized and straightforward. We plan around your schedule, handle your belongings with care, and keep you informed from pickup through delivery.",
    includes: [
      "Furniture moving and protective wrapping",
      "Boxes and household items",
      "Loading and unloading",
      "Pickup and delivery coordination",
      "Special item considerations discussed in advance",
    ],
    expect: [
      "A quote based on the details and photos you provide",
      "A confirmed date and arrival window before the move",
      "Clear communication on the day of service",
    ],
    faqs: [
      {
        q: "Do you help with packing?",
        a: "Packing assistance may be available depending on the job. Mention it in your request and we'll confirm before quoting.",
      },
      {
        q: "How is a residential move priced?",
        a: "Pricing depends on volume, distance, access (stairs, elevators, parking) and any special handling. We review your details and send a written quote.",
      },
    ],
    featured: true,
  },
  {
    slug: "commercial-office-moving",
    name: "Commercial & Office Moving",
    icon: "Building2",
    short: "Office and business relocations scheduled around your operating hours.",
    overview:
      "We help businesses relocate desks, equipment, files, and furniture with minimal disruption. Moves can be scheduled after hours or on weekends when needed.",
    includes: [
      "Office furniture and workstations",
      "Equipment and file transport",
      "Loading dock and elevator coordination",
      "Flexible after-hours scheduling",
    ],
    expect: [
      "A walkthrough of the details before scheduling",
      "A written quote with the scope clearly listed",
      "A single point of contact throughout the move",
    ],
    faqs: [
      {
        q: "Can you move on a weekend?",
        a: "Weekend and after-hours scheduling can often be arranged. Note your preferred window in the booking request.",
      },
    ],
    featured: true,
  },
  {
    slug: "local-moving",
    name: "Local Moving",
    icon: "MapPin",
    short: "Short-distance moves within the service area, usually completed same day.",
    overview:
      "Local moves are typically completed in a single day. Tell us what you're moving and where it's going, and we'll plan the route and timing around you.",
    includes: [
      "Same-day pickup and delivery when scheduling allows",
      "Loading and unloading",
      "Furniture protection",
    ],
    expect: ["An arrival window rather than an exact minute", "Straightforward, itemized pricing"],
    faqs: [
      {
        q: "How far counts as local?",
        a: "Local generally means within the confirmed service area. If your move crosses further, we'll quote it as long-distance.",
      },
    ],
  },
  {
    slug: "long-distance-moving",
    name: "Long-Distance Moving",
    icon: "Route",
    short: "Longer hauls planned in advance with clear pickup and delivery timing.",
    overview:
      "Long-distance moves are planned ahead so you know when your items will be picked up and when they should arrive.",
    includes: ["Route and timing planning", "Secure loading", "Delivery scheduling and updates"],
    expect: ["A pickup date and a delivery window", "Status updates as the job progresses"],
    faqs: [
      {
        q: "How far in advance should I book?",
        a: "The earlier the better. Longer moves benefit from at least a couple of weeks of notice when possible.",
      },
    ],
  },
  {
    slug: "interstate-moving",
    name: "Interstate Moving",
    icon: "Milestone",
    short: "Moves that cross state lines, coordinated end to end.",
    overview:
      "Moving to another state involves more planning. We confirm the details up front so pickup, transport, and delivery all line up.",
    includes: ["Cross-state transport", "Pickup and delivery coordination", "Progress updates"],
    expect: ["Confirmation of the route and dates before booking", "A written quote before any work begins"],
    faqs: [
      {
        q: "Which states do you serve?",
        a: "Service areas are listed on the Service Areas page and are kept current by the owner.",
      },
    ],
  },
  {
    slug: "trucking-freight",
    name: "Trucking & Freight",
    icon: "Truck",
    short: "Palletized loads, equipment, and general freight transport.",
    overview:
      "We move freight, equipment, and larger loads on a scheduled basis. Share the dimensions, weight, and destination and we'll confirm what we can carry.",
    includes: ["Scheduled pickups and deliveries", "Palletized and loose freight", "Equipment transport"],
    expect: ["Confirmation of weight and dimension limits", "A quote based on route and load"],
    faqs: [
      {
        q: "Do you handle recurring freight runs?",
        a: "Recurring schedules can be discussed. Include the details in your request.",
      },
    ],
    featured: true,
  },
  {
    slug: "furniture-delivery",
    name: "Furniture Delivery",
    icon: "Sofa",
    short: "Single-item and store pickup deliveries, brought inside and placed.",
    overview:
      "Bought something too large for your vehicle? We pick it up and deliver it, including in-home placement where access allows.",
    includes: ["Store or marketplace pickup", "Careful transport", "In-home placement where access allows"],
    expect: ["A short arrival window", "Confirmation of stairs, elevators, and parking beforehand"],
    faqs: [
      {
        q: "Can you pick up from a store or marketplace seller?",
        a: "Yes. Provide the pickup address and any pickup reference number in your request.",
      },
    ],
    featured: true,
  },
  {
    slug: "junk-removal",
    name: "Junk Removal",
    icon: "Trash2",
    short: "Clear-outs of furniture, appliances, and general household items.",
    overview:
      "We haul away unwanted furniture, appliances, and household items. Photos help us quote accurately and confirm what can be accepted.",
    includes: ["Furniture and appliance removal", "Garage, basement, and estate clear-outs", "Loading included"],
    expect: ["A quote based on volume and item type", "Confirmation of any items we cannot accept"],
    faqs: [
      {
        q: "Are there items you can't take?",
        a: "Hazardous materials and certain restricted items cannot be transported. We'll confirm when reviewing your photos.",
      },
    ],
  },
  {
    slug: "storage",
    name: "Storage",
    icon: "Package",
    short: "Short-term storage options between pickup and delivery.",
    overview:
      "If your timing doesn't line up, storage between pickup and delivery may be available. Availability and pricing are confirmed per job.",
    includes: ["Short-term storage between pickup and delivery", "Inventory noted on your booking"],
    expect: ["Confirmation of availability before booking", "Storage cost included in your written quote"],
    faqs: [
      {
        q: "How long can items be stored?",
        a: "Duration depends on availability. Let us know the dates you need and we'll confirm.",
      },
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/** Editable from admin settings later. Only confirmed areas should be listed. */
export const serviceAreas = [
  { region: "Maryland", note: "Statewide coverage subject to scheduling." },
  { region: "Washington, DC", note: "Full district coverage." },
  { region: "Virginia", note: "Northern Virginia and surrounding areas." },
  { region: "Other areas", note: "Long-distance and interstate jobs quoted on request." },
];

export const howItWorks = [
  { title: "Request a Quote", body: "Tell us about your move or delivery, and add photos if you have them." },
  { title: "Review Your Quote", body: "We review the details and send you clear, written pricing." },
  { title: "Schedule Your Service", body: "Choose a convenient date and arrival window." },
  { title: "We Handle the Rest", body: "We pick up, transport, and deliver your items." },
];

export const valueProps = [
  { title: "Reliable Service", body: "We show up when we say we will and keep the plan on track." },
  { title: "Careful Handling", body: "Your belongings are wrapped, loaded, and placed with attention." },
  { title: "Straightforward Communication", body: "Written quotes, clear timing, and status updates." },
  { title: "Flexible Scheduling", body: "Evening and weekend windows can often be arranged." },
  { title: "Customer-Focused", body: "You work directly with the owner-operator, not a call center." },
];

export const faqItems = [
  {
    q: "How do I request a quote?",
    a: "Use the Book Now form. Share your service type, pickup and drop-off details, items, and photos. We'll review and send a written quote.",
  },
  {
    q: "How far in advance should I book?",
    a: "As early as you can. Short-notice jobs are sometimes possible depending on the schedule.",
  },
  { q: "Do you provide local moving?", a: "Yes. Local moves within the confirmed service area are available." },
  { q: "Do you provide long-distance moving?", a: "Yes. Longer moves are planned in advance and quoted per job." },
  { q: "Do you provide interstate moving?", a: "Yes, for routes we can confirm. Ask when submitting your request." },
  {
    q: "Can I upload photos of my items?",
    a: "Yes, and it helps. Photos of furniture, rooms, stairs, and entrances lead to a more accurate quote.",
  },
  {
    q: "How does pricing work?",
    a: "Pricing is based on the service, volume, distance, access, and any special handling. You receive a written quote before any work begins.",
  },
  {
    q: "Do I need to pay a deposit?",
    a: "A deposit is typically required to confirm a date. The amount is shown on your quote.",
  },
  { q: "How can I reschedule?", a: "Contact us as soon as possible and we'll find another available date." },
  { q: "How do I track my booking?", a: "Use the Track My Move page and enter your booking number, for example AT-10482." },
  {
    q: "What happens after I submit a request?",
    a: "You'll get a booking number right away. We review the details and follow up with your quote and availability.",
  },
  {
    q: "What items cannot be transported?",
    a: "Hazardous materials and certain restricted items cannot be moved. We'll confirm when reviewing your request.",
  },
  { q: "Do you provide storage?", a: "Short-term storage between pickup and delivery may be available. Ask when booking." },
  { q: "How do I contact Assurance Trucking?", a: "Use the Contact page form, or call or email using the details listed there." },
];