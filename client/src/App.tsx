import { useEffect, useRef, useState } from "react";
import "./App.css";
import { io, type Socket } from "socket.io-client";
import type { ChatMessage } from "./types";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [nameSet, setNameSet] = useState(false);
  const socketRef = useRef<Socket | null>(null);

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

  if (!nameSet) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) setNameSet(true);
          }}
          className="flex gap-2"
        >
          <input
            className="border rounded p-2 flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome..."
          />
          <button className="bg-blue-500 text-white px-4 rounded" type="submit">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <ul className="mb-4 border rounded p-2 h-64 overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <li
            key={idx}
            className={`mb-1 ${
              msg.name === name
                ? "text-right bg-blue-100"
                : msg.name === "Sistema"
                ? "text-center text-gray-500"
                : "text-left bg-gray-200"
            } p-1 rounded`}
          >
            {msg.name !== "Sistema" && (
              <span className="font-bold">{msg.name}: </span>
            )}
            {msg.message}
          </li>
        ))}
      </ul>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="border rounded p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button className="bg-blue-500 text-white px-4 rounded" type="submit">
          Enviar
        </button>
      </form>
    </div>
  );
}

export default App;
