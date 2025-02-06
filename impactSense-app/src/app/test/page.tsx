'use client';

import { useState } from 'react';
import { ChatPromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from '@langchain/openai';

const ChatComponent = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateResponse = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse('');
    
    try {
      const systemMessage = SystemMessagePromptTemplate.fromTemplate("You are a helpful assistant. Answer the following prompt: {prompt}");

      const chatPrompt = ChatPromptTemplate.fromMessages([
        systemMessage,
      ]);

      const formattedMessages = await chatPrompt.formatMessages({ prompt });
      const openai = new ChatOpenAI({ openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, temperature: 0.7 });

      const result = await openai.invoke(formattedMessages);
      console.log({ result });

      setResponse(result.text);
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('Failed to generate response.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex flex-col items-center space-y-4 p-6">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        className="border p-2 rounded w-full max-w-md"
      />
      <button
        onClick={handleGenerateResponse}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Generating...' : 'Get Response'}
      </button>
      {response && (
        <div className="border p-4 rounded w-full max-w-md bg-gray-100">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
