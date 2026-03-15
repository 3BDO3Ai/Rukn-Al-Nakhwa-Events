import React from 'react';

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'السرعة في الإنجاز',
    desc: 'إنجاز المعاملات بعمليات مُحسّنة وإجراءات واضحة لتوفير الوقت وتقليل الانتظار إلى الحد الأدنى.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'أسعار تنافسية وواضحة',
    desc: 'سعر واضح ومناسب مع خيارات باقات لتلبية احتياجات الأفراد والشركات دون أي رسوم مخفية غير متوقعة.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'خبرة واسعة مع الجهات الحكومية',
    desc: 'فريق متمرّس يفهم متطلبات الجهات الحكومية ومتطلباتها، يُسهّل التواصل الرسمي لتسريع إنجاز الإجراءات.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'خدمة عملاء متميزة',
    desc: 'دعم متواصل على مدار الساعة للرد على استفساراتكم ومساعدتكم في كل خطوة بخدمة سريعة وفعّالة تليق بكم.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-light-section w-full py-20 lg:py-28 px-6 font-cairo">
      <div className="max-w-[1290px] mx-auto" dir="ltr">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold font-bold text-sm tracking-widest uppercase bg-gold/10 px-3 py-1 rounded-full">
            مميزاتنا
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-darkGreen mt-4 mb-3">لماذا تختارنا؟</h2>
          <div className="w-16 h-1 bg-gold rounded-full mx-auto mt-4 mb-6" />
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            حلول سريعة وموثوقة لإتمام معاملاتك مع الجهات العامة بكل سهولة ويسر
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 group text-right"
            >
              <div className="w-14 h-14 bg-darkGreen/10 rounded-2xl flex items-center justify-center text-darkGreen mb-5 group-hover:bg-darkGreen group-hover:text-white transition-all duration-300">
                {f.icon}
              </div>
              <h3 className="font-black text-darkGreen text-lg mb-3">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
