export function formatCurrency(
  amount: number,
  options?: { hide?: boolean }
): string {
  if (options?.hide) return "••••••";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
