"use client";

import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import { ArrowDown, ArrowUpRight, Building2, Check, House, Sun, Zap } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";
import { estimateSolarBill } from "@/lib/solar-estimate";
import "./conversion.css";

type PropertyType = "Residencial" | "Empresarial";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function Calculator() {
  const [amount, setAmount] = useState("650");
  const [propertyType, setPropertyType] = useState<PropertyType>("Residencial");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [hasResult, setHasResult] = useState(false);
  const [tariff, setTariff] = useState("1.00");
  const [lighting, setLighting] = useState("20");
  const [connection, setConnection] = useState<30 | 50 | 100>(50);
  const [reduction, setReduction] = useState("80");
  const [estimate, setEstimate] = useState<ReturnType<typeof estimateSolarBill> | null>(null);
  const [estimateError, setEstimateError] = useState("");
  const cityInput = useRef<HTMLInputElement>(null);
  const numericAmount = Number(amount);
  const rangeAmount = Math.min(5000, Math.max(200, numericAmount || 200));
  const sliderStyle = {
    "--range-progress": `${((rangeAmount - 200) / 4800) * 100}%`,
  } as CSSProperties;

  const message = [
    "Olá! Fiz uma simulação no site da Casa 7 Solar Energy.",
    "",
    `Tipo de imóvel: ${propertyType}`,
    `Conta média: ${currency.format(numericAmount)}`,
    `Cidade: ${city.trim()}`,
    ...(hasResult && estimate ? [
      `Conta com solar (estimativa): ${currency.format(estimate.after)}/mês`,
      `Economia estimada: ${currency.format(estimate.monthlySavings)}/mês`,
      `Premissas: redução de ${reduction}% na parcela de energia; tarifa ${currency.format(Number(tariff))}/kWh; iluminação ${currency.format(Number(lighting))}; disponibilidade ${connection} kWh.`,
    ] : []),
    "",
    "Gostaria de receber uma análise e um orçamento para energia solar.",
  ].join("\n");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!city.trim()) {
      setCityError("Informe a cidade do imóvel para continuar.");
      cityInput.current?.focus();
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return;
    setCityError("");
    try {
      setEstimate(estimateSolarBill({ bill: numericAmount, tariff: Number(tariff), lighting: Number(lighting), connection, reduction: Number(reduction) }));
      setEstimateError("");
    } catch (error) {
      setHasResult(false);
      setEstimateError((error as Error).message);
      return;
    }
    setHasResult(true);
  }

  return (
    <section id="simule" className="conversion-section calculator-section" aria-labelledby="calculator-title">
      <div className="conversion-shell calculator-layout">
        <div className="calculator-intro">
          <span className="conversion-eyebrow"><span /> Simule sua economia</span>
          <h2 id="calculator-title">Sua próxima conta pode ser <em>diferente.</em></h2>
          <p>O primeiro passo para produzir sua própria energia começa com uma informação: quanto você paga hoje.</p>
          <div className="calculator-note">
            <span className="calculator-note-icon"><Sun size={23} strokeWidth={1.4} aria-hidden="true" /></span>
            <div><strong>O sol tem potencial. Seu imóvel também.</strong><span>Descubra as possibilidades com uma análise personalizada.</span></div>
          </div>
          <span className="calculator-direction">Seu novo começo está aqui <ArrowDown size={17} aria-hidden="true" /></span>
        </div>

        <form className="solar-calculator" onSubmit={submit} onChange={() => { setHasResult(false); setEstimateError(""); }}>
          <div className="calculator-form-heading"><span>Uma nova perspectiva</span><Zap size={19} aria-hidden="true" /></div>
          <h3>Quanto você paga de luz?</h3>
          <p className="calculator-form-description">Informe sua média mensal.</p>

          <label className="calculator-input-label" htmlFor="monthly-bill">Valor médio da conta</label>
          <div className="calculator-amount-wrap">
            <span aria-hidden="true">R$</span>
            <input id="monthly-bill" name="monthlyBill" aria-label="Valor médio mensal da conta em reais" type="number" inputMode="numeric" min="1" step="1" required value={amount}
              onChange={(event) => { setAmount(event.target.value); setHasResult(false); }} />
            <small>/ mês</small>
          </div>
          <input className="calculator-range" type="range" aria-label="Ajustar conta média mensal" aria-valuetext={currency.format(rangeAmount)} min="200" max="5000" step="10" value={rangeAmount} style={sliderStyle}
            onChange={(event) => { setAmount(event.target.value); setHasResult(false); }} />
          <div className="calculator-range-labels"><span>R$ 200</span><span>R$ 5.000+</span></div>

          <fieldset className="calculator-property"><legend>Tipo de imóvel</legend><div className="calculator-property-options">
            {([{ value: "Residencial", label: "Residência", Icon: House }, { value: "Empresarial", label: "Empresa", Icon: Building2 }] as const).map(({ value, label, Icon }) => (
              <label key={value} className={`calculator-property-option${propertyType === value ? " is-selected" : ""}`}>
                <input type="radio" name="propertyType" value={value} checked={propertyType === value} onChange={() => { setPropertyType(value); setHasResult(false); }} />
                <Icon size={18} strokeWidth={1.5} aria-hidden="true" /><span>{label}</span><span className="calculator-radio-dot" aria-hidden="true" />
              </label>
            ))}
          </div></fieldset>

          <label className="calculator-input-label" htmlFor="property-city">Cidade do imóvel</label>
          <input className="calculator-city" id="property-city" name="city" ref={cityInput} type="text" placeholder="Ex.: São Paulo, SP" autoComplete="address-level2" maxLength={100} required value={city} aria-invalid={Boolean(cityError)} aria-describedby={cityError ? "calculator-city-error" : undefined}
            onChange={(event) => { setCity(event.target.value); setCityError(""); setHasResult(false); }} />
          {cityError && <p className="calculator-error" id="calculator-city-error">{cityError}</p>}

          <details className="calculator-assumptions">
            <summary>Ajustar com os dados da minha conta</summary>
            <p>Valores de referência, sem consulta automática à distribuidora. Use sua fatura para ajustar. Válido para tarifa convencional em baixa tensão.</p>
            <label htmlFor="solar-tariff">Tarifa total com impostos (R$/kWh)</label>
            <input className="calculator-city" id="solar-tariff" type="number" min="0.01" step="0.01" required value={tariff} onChange={event => setTariff(event.target.value)} />
            <label htmlFor="solar-lighting">Iluminação pública (R$/mês)</label>
            <input className="calculator-city" id="solar-lighting" type="number" min="0" max={numericAmount > 0 ? numericAmount : undefined} step="0.01" required value={lighting} onChange={event => setLighting(event.target.value)} />
            <label htmlFor="solar-connection">Ligação elétrica</label>
            <select className="calculator-city" id="solar-connection" value={connection} onChange={event => setConnection(Number(event.target.value) as 30 | 50 | 100)}>
              <option value="30">Monofásica — 30 kWh</option><option value="50">Bifásica — 50 kWh</option><option value="100">Trifásica — 100 kWh</option>
            </select>
            <label htmlFor="solar-reduction">Redução simulada na parcela de energia (%)</label>
            <input className="calculator-city" id="solar-reduction" type="number" min="0" max="95" step="1" required value={reduction} onChange={event => setReduction(event.target.value)} />
            <p>A redução é uma hipótese para um sistema dimensionado ao consumo, já considerando custos residuais de energia e uso da rede. Não é uma taxa garantida.</p>
          </details>
          <button className="conversion-button calculator-submit" type="submit"><span>Calcular potencial</span><ArrowUpRight size={20} aria-hidden="true" /></button>
          {estimateError && <p className="calculator-error" role="alert">{estimateError}</p>}
          <p className="calculator-disclaimer">Veja uma estimativa da sua conta com solar. O valor final depende da fatura e do projeto.</p>

          <div className="calculator-result-region" aria-live="polite" aria-atomic="true">
            {hasResult && estimate && <div className="calculator-result">
              <span className="calculator-result-icon"><Check size={18} aria-hidden="true" /></span>
              <h4>Sua conta estimada com energia solar</h4>
              <div className="calculator-after"><strong data-testid="solar-bill">{currency.format(estimate.after)}</strong><span>/ mês</span></div>
              <dl className="calculator-breakdown">
                <div><dt>Você paga hoje</dt><dd>{currency.format(numericAmount)}/mês</dd></div>
                <div><dt>Economia mensal estimada</dt><dd data-testid="monthly-savings">{currency.format(estimate.monthlySavings)}</dd></div>
                <div><dt>Economia em 12 meses</dt><dd>{currency.format(estimate.annualSavings)}</dd></div>
              </dl>
              <p>{estimate.monthlySavings > 0 ? `Cerca de ${estimate.percentage}% a menos na conta de ${propertyType === "Residencial" ? "sua residência" : "sua empresa"} em ${city.trim()}.` : "Com estas premissas, não há economia estimada. Solicite uma análise da sua fatura."}</p>
              <details className="calculator-assumptions calculator-method">
                <summary>Como chegamos a esse valor</summary>
                <p>Cenário com redução de {reduction}% sobre a conta sem iluminação pública. Mantemos o maior valor entre a parcela restante e o piso de {connection} kWh × {currency.format(Number(tariff))}/kWh, mais {currency.format(Number(lighting))} de iluminação, limitado à conta atual.</p>
                <p>São premissas ajustáveis, não tarifas verificadas para {city.trim()}. A projeção anual mantém consumo e tarifa constantes. Não inclui compra, financiamento ou manutenção do sistema. Tributos, Fio B, geração e perfil de consumo precisam ser conferidos no projeto. Tarifa social, tarifa branca e alta tensão exigem análise individual.</p>
                <a href="https://www.gov.br/aneel/pt-br/assuntos/geracao-distribuida/" target="_blank" rel="noopener noreferrer">Entenda o custo de disponibilidade na ANEEL</a>
              </details>
              <a className="conversion-button calculator-whatsapp" href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer"><span>Receber simulação pelo WhatsApp</span><ArrowUpRight size={19} aria-hidden="true" /></a>
              <small>Suas informações serão incluídas na mensagem. Você revisa e envia pelo WhatsApp.</small>
            </div>}
          </div>
        </form>
      </div>
    </section>
  );
}
