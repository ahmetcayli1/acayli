export const COUNTRIES = [
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  // Future expansion
  { code: "US", name: "United States", flag: "🇺🇸", disabled: true },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧", disabled: true },
];

export const TEST_PRIORITIES = {
  DE: {
    BACHELOR: [{ name: "German (TestDaF/DSH)", required: false }, { name: "English (IELTS/TOEFL)", required: true }],
    MASTER: [{ name: "English (IELTS/TOEFL)", required: true }, { name: "German (A1-C1)", required: false }]
  },
  IT: {
    BACHELOR: [{ name: "TOLC", required: true }, { name: "SAT", required: false }],
    MASTER: [{ name: "English (IELTS/TOEFL)", required: true }]
  },
  PL: {
    BACHELOR: [{ name: "High School Diploma", required: true }],
    MASTER: [{ name: "English (IELTS/TOEFL)", required: true }]
  }
} as const;
