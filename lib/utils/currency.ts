export function fmtCurrency(amount: number | null, code: string | null): string {
  if (amount === null || amount === undefined || !code) return "—";
  try {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: code }).format(amount);
  } catch {
    return `${amount} ${code}`;
  }
}
