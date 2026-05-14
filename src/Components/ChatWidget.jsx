import { useState, useRef, useEffect } from "react";

export default function ChatWidget({ context = null }) {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [voiceSupported] = useState(
    () => !!(window?.SpeechRecognition || window?.webkitSpeechRecognition),
  );
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mutedRef = useRef(muted);

  // Keep mutedRef in sync so speak() always reads the latest value
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, interimText]);

  useEffect(() => {
    if (!voiceSupported) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t;
        } else {
          interim += t;
        }
      }
      setInterimText(interim);
      if (final) {
        setInterimText("");
        setInput(final);
        setTimeout(() => sendMessageWithText(final), 80);
      }
    };

    recognition.onerror = () => {
      setListening(false);
      setInterimText("");
    };
    recognition.onend = () => {
      setListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;
  }, []);

  function toggleVoice() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      setInterimText("");
    } else {
      setInput("");
      setInterimText("");
      recognitionRef.current.start();
      setListening(true);
    }
  }

  function speak(text) {
    if (mutedRef.current || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang === "en-US" &&
        (v.name.includes("Female") ||
          v.name.includes("Samantha") ||
          v.name.includes("Google US English") ||
          v.name.includes("Ava") ||
          v.name.includes("Karen")),
    );
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }

  async function sendMessageWithText(text) {
    if (!text?.trim() || loading) return;

    const userText = text.trim();

    // Snapshot history BEFORE the state update below
    const historySnapshot = [
      ...messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: userText },
    ];

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historySnapshot,
          context,
        }),
      });

      const contentType = res.headers.get("content-type");

      const resText = await res.text();
      console.log("RAW FUNCTION RESPONSE:", resText);

      if (!res.ok) {
        throw new Error(resText || "Server error");
      }

      let data;
      try {
        data = JSON.parse(resText);
      } catch (e) {
        throw new Error("Invalid JSON returned from server");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Server error");
      }

      const reply = data?.choices?.[0]?.message?.content;
      if (!reply) throw new Error("Invalid AI response");

      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      speak(reply);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, something went wrong: " + err.message },
      ]);
    }

    setLoading(false);
  }

  function sendMessage() {
    sendMessageWithText(input);
  }

  const sendDisabled = loading || (!input.trim() && !listening);
  const micDisabled = loading;

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(196,112,32,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(196,112,32,0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .smhos-msg { animation: fadeIn 0.2s ease; }
        .smhos-scroll::-webkit-scrollbar { width: 4px; }
        .smhos-scroll::-webkit-scrollbar-track { background: transparent; }
        .smhos-scroll::-webkit-scrollbar-thumb { background: rgba(196,112,32,0.25); border-radius: 4px; }
        .smhos-input::placeholder { color: rgba(232,226,217,0.25); }
        .smhos-input:disabled { opacity: 0.5; }
      `}</style>

      {/* Floating toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Chat with SMHOS Assistant"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #d4841a, #a85e10)",
          color: "#fff",
          fontSize: 22,
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 4px 24px rgba(196,112,32,0.45)",
          transition: "transform 0.2s, box-shadow 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(196,112,32,0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(196,112,32,0.45)";
        }}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 92,
            right: 24,
            width: 340,
            height: 500,
            background: "linear-gradient(180deg, #13161e 0%, #0e1016 100%)",
            border: "1px solid rgba(196,112,32,0.2)",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
            boxShadow:
              "0 12px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid rgba(196,112,32,0.1)",
              background: "rgba(196,112,32,0.05)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: loading ? "#f0a020" : "#50c878",
                  transition: "background 0.3s",
                }}
              />
              {loading && (
                <div
                  style={{
                    position: "absolute",
                    inset: -3,
                    borderRadius: "50%",
                    border: "2px solid rgba(240,160,32,0.3)",
                    animation: "pulse 1.2s infinite",
                  }}
                />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#f5ede0",
                  letterSpacing: "0.02em",
                }}
              >
                SMHOS Assistant
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(196,136,44,0.7)",
                  marginTop: 1,
                }}
              >
                {loading
                  ? "Typing…"
                  : context
                    ? `📍 ${context.name}`
                    : "Ready to help"}
              </div>
            </div>

            {messages.length > 0 && !loading && (
              <button
                onClick={() => setMessages([])}
                title="Clear chat"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  fontSize: 13,
                  padding: "2px 6px",
                  borderRadius: 6,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,100,100,0.6)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.2)")
                }
              >
                🗑
              </button>
            )}

            <button
              onClick={() => {
                setMuted((m) => {
                  if (!m) window.speechSynthesis.cancel();
                  return !m;
                });
              }}
              title={muted ? "Unmute assistant" : "Mute assistant"}
              style={{
                background: "none",
                border: "none",
                color: muted ? "rgba(255,255,255,0.2)" : "rgba(196,136,44,0.6)",
                cursor: "pointer",
                fontSize: 14,
                padding: "2px 6px",
                borderRadius: 6,
                transition: "color 0.2s",
              }}
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* Messages */}
          <div
            className="smhos-scroll"
            style={{
              flex: 1,
              padding: "14px 14px 8px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {messages.length === 0 && !interimText && (
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(232,226,217,0.22)",
                  lineHeight: 1.7,
                  marginTop: 8,
                  textAlign: "center",
                  padding: "0 12px",
                }}
              >
                🙏 Ask about branch locations,
                <br />
                service times, or directions.
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className="smhos-msg"
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "82%",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color:
                      m.role === "user"
                        ? "rgba(196,136,44,0.5)"
                        : "rgba(180,180,180,0.35)",
                    marginBottom: 3,
                    textAlign: m.role === "user" ? "right" : "left",
                    textTransform: "uppercase",
                  }}
                >
                  {m.role === "user" ? "You" : "Assistant"}
                </div>
                <div
                  style={{
                    background:
                      m.role === "user"
                        ? "linear-gradient(135deg, rgba(196,112,32,0.28), rgba(196,112,32,0.16))"
                        : "rgba(255,255,255,0.045)",
                    border:
                      m.role === "user"
                        ? "1px solid rgba(196,112,32,0.3)"
                        : "1px solid rgba(255,255,255,0.07)",
                    borderRadius:
                      m.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    padding: "10px 14px",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: m.role === "user" ? "#f0e8d8" : "#c9a46a",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {listening && interimText && (
              <div
                className="smhos-msg"
                style={{ alignSelf: "flex-end", maxWidth: "82%" }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: "rgba(196,136,44,0.5)",
                    marginBottom: 3,
                    textAlign: "right",
                    textTransform: "uppercase",
                  }}
                >
                  You
                </div>
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(196,112,32,0.15), rgba(196,112,32,0.08))",
                    border: "1px dashed rgba(196,112,32,0.35)",
                    borderRadius: "16px 16px 4px 16px",
                    padding: "10px 14px",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "rgba(240,232,216,0.6)",
                    fontStyle: "italic",
                  }}
                >
                  {interimText}
                  <span
                    style={{ animation: "blink 1s infinite", marginLeft: 2 }}
                  >
                    |
                  </span>
                </div>
              </div>
            )}

            {listening && !interimText && (
              <div className="smhos-msg" style={{ alignSelf: "flex-end" }}>
                <div
                  style={{
                    background: "rgba(196,112,32,0.1)",
                    border: "1px dashed rgba(196,112,32,0.3)",
                    borderRadius: "16px 16px 4px 16px",
                    padding: "10px 14px",
                    fontSize: 12,
                    color: "rgba(240,232,216,0.4)",
                    fontStyle: "italic",
                  }}
                >
                  🎙️ Listening…
                </div>
              </div>
            )}

            {loading && (
              <div
                className="smhos-msg"
                style={{ alignSelf: "flex-start", maxWidth: "82%" }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: "rgba(180,180,180,0.35)",
                    marginBottom: 3,
                    textTransform: "uppercase",
                  }}
                >
                  Assistant
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.045)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px 16px 16px 4px",
                    padding: "10px 16px",
                    display: "flex",
                    gap: 5,
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "rgba(196,136,44,0.6)",
                        animation: `blink 1.2s ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input row */}
          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(0,0,0,0.2)",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            {voiceSupported && (
              <button
                onClick={toggleVoice}
                disabled={micDisabled}
                title={listening ? "Stop" : "Speak"}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: listening
                    ? "linear-gradient(135deg, #d4841a, #a85e10)"
                    : "rgba(255,255,255,0.06)",
                  border: listening
                    ? "none"
                    : "1px solid rgba(255,255,255,0.1)",
                  color: micDisabled ? "rgba(255,255,255,0.2)" : "#fff",
                  cursor: micDisabled ? "not-allowed" : "pointer",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  animation: listening ? "pulse 1.2s infinite" : "none",
                  boxShadow: listening
                    ? "0 0 0 0 rgba(196,112,32,0.5)"
                    : "none",
                }}
              >
                🎙️
              </button>
            )}

            <input
              className="smhos-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={listening ? "Speak now…" : "Ask something…"}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                outline: "none",
                background: "rgba(255,255,255,0.05)",
                color: "#e8e2d9",
                fontSize: 13,
                fontFamily: "inherit",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(196,112,32,0.4)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.08)")
              }
              onKeyDown={(e) =>
                e.key === "Enter" && !sendDisabled && sendMessage()
              }
            />

            <button
              onClick={sendMessage}
              disabled={sendDisabled}
              title={loading ? "Waiting…" : "Send"}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                flexShrink: 0,
                background: sendDisabled
                  ? "rgba(196,112,32,0.2)"
                  : "linear-gradient(135deg, #d4841a, #a85e10)",
                border: "none",
                color: "#fff",
                cursor: sendDisabled ? "not-allowed" : "pointer",
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                opacity: sendDisabled ? 0.5 : 1,
                boxShadow: sendDisabled
                  ? "none"
                  : "0 2px 12px rgba(196,112,32,0.35)",
              }}
            >
              {loading ? "⏳" : "➤"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
