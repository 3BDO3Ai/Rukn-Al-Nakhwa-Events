export const CONTACT_NUMBER_DISPLAY = '+966 55 659 0007';
export const CONTACT_NUMBER_LINK = '966556590007';
export const CONTACT_EMAIL = 'info@rukn-alnakhwa.com';

export const PHONE_HREF = `tel:${CONTACT_NUMBER_LINK}`;

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/ruknalnakhwa556590007?igsh=bmxwN3RxcjR1dTM4',
  x: 'https://x.com/ab123ma?t=p0OZB1GA2NNFkfzebfikEA&s=09',
  tiktok: 'https://www.tiktok.com/@rukn_alnakw?_r=1&_t=ZS-95EfUgTg8FF',
  whatsapp: `https://wa.me/${CONTACT_NUMBER_LINK}`,
};

export function buildWhatsAppHref(message: string) {
  return `https://wa.me/${CONTACT_NUMBER_LINK}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_MESSAGES = {
  hero: 'السلام عليكم، أرغب في حجز مناسبة لدى مؤسسة ركن النخوة للحفلات.',
  footer: 'السلام عليكم، أرغب في التواصل مع مؤسسة ركن النخوة للحفلات.',
  service: (serviceTitle: string) =>
    `السلام عليكم، مهتم بـ ${serviceTitle}. يرجى تزويدي بالتفاصيل وخطوات الحجز.`,
};