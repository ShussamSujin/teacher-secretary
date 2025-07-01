exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body);
    const geminiApiKey = process.env.GEMINI_API_KEY; // Netlify에 숨겨둔 API 키 가져오기

    if (!geminiApiKey) {
      throw new Error('서버에 API 키가 설정되지 않았습니다.');
    }

    const fetch = (await import('node-fetch')).default;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: 'Gemini API 요청 실패' }) };
    }

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
