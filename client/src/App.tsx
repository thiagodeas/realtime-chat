import { useEffect, useRef, useState } from "react";
import "./App.css";
import { io, type Socket } from "socket.io-client";
import type { ChatMessage } from "./types";

function App() {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [nameSet, setNameSet] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!nameSet) return;
    socketRef.current = io("http://localhost:3001");

    socketRef.current.emit("join", name);

    socketRef.current.on("chat message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("Mensagem do sistema: ", (msg: string) => {
      setMessages((prev) => [...prev, { name: "Sistema", message: msg }]);
    });

    socketRef.current.on("typing", (user: string) => {
      setTypingUsers((prev) => (prev.includes(user) ? prev : [...prev, user]));
    });

    socketRef.current.on("stop typing", (user: string) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [nameSet, name]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socketRef.current) {
      socketRef.current.emit("chat message", { name, message: input });
      setInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (socketRef.current) {
      socketRef.current.emit("typing");

      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socketRef.current?.emit("stop typing");
      }, 1000);
    }
  };

  if (!nameSet) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-[#253659]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) setNameSet(true);
          }}
          className="flex gap-2"
        >
          <input
            className="border rounded p-2 w-80 focus:outline-none bg-gray-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome..."
          />
          <button
            className={
              name.length < 3
                ? "bg-gray-300 text-gray-500 font-bold px-4 rounded cursor-not-allowed"
                : "bg-[#04BF9D] text-white font-bold px-4 rounded hover:bg-[#03A696] transition-all duration-300 cursor-pointer"
            }
            type="submit"
            disabled={name.length < 3}
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 h-screen bg-[#253659]">
      <ul className="mb-4 border rounded p-4 h-4/5 w-3/4 overflow-y-auto bg-gray-200 flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <li
            key={idx}
            className={`flex ${
              msg.name === name
                ? "justify-end"
                : msg.name === "Sistema"
                ? "justify-center"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-2 rounded break-words ${
                msg.name === name
                  ? "bg-[#F27457] text-right"
                  : msg.name === "Sistema"
                  ? "bg-transparent text-gray-500 text-center"
                  : "bg-gray-300 text-left"
              }`}
            >
              {msg.name !== "Sistema" && (
                <span className={msg.name === name ? "font-bold" : ""}>
                  {msg.name}:{" "}
                </span>
              )}
              {msg.message}
            </div>
          </li>
        ))}
        <div>
          {(() => {
            const outrosDigitando = typingUsers.filter((u) => u !== name);
            if (outrosDigitando.length === 0) return null;
            return `${outrosDigitando.join(", ")} ${
              outrosDigitando.length === 1 ? "está" : "estão"
            } digitando...`;
          })()}
        </div>
      </ul>

      <form onSubmit={sendMessage} className="flex gap-2 w-3/4">
        <input
          className="border rounded p-2 w-full bg-gray-200 outline-none"
          value={input}
          onChange={handleInputChange}
          placeholder="Digite sua mensagem..."
        />
        <button
          className="bg-[#04BF9D] text-[#253659] font-bold px-4 rounded cursor-pointer hover:text-white transition-all duration-500"
          type="submit"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default App;
