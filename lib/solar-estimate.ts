// Scenario estimate for conventional low-voltage bills, not utility billing.
// Availability references: https://www.gov.br/aneel/pt-br/assuntos/geracao-distribuida/
// The reduction is an explicit scenario assumption, not a statutory discount
// or a calculation of the customer's actual Fio B, taxes or solar production.
export function estimateSolarBill(input: {
  bill: number;
  tariff: number;
  lighting: number;
  connection: 30 | 50 | 100;
  reduction: number;
}) {
  const { bill, tariff, lighting, connection, reduction } = input;
  if (![bill, tariff, lighting, reduction].every(Number.isFinite) || bill <= 0 || tariff <= 0 || lighting < 0 || lighting > bill || reduction < 0 || reduction > 95 || ![30, 50, 100].includes(connection)) {
    throw new Error('Confira os valores: a iluminação pública não pode superar a conta e a redução deve estar entre 0% e 95%.');
  }
  const round = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
  const energy = bill - lighting;
  const minimum = connection * tariff;
  // Never invent savings for bills already below the assumed minimum
  // (e.g. subsidized tariffs, which need an individual assessment).
  const after = round(Math.min(bill, lighting + Math.max(minimum, energy * (1 - reduction / 100))));
  const monthlySavings = round(bill - after);
  return { after, monthlySavings, annualSavings: round(monthlySavings * 12), percentage: Math.round(monthlySavings / bill * 100) };
}
