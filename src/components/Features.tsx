import React from 'react';

export default function Features() {
  const featuresList = [
    {
      title: "السرعة والدقة في الأداء",
      description: "نلتزم بتقديم خدماتنا في أسرع وقت ممكن مع الحفاظ على أعلى مستويات الدقة والجودة في العمل لضمان رضاكم التام.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "سرية المعلومات",
      description: "نضمن الحفاظ على سرية وأمان جميع المعلومات والوثائق الخاصة بعملائنا الكرام باستخدام أحدث أنظمة الحماية.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: "المصداقية وإرضاء العملاء",
      description: "رضا عملائنا هو هدفنا الأول، ونحرص على بناء علاقات طويلة الأمد قائمة على الثقة والمصداقية التامة في التعامل.",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-surface w-full py-20 px-6">
      <div className="max-w-[1290px] mx-auto flex flex-col lg:flex-row-reverse gap-16" dir="rtl">
        
        {/* Right Side: Content List */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-12 text-right">
            <h2 className="text-3xl font-black text-darkGreen mb-4">نبذة عنا</h2>
            <div className="w-16 h-1 bg-gold rounded-full"></div>
            <p className="text-gray-600 mt-6 text-lg max-w-xl">
              نحن مؤسسة رائدة متخصصة في تقديم الخدمات بأعلى معايير الجودة، نسعى دائماً لتوفير حلول مبتكرة تسهل أعمالكم.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {featuresList.map((feature, index) => (
              <div key={index} className="flex flex-row-reverse items-start gap-6 group">
                {/* Text Container */}
                <div className="text-right flex-1">
                  <h3 className="font-bold text-darkGreen text-xl mb-2 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 text-[15px] leading-relaxed max-w-md">{feature.description}</p>
                </div>
                {/* Icon */}
                <div className="bg-darkGreen/10 p-4 rounded-full text-darkGreen flex-shrink-0 group-hover:bg-darkGreen group-hover:text-white transition-all shadow-sm">
                  {feature.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left Side: Visual Anchor Block */}
        <div className="flex-1 flex justify-center items-center">
          <div className="bg-darkGreen w-full max-w-[500px] aspect-square rounded-[3rem] p-12 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
            {/* Subtle overlay shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal/20 rounded-tr-[100px]" />
            
            {/* Inner Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
               <div className="w-32 h-32 border-4 border-white/20 rotate-45 mb-10 flex items-center justify-center">
                   <span className="text-white font-black text-3xl -rotate-45">شعار</span>
               </div>
               <h3 className="text-white font-black text-2xl leading-relaxed mb-2">
                 مؤسسة الخدمات المتكاملة
               </h3>
               <p className="text-white/60 text-base italic mt-2">
                 Company slogan in english
               </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
