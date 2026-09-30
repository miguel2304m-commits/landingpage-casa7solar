export const WHATSAPP_NUMBER = "5511912491955";

export const DEFAULT_MESSAGE =
  "Olá! Vim pelo site da Casa 7 Solar Energy e gostaria de solicitar um orçamento para energia solar.";

export function whatsappUrl(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
