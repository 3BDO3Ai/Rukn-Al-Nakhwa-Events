import React from 'react';
import Image from 'next/image';
import { PHONE_HREF, WHATSAPP_MESSAGES, buildWhatsAppHref } from '@/lib/contact';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  logoUrl: string;
  logoAlt: string;
  items: string[];
}

const services: Service[] = [
  {
    id: 'balady',
    title: 'خدمات البلدية',
    subtitle: 'إنجاز معاملات البلدية بكل سهولة',
    description:
      'نوفر جميع خدمات البلديات إلكترونياً وحضورياً لإنجاز معاملاتك بسرعة واحترافية وبأعلى مستوى من الدقة. نتولى تسهيل جميع طلبات التراخيص البلدية من استخراج وتجديد ونقل ملكية مع متابعة المعاملة حتى إصدارها.',
    logoUrl: '/Services/balady.png',
    logoAlt: 'منصة بلدي',
    items: [
      'إصدار رخصة بلدية تجارية',
      'تجديد رخصة بلدية تجارية',
      'تعديل رخصة بلدية تجارية',
      'نقل ملكية رخصة البلدية التجارية',
      'إلغاء أو إيقاف رخصة بلدية تجارية',
    ],
  },
  { 
    id: 'najiz-real-estate',
    title: 'البورصة العقارية والسجل العقاري',
    subtitle: 'معاملات قانونية وعقارية إلكترونية بدقة وسرعة',
    description:
      'ننفذ خدمات ناجز والمعاملات العقارية المرتبطة بالصكوك والإفراغات والتسجيل العيني مع متابعة متخصصة تضمن اكتمال الإجراءات وفق المتطلبات النظامية.',
    logoUrl: '/Services/rer.png',
    logoAlt: 'خدمات ناجز والعقارات',
    items: [
      'تحديث الصكوك من ورقي الى الكتروني',
      'التسجيل العيني للعقار',
      'تجديد وانهاء عقود الايجار',
      'تسجيل عيني',
      'تسوية دفعات الايجار',
      'دمج الصكوك - فرز الصكوك',
      'التعاقد مع المكاتب الهندسية',
      'تقرير مساحي',
      'ضريبة التصرفات العقارية',
      'الافراغ العقاري',
    ],
  },
    {
    id: 'madinaty-balady-plus',
    title: 'منصة مدينتي والرخص الفنية',
    subtitle: 'إصدار وتجديد الرخص البلدية والعقود الفنية',
    description:
      'نقدم خدمات منصة مدينتي والخدمات البلدية المرتبطة بالتشغيل الفني للمنشآت، مع تجهيز الطلبات، الرفع الإلكتروني، ومتابعة الاعتمادات حتى الإصدار النهائي.',
    logoUrl: '/Services/madinaty.png',
    logoAlt: 'منصة مدينتي والرخص البلدية',
    items: [
      'منصة مدينتي',
      'إصدار عقود نظافة',
      'إصدار شهادات السلامة',
      'تقارير فنية فورية وغير فورية',
    ],
  },
    {
    id: 'insurance',
    title: 'خدمات التأمين',
    subtitle: 'حلول تأمينية شاملة للأفراد والشركات',
    description:
      'نقدم مجموعة متنوعة من خدمات التأمين التي تضمن لك راحة البال وسهولة في الإجراءات. نوفر حلول تأمينية شاملة للأفراد والشركات تشمل التأمين الطبي وتأمين المركبات وخدمات الإقامة.',
    logoUrl: '/Services/a-guarantee.png',
    logoAlt: 'خدمات التأمين',
    items: [
      'تأمين طبي للأفراد والشركات',
      'تأمين إصدار إقامة',
      'فحص طبي لإصدار الإقامة',
      'تأمين المركبات',
      'تأمين نقل ملكية المركبات',
      'رفع مطالبات شركات التامين'
    ],
  }, 
  {
    id: 'najiz',
    title: 'خدمات ناجز',
    subtitle: 'جميع الخدمات القضائية والعدلية',
    description:
      'نقدم لك جميع خدمات ناجز الإلكترونية بكل سهولة وسرعة مع متابعة دقيقة حتى إتمام الطلب. نوفر لك الدعم الكامل لإنجاز معاملاتك القضائية والعدلية إلكترونياً باحترافية عالية.',
    logoUrl: '/Services/najiz.png',
    logoAlt: 'منصة ناجز',
    items: [
      'رفع الدعاوى القضائية',
      'رفع تنفيذ الأحكام القضائية',
      'توثيق صك الحضانة',
      'توثيق صك الطلاق',
      'توثيق عقد الزواج',
      'اصدار الوكالات للأفراد والشركات',
      'حصر الارث',
      'صك ولاية'
    ],
  },
  {
    id: 'hrsd',
    title: 'خدمات وزارة الموارد البشرية (مكتب العمل)',
    subtitle: 'كافة معاملات مكتب العمل بيسر وسرعة',
    description:
      'نقدم جميع خدمات مكتب العمل للأفراد والشركات بطريقة سهلة وسريعة مع ضمان دقة تنفيذ كافة الإجراءات الرسمية. نوفر حلول متكاملة لتسهيل جميع معاملات وزارة الموارد البشرية.',
    logoUrl: '/Services/human resources and social development.png',
    logoAlt: 'وزارة الموارد البشرية',
    items: [
      'نقل الكفالة للعمالة',
      'رفع طلبات تسوية مخالفات المنشآت',
      'رفع دعاوى التسوية الودية بين العامل وصاحب العمل',
      'اصدار رخصة مهنية لبيع الذهب',
      'نقل كفالة برقم الحدود'
    ],
  },
  {
    id: 'mudad',
    title: 'خدمات منصة مدد',
    subtitle: 'إدارة الرواتب وحماية الأجور باحترافية',
    description:
      'نقدم جميع خدمات منصة مدد التي تساهم في تعزيز الشفافية وحماية حقوق العاملين وأصحاب الأعمال بكل سهولة وموثوقية. ننجز معاملاتك المالية والإدارية المتعلقة بالرواتب بمرونة عالية.',
    logoUrl: '/Services/mudad.png',
    logoAlt: 'منصة مدد',
    items: [
      'إزالة ملاحظة حماية الأجور وإعادة نسبة الالتزام إلى 100%',
      'تحويل ورفع المسيرات للموظفين شهرياً',
      'إضافة الموظفين وتعديل بياناتهم',
      'إدارة محافظ الراتب الإلكترونية',
      'ضمان الامتثال لنظام حماية الأجور',
    ],
  },
  {
    id: 'gosi',
    title: 'التأمينات الاجتماعية (GOSI)',
    subtitle: 'تسهيل إجراءات التأمينات الاجتماعية',
    description:
      'نوفر لك خدمات التأمينات الاجتماعية التي تساعد أصحاب الأعمال والموظفين على تسهيل جميع الإجراءات بكل احترافية ودقة عالية. نضمن إنجاز معاملاتك بسهولة.',
    logoUrl: '/Services/gosi.png',
    logoAlt: 'التأمينات الاجتماعية GOSI',
    items: [
      'اضافة مشترك سعودي',
      'تعديل أجور الموظفين',
      'التقديم على دعم ساند الحكومي',
      'التقديم على دعم الورثة',
      'التقديم على الراتب التقاعدي',
      'اصدارات الشهادات'
    ],
  },
  {
    id: 'car-transfer',
    title: 'خدمات نقل ملكية السيارات',
    subtitle: 'إجراءات نقل الملكية بسرعة وأمان',
    description:
      'نقدم لك خدمات نقل ملكية السيارات بطريقة سهلة وسريعة مع ضمان إنجاز جميع الإجراءات الرسمية في أقصر وقت ممكن. فريقنا المتخصص يتولى كافة الخطوات من بداية المعاملة حتى استلام الأوراق النهائية.',
    logoUrl: '/Services/Public Security.png',
    logoAlt: 'نقل ملكية السيارات',
    items: [
      'نقل فوري للمركبات',
      'اضافة مستخدم',
      'حذف مستخدم',
    ],
  },
  {
    id: 'gov-e-services',
    title: 'الخدمات الحكومية الإلكترونية',
    subtitle: 'تنفيذ معاملاتك عبر المنصات الرسمية بسرعة وموثوقية',
    description:
      'نوفر باقة شاملة من الخدمات الحكومية الإلكترونية للأفراد والمنشآت عبر أبرز المنصات الرسمية، مع متابعة دقيقة من تقديم الطلب حتى اكتماله بما يضمن دقة البيانات وسرعة الإنجاز.',
    logoUrl: '/Services/absher.png',
    logoAlt: 'الخدمات الحكومية الإلكترونية',
    items: [
      'أبشر: تفعيل وإصدار، نقل خدمات، تفويضات، تحديث معلومات، تقارير',
    ],
  },
  {
    id: 'business-establishment',
    title: 'خدمات الأعمال وتأسيس المنشآت',
    subtitle: 'حلول متكاملة لتأسيس وتشغيل الأعمال إلكترونياً',
    description:
      'نساعدك في بدء نشاطك التجاري وإدارته نظامياً عبر خدمات تأسيس الشركات، السجلات، التوثيق، والملفات الحكومية المرتبطة بالمنشآت ضمن رحلة تشغيل واضحة وسلسة.',
    logoUrl: '/Services/Ministry-of-Commerce.png',
    logoAlt: 'تأسيس المنشآت وخدمات وزارة التجارة',
    items: [
      'تأسيس المنشآت: حجز الاسماء التجارية، السجل، الملف الضريبي والتأمينات، العنوان الوطني',
      'اضافة واستبعاد الشركاء',
      'اصدار QR',
      'التاكيد السنوي للسجلات',
      'الافصاح عن المستفيد الفعلي',
      'اصدار مستخرج سجل والافادة التجارية'
    ],
  },
 

  {
    id: 'utilities-insurance-support',
    title: 'الكهرباء والمياه',
    subtitle: 'حلول تشغيلية متكاملة للأفراد والمنشآت',
    description:
      'نوفر خدمات العدادات والتأمين والخدمات المساندة عبر الجهات المختصة مع تنسيق كامل للطلبات، تحديث البيانات، وتسريع الموافقات بما يخدم احتياجاتك التشغيلية.',
    logoUrl: '/Services/water_electricity.png',
    logoAlt: 'خدمات الكهرباء والمياه والخدمات المساندة',
    items: [
      'شركة الكهرباء والمياه: توثيق العدادات، طلب عداد إضافي، إدخال العدادات، طلبات التقسيط',
      'عداد كهرباء: إصدار أو تركيب، نقل ملكية، ترقية القدرة، تسوية الرسوم',
      'عداد مياه: إصدار أو تركيب، نقل ملكية، تعديل بيانات، سداد الفواتير',
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white w-full py-20 lg:py-28 px-6 font-cairo">
      <div className="max-w-[1290px] mx-auto" dir="ltr">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-gold font-bold text-sm tracking-widest uppercase bg-gold/10 px-3 py-1 rounded-full">
            خدماتنا
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-darkGreen mt-4 mb-3">
            خدماتنا الإلكترونية للأفراد والمنشآت في المملكة
          </h2>
          <div className="w-16 h-1 bg-gold rounded-full mx-auto mt-4 mb-6" />
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            باقة متكاملة من الخدمات الحكومية والتجارية عبر المنصات الرسمية مع متابعة احترافية حتى اكتمال الطلب
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden group"
            >
              {/* Card Header */}
              <div className="bg-darkGreen/5 px-7 pt-8 pb-6 border-b border-gray-100 group-hover:bg-darkGreen/10 transition-colors">
                <div className="flex flex-col items-center text-center gap-5">
                  <div className="w-28 h-28 bg-white rounded-[24px] shadow-sm flex items-center justify-center flex-shrink-0 p-0 border border-white/80 overflow-hidden">
                    <Image
                      src={service.logoUrl}
                      alt={service.logoAlt}
                      width={88}
                      height={88}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-black text-darkGreen text-lg leading-tight">{service.title}</h3>
                    <p className="text-teal text-sm font-medium mt-0.5">{service.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-7 py-6 flex flex-col flex-1">
                <p className="text-gray-600 text-sm leading-relaxed mb-5 text-right">{service.description}</p>

                {/* Items List */}
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {service.items.map((item, i) => (
                    <li key={i} className="flex flex-row-reverse items-start gap-3 text-right">
                      <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-1.5" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Buttons */}
                <div className="flex gap-3 flex-wrap">
                  <a
                    href={PHONE_HREF}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-darkGreen hover:bg-darkGreen/90 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    اتصل بنا
                  </a>
                  <a
                    href={buildWhatsAppHref(WHATSAPP_MESSAGES.service(service.title))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.113 1.522 5.851L0 24l6.293-1.489A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.955 0-3.783-.553-5.333-1.508L3.5 21.5l1.008-3.167A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                    واتساب
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
