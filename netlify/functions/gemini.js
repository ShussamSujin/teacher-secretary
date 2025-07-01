// netlify/functions/gemini.js (오류 수정 버전)
exports.handler = async function (event) {
  // POST 요청만 허용
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Netlify에 숨겨둔 API 키 가져오기
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error('서버에 GEMINI_API_KEY가 설정되지 않았습니다.');
    }

    // 클라이언트에서 보낸 데이터
    const body = JSON.parse(event.body);

    // Google AI API에 요청 보내기 (네이티브 fetch 사용)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Google API 요청이 실패한 경우
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google AI API Error:', errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Google AI API 요청 실패: ${response.statusText}` }),
      };
    }

    // Google API로부터 받은 데이터
    const data = await response.json();

    // 성공적인 응답을 클라이언트에 다시 보내기
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    // 그 외 다른 모든 오류 처리
    console.error('서버 측 오류:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
