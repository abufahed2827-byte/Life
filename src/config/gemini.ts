const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface GeminiMessage {
  role: 'user' | 'model';
  text: string;
}

export async function generateGeminiResponse(
  prompt: string,
  context?: string,
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return generateLocalResponse(prompt);
  }

  try {
    const systemContext = context
      ? `أنت مساعد ذكي في تطبيق Life OS لنظام حياتي. سياق إضافي: ${context}\n\nالسؤال: ${prompt}\n\nأجب باللغة العربية بشكل مختصر ومفيد.`
      : `أنت مساعد ذكي في تطبيق Life OS. أجب باللغة العربية بشكل مختصر ومفيد.\n\nالسؤال: ${prompt}`;

    const res = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemContext }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    });

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || generateLocalResponse(prompt);
  } catch {
    return generateLocalResponse(prompt);
  }
}

function generateLocalResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('مهام') || lower.includes('اقترح') || lower.includes('يوم')) {
    return 'بناءً على طاقتك اليوم (78%) وجدولك، أقترح:\n• مراجعة محاضرة القلب (عالية — الصباح)\n• حل واجب الكيمياء (عالية — قبل الظهر)\n• 30 دقيقة رياضة (مساءً)\n• قراءة فصل النفسية (مساءً قبل النوم)\n\nابدأ بالمهام عالية الأولوية بينما طاقتك في ذروتها!';
  }
  if (lower.includes('جدول') || lower.includes('نظم')) {
    return 'إليك جدول مقترح لليوم:\n\n🌅 7:00 — الاستيقاظ وروتين الصباح\n📚 8:00 — مراجعة محاضرة القلب\n📝 10:00 — حل واجب الكيمياء\n🍽️ 12:30 — الغداء وراحة\n🏃 16:00 — تمارين رياضية\n📖 20:00 — قراءة فصل النفسية\n😴 22:30 — النوم';
  }
  if (lower.includes('صح') || lower.includes('تحليل')) {
    return 'تحليل صحي سريع:\n\n💧 شرب الماء: 1.2 لتر — يحتاج زيادة (الهدف 2 لتر)\n😴 النوم: 7.5 ساعة — جيد\n🏃 النشاط: 3 أيام هذا الأسبوع — فوق المتوسط\n🧘 المزاج: جيد — استمر على التأمل اليومي';
  }
  if (lower.includes('راح') || lower.includes('تعب') || lower.includes('إرهاق')) {
    return 'بناءً على مستوى تعافيك (65%)، أقترح:\n\n🫁 تمرين تنفس 4-7-8 (3 دقائق)\n🚶 مشي خفيف 15 دقيقة\n📵 فترة راحة من الهاتف (30 دقيقة)\n🎵 استماع لموسيقى هادئة';
  }
  if (lower.includes('أناقة') || lower.includes('ملابس') || lower.includes('تنسيق')) {
    return 'للحصول على أفضل تنسيق:\n\n👔 اختر ألواناً متكاملة من خزانتك\n✨ استخدم القطع النظيفة والمكوية فقط\n🌤️ راقب حالة الطقس قبل الاختيار\n🎨 درجة تناسق الألوان يجب أن تكون فوق 75%';
  }
  return 'فهمت! دعني أساعدك في ذلك. يمكنك طلب اقتراح مهام، تنظيم جدولك، تحليل صحتك، أو نصائح للراحة والأناقة.';
}

export { GEMINI_API_KEY };
