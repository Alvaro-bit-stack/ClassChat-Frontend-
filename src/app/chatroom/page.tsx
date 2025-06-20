"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface Sender {
  username: string;
}

interface Message {
  sender?: Sender;
  content: string;
  timestamp: string;
}

interface User {
  username: string;
}

export default function Chatroom(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("STORED USER ID", storedUserId);
    const urlClassroomId = searchParams.get("classId");

    if (!storedUserId) {
      router.push("/login");
      return;
    }

    if (!urlClassroomId) {
      console.log("MISTAKE HERE");
      return;
    }

    setUserId(storedUserId);
    setClassroomId(urlClassroomId);

    fetch(`http://localhost:8080/api/classroom/${urlClassroomId}/messages`)
      .then((res) => res.json())
      .then((data: Message[]) => setMessages(data))
      .catch((err) => console.error("Failed to fetch messages", err));
  }, [router, searchParams]);

  const sendMessage = async (): Promise<void> => {
    if (!newMessage.trim() || !userId || !classroomId) return;

    const res = await fetch(
      `http://localhost:8080/api/user/${userId}/classrooms/${classroomId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      }
    );

    if (res.ok) {
      const storedUser = localStorage.getItem("user");
      const parsedUser: User = storedUser ? JSON.parse(storedUser) : { username: "Unknown" };
      
      const newMsg: Message = {
        sender: { username: parsedUser.username },
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    } else {
      alert("❌ Failed to send message.");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewMessage(e.target.value);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Classroom Chat</h1>

      <div className="bg-gray-800 p-4 rounded mb-4 h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>
              {msg.sender?.username || 
               (msg as any).sender?.name || 
               (msg as any).username || 
               (msg as any).user?.username ||
               "Unknown"}:
            </strong> {msg.content}
            <div className="text-sm text-gray-400">
              {new Date(msg.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-grow px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}