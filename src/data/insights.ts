import type { Insight } from "@/src/types";

export const insightsSeed: Insight[] = [
  {
    id: "ins-01",
    title: "Cash runway extended",
    description:
      "Liquid checking + savings cover about 4.6 months of your modeled essential spend — up slightly from last month.",
    tone: "positive",
  },
  {
    id: "ins-02",
    title: "Dining spend is calm",
    description:
      "Restaurant and café charges are 18% below your trailing 90-day average for this point in the month.",
    tone: "positive",
  },
  {
    id: "ins-03",
    title: "Subscription creep check",
    description:
      "You have three recurring entertainment charges; none increased in price this cycle.",
    tone: "neutral",
  },
  {
    id: "ins-04",
    title: "Shopping category pace",
    description:
      "General shopping is at 70% of budget with a week left — worth a quick review before any big purchases.",
    tone: "caution",
  },
  {
    id: "ins-05",
    title: "Credit utilization snapshot",
    description:
      "Revolving balance ticked up after the REI charge; paying the card before statement close keeps scores happier.",
    tone: "caution",
  },
  {
    id: "ins-06",
    title: "Income stability",
    description:
      "Payroll and small side inflows matched expectations; no duplicate deposits or missing splits detected.",
    tone: "info",
  },
];
