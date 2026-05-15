export const CATEGORIES = [
  "Split AC",
  "Window AC",
  "Portable AC",
  "Central AC",
  "Filters",
  "Coils",
  "Fan Parts",
  "Electronics",
  "Accessories",
];

export const BRANDS = ["ColdFlyer", "Daikin", "LG", "Samsung", "Carrier", "Mitsubishi", "Other"];

export const TAGS = [
  { value: "Sale", label: "Sale" },
  { value: "New", label: "New" },
  { value: "Hot", label: "Hot" },
  { value: "Featured", label: "Featured" },
];

export const WARRANTIES = ["1 Year", "2 Years", "3 Years", "5 Years"];

export const DEFAULT_FORM_VALUES = {
  name: "",
  sku: "",
  brand: "",
  category: "",
  description: "",
  price: "",
  originalPrice: "",
  stock: "",
  productType: "unit",
  warranty: "",
  tag: "None",
  features: "",
  inBox: "",
  images: [],
};
