"use client";

import { useState } from "react";

export default function Home() {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("File stored at:", result.filePath);
        // Assuming we do something with the file here
      } else {
        console.error("File upload failed");
      }
    }
  };

  const handlePromptSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const result = await response.json();
        setResponse(result.answer);
      } else {
        console.error("Failed to get a response from GPT-4");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-beige">
      <header className="w-full py-6 bg-gray-800 text-white text-center text-3xl font-bold shadow-lg">
        Personal CRM
      </header>

      <section className="w-full max-w-2xl mt-8 bg-white shadow-lg rounded-lg p-8">
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium text-gray-700">
            Upload CSV:
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium text-gray-700">
            Enter Prompt:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here..."
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          onClick={handlePromptSubmit}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit"}
        </button>

        {response && (
          <div className="mt-8 p-4 bg-gray-100 border border-gray-300 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700">Response:</h3>
            <p>{response}</p>
          </div>
        )}
      </section>
    </main>
  );
}
