export const CONTACT_NUMBER_DISPLAY = '+971 52 708 8363';
export const CONTACT_NUMBER_LINK = '971527088363';
export const CONTACT_EMAIL = 'grow@kafumedia.com';

export const PHONE_HREF = `tel:${CONTACT_NUMBER_LINK}`;

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/kafumediauae?igsh=MmZheWhkZGhnbDJl',
  facebook: 'https://www.facebook.com/share/18DJfhsAZ7/',
  tiktok: 'https://www.tiktok.com/@kafumediauae?_r=1&_t=ZS-95GNRjHpwKy',
  whatsapp: `https://wa.me/${CONTACT_NUMBER_LINK}`,
};

export function buildWhatsAppHref(message: string) {
  return `https://wa.me/${CONTACT_NUMBER_LINK}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_MESSAGES = {
  hero: 'Hello, I would like to know more about your services and place an order.',
  footer: 'Hello, I would like to contact Kafu Media and get started.',
  service: (serviceTitle: string) =>
    `Hello, I am interested in ${serviceTitle}. Please share requirements and next steps.`,
};