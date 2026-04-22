import { useEffect, useRef, useState } from "react";
import api from "../services/api";

const quickPrompts = [
  "Suggest a 3-day Goa itinerary",
  "How can I reduce my travel budget?",
  "Best destinations to visit this month",
];

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I am your TripCompare AI assistant. Ask me anything about travel plans, budgets, hotels, or routes.",
    },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  const sendMessage = async (inputText) => {
    const trimmed = (inputText || "").trim();
    if (!trimmed || loading) {
      return;
    }

    const userMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setText("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat", {
        messages: nextMessages,
      });

      const assistantMessage = {
        role: "assistant",
        content: data?.reply || "I could not answer right now. Please try again.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (_error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I am unable to reach AI service right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[90]">
      {isOpen ? (
        <div className="fade-pop mb-3 flex h-[480px] w-[360px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-3xl border border-emerald-300/35 bg-[#07100d]/95 shadow-[0_24px_70px_-36px_rgba(16,185,129,0.6)] backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-emerald-300/25 px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">AI Option</p>
              <h3 className="text-base font-semibold text-white">TripCompare Chat</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-white/20 px-2 py-1 text-xs font-semibold text-white/80 hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div className="scroll-pane flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-black"
                      : "border border-white/15 bg-black/40 text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white/75">Thinking...</div>
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-emerald-300/25 p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-emerald-300/35 px-3 py-1 text-xs font-medium text-emerald-200 hover:bg-emerald-400/15"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    sendMessage(text);
                  }
                }}
                placeholder="Type your question..."
                className="w-full rounded-xl border border-white/20 bg-black/35 px-3 py-2 text-sm text-white placeholder:text-white/55 outline-none focus:border-emerald-300/60"
              />
              <button
                type="button"
                onClick={() => sendMessage(text)}
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-emerald-300 to-emerald-500 px-3 py-2 text-sm font-semibold text-black disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fade-pop rounded-full border border-emerald-300/40 bg-gradient-to-r from-emerald-300 to-emerald-500 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.15em] text-black shadow-[0_16px_38px_-20px_rgba(16,185,129,0.9)]"
      >
        AI
      </button>
    </div>
  );
};

export default ChatbotWidget;
