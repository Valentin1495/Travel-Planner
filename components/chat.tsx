'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', parts: [{ text: input }] };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: [...messages, newMessage], // ✅ 이전 대화 히스토리 전달
        message: input,
      }),
    });

    const data = await response.json();
    setMessages((prev) => [
      ...prev,
      { role: 'model', parts: [{ text: data.message }] },
    ]); // AI 응답 추가
    setIsLoading(false);
  };

  return (
    <div className='max-w-lg mx-auto p-4'>
      <h2 className='text-xl font-bold mb-4'>Chat with Gemini</h2>
      <div className='border p-4 h-[400px] overflow-y-auto'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-md ${
              msg.role === 'user' ? 'bg-blue-200 self-end' : 'bg-gray-200'
            }`}
          >
            {msg.parts.map((part, partIndex) => (
              <p key={partIndex}>{part.text}</p>
            ))}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className='flex mt-4'>
        <input
          type='text'
          placeholder='Type a message...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='border p-2 flex-1'
        />
        <button
          type='submit'
          disabled={isLoading}
          className='ml-2 bg-blue-500 text-white p-2'
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
