import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { history, message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat({
      history: history || [], // 이전 대화 히스토리 유지
    });

    // Gemini API 호출 (스트리밍 없이 일반 응답 받기)
    const result = await chat.sendMessage(message);
    const responseText = result.response.text(); // 결과 텍스트 추출

    return NextResponse.json({ message: responseText }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate text', details: error.message },
      { status: 500 }
    );
  }
}
