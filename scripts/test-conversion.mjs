import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";

const baseURL = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3001";
const executablePath = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(baseURL, { signal: AbortSignal.timeout(3000) });
      if (response.ok) return;
    } catch {
      // The development server may still be compiling its first response.
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  throw new Error(`Server did not become ready: ${baseURL}`);
}

await waitForServer();
const browser = await chromium.launch({ executablePath, headless: true });
const pageErrors = [];
const results = [];

async function prepare(context) {
  const page = await context.newPage();
  page.on("pageerror", (error) => pageErrors.push(error.message));
  // Tests inspect outbound messages without navigating to WhatsApp.
  await page.route("https://wa.me/**", (route) => route.abort());
  await page.goto(baseURL, { waitUntil: "domcontentloaded", timeout: 90000 });
  await expect(page.locator("#simule")).toBeAttached();
  await page.waitForLoadState("networkidle", { timeout: 45000 });
  return page;
}

try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  const page = await prepare(desktop);
  const bill = page.locator("#monthly-bill");
  const city = page.locator("#property-city");
  const submit = page.getByRole("button", { name: "Calcular potencial" });
  const result = page.locator(".calculator-result");

  await submit.click();
  await expect(result).toHaveCount(0);
  await expect(city).toBeFocused();
  assert.equal(await city.evaluate((input) => input.validity.valueMissing), true);

  await city.fill("   ");
  await submit.click();
  await expect(page.locator("#calculator-city-error")).toHaveText("Informe a cidade do imóvel para continuar.");
  await expect(city).toBeFocused();
  await expect(city).toHaveAttribute("aria-invalid", "true");
  results.push("Required city rejects empty and whitespace-only input.");

  await bill.fill("7500");
  await page.locator(".calculator-property-option").filter({ hasText: "Empresa" }).click();
  await expect(page.getByRole("radio", { name: "Empresa", exact: true })).toBeChecked();
  await city.fill("  São José dos Campos, SP  ");
  await submit.click();
  await expect(result).toBeVisible();
  await expect(result.getByRole("heading")).toHaveText("Sua conta estimada com energia solar");
  await expect(result).toContainText("sua empresa");
  await expect(page.locator(".calculator-range")).toHaveValue("5000");

  const expectedMessage = [
    "Olá! Fiz uma simulação no site da Casa 7 Solar Energy.",
    "",
    "Tipo de imóvel: Empresarial",
    "Conta média: R$\u00a07.500,00",
    "Cidade: São José dos Campos, SP",
    "Conta com solar (estimativa): R$\u00a01.516,00/mês",
    "Economia estimada: R$\u00a05.984,00/mês",
    "Premissas: redução de 80% na parcela de energia; tarifa R$\u00a01,00/kWh; iluminação R$\u00a020,00; disponibilidade 50 kWh.",
    "",
    "Gostaria de receber uma análise e um orçamento para energia solar.",
  ].join("\n");
  const resultLink = result.getByRole("link", { name: "Receber simulação pelo WhatsApp" });
  await expect(resultLink).toHaveAttribute("href", `https://wa.me/5511912491955?text=${encodeURIComponent(expectedMessage)}`);
  await expect(resultLink).toHaveAttribute("target", "_blank");
  await expect(resultLink).toHaveAttribute("rel", "noopener noreferrer");
  results.push("Business simulation accepts R$ 7,500 and encodes the exact trimmed WhatsApp message.");

  await bill.fill("8500");
  await expect(result).toHaveCount(0);
  await submit.click();
  await expect(result).toBeVisible();
  await page.locator(".calculator-property-option").filter({ hasText: "Residência" }).click();
  await expect(result).toHaveCount(0);
  await submit.click();
  await expect(result).toBeVisible();
  await city.fill("Santo André, SP");
  await expect(result).toHaveCount(0);
  await bill.fill("650");
  await submit.click();
  await expect(result).toBeVisible();
  const slider = page.getByRole("slider", { name: "Ajustar conta média mensal" });
  await slider.focus();
  await slider.press("ArrowRight");
  await expect(bill).toHaveValue("660");
  await expect(result).toHaveCount(0);
  results.push("Editing amount, property type, city or keyboard slider clears outdated results.");

  await bill.fill("1290");
  await submit.click();
  await expect(page.getByTestId("solar-bill")).toHaveText("R$\u00a0274,00");
  await expect(page.getByTestId("monthly-savings")).toHaveText("R$\u00a01.016,00");
  await expect(result).toContainText("R$\u00a012.192,00");
  await page.locator(".calculator-assumptions").first().locator("summary").click();
  await bill.fill("200");
  await page.locator("#solar-connection").selectOption("100");
  await submit.click();
  await expect(page.getByTestId("solar-bill")).toHaveText("R$\u00a0120,00");
  await page.locator("#solar-tariff").fill("1.20");
  await expect(result).toHaveCount(0);
  await submit.click();
  await expect(page.getByTestId("solar-bill")).toHaveText("R$\u00a0140,00");
  await bill.fill("20");
  await submit.click();
  await expect(page.getByTestId("monthly-savings")).toHaveText("R$\u00a00,00");
  await expect(result).toContainText("não há economia estimada");
  await page.locator("#solar-lighting").fill("21");
  await submit.click();
  await expect(result).toHaveCount(0);
  results.push("Numeric estimates, annual totals, connection minimum, tariff edits, zero savings and invalid lighting pass.");
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const phone = await prepare(mobile);
  await phone.locator("#monthly-bill").fill("6500");
  await phone.locator(".calculator-property-option").filter({ hasText: "Empresa" }).tap();
  await phone.locator("#property-city").fill("São Paulo, SP");
  await phone.getByRole("button", { name: "Calcular potencial" }).tap();
  await expect(phone.locator(".calculator-result")).toBeVisible();
  await expect(phone.locator(".calculator-whatsapp")).toBeVisible();
  for (const selector of ["#simule", ".solar-calculator", ".calculator-property-options", ".calculator-result", ".calculator-whatsapp"]) {
    const box = await phone.locator(selector).boundingBox();
    assert.ok(box && box.x >= -1 && box.x + box.width <= 391, `${selector} exceeds the mobile viewport: ${JSON.stringify(box)}`);
  }
  results.push("390px touch viewport: simulation, WhatsApp CTA and result widths pass.");
  await mobile.close();

  assert.deepEqual(pageErrors, [], "Browser emitted uncaught errors");
  console.log(JSON.stringify({ status: "passed", checks: results, pageErrors }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ status: "failed", completedChecks: results, pageErrors }, null, 2));
  throw error;
} finally {
  await browser.close();
}
