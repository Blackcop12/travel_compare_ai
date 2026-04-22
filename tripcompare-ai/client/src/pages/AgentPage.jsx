import { useState } from "react";
import api from "../services/api";
import AgentResultCards from "../components/AgentResultCards";

const starterPrompts = [
  "Find cheap hotels in Pune under 1000",
  "Plan trip from Mumbai to Pune",
  "Best places to visit in Goa",
  "Suggest food in Delhi",
];

const AgentPage = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "I am TripCompare AI. Ask me about hotels, travel cost, food, or places.",
      payload: null,
    },
  ]);

  const runQuery = async (question) => {
    if (!question.trim()) {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text: question, payload: null }]);
    setLoading(true);

    try {
      const { data } = await api.post("/agent", { query: question });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.message,
          payload: data,
        },
      ]);
    } catch (_error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I could not process that request. Please try again with location details.",
          payload: null,
        },
      ]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await runQuery(query);
  };

  return (
    <main className="mx-auto flex h-[calc(100vh-78px)] w-full max-w-7xl gap-4 px-3 py-4 sm:px-5 lg:gap-6 lg:px-8">
      <aside className="hidden w-72 shrink-0 rounded-3xl border border-sky-200 bg-white/80 p-4 lg:block">
        <h2 className="font-display text-2xl text-slate-700">TripCompare AI</h2>
        <p className="mt-2 text-sm text-slate-600">Smart planning agent for hotels, travel, food, and local attractions.</p>

        <div className="mt-5 space-y-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => runQuery(prompt)}
              className="w-full rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-left text-sm text-slate-700 transition hover:border-blue-400"
            >
              {prompt}
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col rounded-3xl border border-sky-200 bg-white/85 shadow-soft">
        <div className="border-b border-sky-200 px-4 py-3 sm:px-6">
          <h1 className="font-display text-2xl text-slate-700 sm:text-3xl">AI Travel Agent</h1>
          <p className="text-xs text-slate-500 sm:text-sm">ChatGPT-style planner with structured travel outputs.</p>
        </div>

        <div className="scroll-pane flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-6">
          {messages.map((message, idx) => (
            <article
              key={`${message.role}-${idx}`}
              className={`fade-pop max-w-4xl rounded-2xl p-4 ${
                message.role === "user"
                  ? "ml-auto bg-blue-100 text-slate-700 ring-1 ring-blue-300"
                  : "mr-auto bg-sky-50 text-slate-700 ring-1 ring-sky-200"
              }`}
            >
              <p className="text-sm leading-6">{message.text}</p>

              {message.payload ? (
                <div className="mt-2 text-xs text-slate-500">
                  Intent: <span className="font-semibold uppercase text-blue-600">{message.payload.intent}</span>
                </div>
              ) : null}

              {message.payload ? <AgentResultCards payload={message.payload} /> : null}
            </article>
          ))}

          {loading ? <p className="animate-pulse text-sm text-slate-500">TripCompare AI is thinking...</p> : null}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-sky-200 p-3 sm:p-4">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ask: plan trip from Mumbai to Pune"
              className="w-full rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none ring-blue-200 transition focus:ring"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600 disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AgentPage;
