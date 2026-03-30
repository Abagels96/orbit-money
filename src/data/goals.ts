import type { Goal } from "@/src/types";

export const goalsSeed: Goal[] = [
  {
    id: "goal-01",
    name: "Emergency fund — 6 months",
    target: 28000,
    current: 19240,
    deadline: "2026-12-31",
    color: "#2dd4bf",
  },
  {
    id: "goal-02",
    name: "Kyoto spring trip",
    target: 4200,
    current: 1580,
    deadline: "2027-03-15",
    color: "#a78bfa",
  },
  {
    id: "goal-03",
    name: "Used EV down payment",
    target: 9000,
    current: 3240,
    deadline: "2027-08-01",
    color: "#34d399",
  },
  {
    id: "goal-04",
    name: "Home office refresh",
    target: 2400,
    current: 890,
    deadline: "2026-09-30",
    color: "#fb7185",
  },
];
