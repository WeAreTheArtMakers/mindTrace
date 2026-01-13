// Translation service abstraction
// Supports: OpenAI, LibreTranslate, or Google Translate (free scraping method)

const LANG_CODES: Record<string, string> = {
  tr: 'tr',
  fr: 'fr',
  it: 'it',
  de: 'de',
  ar: 'ar',
  hi: 'hi',
};

const LANG_NAMES: Record<string, string> = {
  tr: 'Turkish',
  fr: 'French',
  it: 'Italian',
  de: 'German',
  ar: 'Arabic',
  hi: 'Hindi',
};

interface TranslationResult {
  problem: string;
  steps: string[];
  tags: string[];
}

// Free Google Translate (unofficial API - no key needed)
async function translateWithGoogleFree(text: string, targetLang: string): Promise<string> {
  const langCode = LANG_CODES[targetLang] || targetLang;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${langCode}&dt=t&q=${encodeURIComponent(text)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Google Translate error');
    const data = await response.json();
    // Response format: [[["translated text","original text",null,null,10]],null,"en",...]
    let translated = '';
    if (data && data[0]) {
      for (const part of data[0]) {
        if (part[0]) translated += part[0];
      }
    }
    return translated || text;
  } catch {
    return text; // Return original on error
  }
}

// LibreTranslate translation
async function translateWithLibre(text: string, targetLang: string, libreUrl: string): Promise<string> {
  const response = await fetch(`${libreUrl}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: 'auto',
      target: LANG_CODES[targetLang] || targetLang,
    }),
  });
  
  if (!response.ok) throw new Error('LibreTranslate error');
  const data = await response.json();
  return data.translatedText;
}

// OpenAI translation
async function translateWithOpenAI(
  content: { problem: string; steps: string[]; tags: string[] },
  targetLang: string,
  apiKey: string
): Promise<TranslationResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a translator. Translate the following JSON content to ${LANG_NAMES[targetLang] || targetLang}. Keep the JSON structure exactly the same. Only translate the text values, not the keys. Return valid JSON only, no markdown.`
        },
        {
          role: 'user',
          content: JSON.stringify(content)
        }
      ],
      temperature: 0.3,
    }),
  });
  
  if (!response.ok) throw new Error('OpenAI API error');
  const data = await response.json();
  const result = data.choices[0]?.message?.content;
  if (!result) throw new Error('No translation returned');
  return JSON.parse(result);
}

// Translate using free Google Translate
async function translateContentWithGoogle(
  content: { problem: string; steps: string[]; tags: string[] },
  targetLang: string
): Promise<TranslationResult> {
  const [problem, ...rest] = await Promise.all([
    translateWithGoogleFree(content.problem, targetLang),
    ...content.steps.map(s => translateWithGoogleFree(s, targetLang)),
    ...content.tags.map(t => translateWithGoogleFree(t, targetLang)),
  ]);
  
  const steps = rest.slice(0, content.steps.length);
  const tags = rest.slice(content.steps.length);
  
  return { problem, steps, tags };
}

export async function translateTrace(
  content: { problem: string; steps: string[]; tags: string[] },
  targetLang: string
): Promise<{ result: TranslationResult | null; available: boolean; provider: string }> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const libreUrl = process.env.LIBRETRANSLATE_URL;
  const useGoogleFree = process.env.USE_GOOGLE_TRANSLATE !== 'false'; // Default: true
  
  // Try OpenAI first (best quality)
  if (openaiKey) {
    try {
      const result = await translateWithOpenAI(content, targetLang, openaiKey);
      return { result, available: true, provider: 'openai' };
    } catch (error) {
      console.error('OpenAI translation failed:', error);
    }
  }
  
  // Try LibreTranslate
  if (libreUrl) {
    try {
      const [problem, ...rest] = await Promise.all([
        translateWithLibre(content.problem, targetLang, libreUrl),
        ...content.steps.map(s => translateWithLibre(s, targetLang, libreUrl)),
        ...content.tags.map(t => translateWithLibre(t, targetLang, libreUrl)),
      ]);
      
      const steps = rest.slice(0, content.steps.length);
      const tags = rest.slice(content.steps.length);
      
      return { result: { problem, steps, tags }, available: true, provider: 'libretranslate' };
    } catch (error) {
      console.error('LibreTranslate failed:', error);
    }
  }
  
  // Try free Google Translate (default fallback)
  if (useGoogleFree) {
    try {
      const result = await translateContentWithGoogle(content, targetLang);
      return { result, available: true, provider: 'google-free' };
    } catch (error) {
      console.error('Google Translate failed:', error);
    }
  }
  
  return { result: null, available: false, provider: 'none' };
}

export async function translateBatch(
  items: { id: string; problem: string; tags: string[] }[],
  targetLang: string
): Promise<{ translations: Record<string, { problem: string; tags: string[] }>; available: boolean }> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const libreUrl = process.env.LIBRETRANSLATE_URL;
  const useGoogleFree = process.env.USE_GOOGLE_TRANSLATE !== 'false';
  
  const translations: Record<string, { problem: string; tags: string[] }> = {};
  
  // Try OpenAI batch (most efficient)
  if (openaiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Translate the following JSON array to ${LANG_NAMES[targetLang]}. Keep structure, translate only "problem" and "tags" values. Return valid JSON array only.`
            },
            { role: 'user', content: JSON.stringify(items) }
          ],
          temperature: 0.3,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const translated = JSON.parse(data.choices[0]?.message?.content || '[]');
        translated.forEach((item: { id: string; problem: string; tags: string[] }) => {
          translations[item.id] = { problem: item.problem, tags: item.tags };
        });
        return { translations, available: true };
      }
    } catch (error) {
      console.error('OpenAI batch translation failed:', error);
    }
  }
  
  // Try LibreTranslate or Google Free (one by one)
  const translateFn = libreUrl 
    ? (text: string) => translateWithLibre(text, targetLang, libreUrl)
    : useGoogleFree 
      ? (text: string) => translateWithGoogleFree(text, targetLang)
      : null;
  
  if (translateFn) {
    try {
      for (const item of items) {
        const problem = await translateFn(item.problem);
        const tags = await Promise.all(item.tags.map(t => translateFn(t)));
        translations[item.id] = { problem, tags };
      }
      return { translations, available: true };
    } catch (error) {
      console.error('Batch translation failed:', error);
    }
  }
  
  return { translations, available: false };
}
