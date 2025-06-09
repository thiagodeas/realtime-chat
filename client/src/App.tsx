import { useEffect, useRef, useState } from "react";
import "./App.css";
import { io, type Socket } from "socket.io-client";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("chat message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socketRef.current) {
      socketRef.current.emit("chat message", input);
      setInput("");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <ul className="mb-4 border rounded p-2 h-64 overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <li key={idx} className="mb-1">
            {msg}
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
