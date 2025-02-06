"use client";
import { useState } from "react";

const ChatComponent = () => {
  const [input, setInput] = useState<string>(""); // User input state
  const [response, setResponse] = useState<string | null>(null); // Response state
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const sendPrompt = async () => {
    if (!input.trim()) {
      alert("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response from backend");
      }

      const data = await res.json();
      setResponse(data.output);
    } catch (err) {
      setError("Error occurred while fetching data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Ask OpenAI</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your prompt"
        className="w-96 h-32 p-2 border border-gray-300"
      />
      <button
        onClick={sendPrompt}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Loading..." : "Send Prompt"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {response && (
        <div className="mt-4 p-4 border">
          <h3 className="font-bold">Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
