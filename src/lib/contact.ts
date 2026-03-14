export const CONTACT_NUMBER_DISPLAY = '+966 56 299 7035';
export const CONTACT_NUMBER_LINK = '966562997035';

export const PHONE_HREF = `tel:${CONTACT_NUMBER_LINK}`;

export function buildWhatsAppHref(message: string) {
  return `https://wa.me/${CONTACT_NUMBER_LINK}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_MESSAGES = {
  hero: 'السلام عليكم، أرغب في الاستفسار عن خدماتكم الإلكترونية وبدء معاملة جديدة.',
  footer: 'السلام عليكم، أرغب في التواصل مع مكتب المهمات الاحترافية للخدمات الإلكترونية لمعرفة الخدمة المناسبة لي.',
  service: (serviceTitle: string) =>
    `السلام عليكم، أرغب في الاستفسار عن ${serviceTitle} ومعرفة المتطلبات وطريقة البدء.`,
};