"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { IoCloudUploadOutline } from "react-icons/io5";

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

export default function ChatroomClient(): React.ReactElement {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    file_name: "",
    category: "",
    file: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files) {
      setFormData({
        ...formData,
        [name]: files[0], // set file object
      });
    } else {
      setFormData({
        ...formData,
        [name]: value, // set string value for text inputs
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    const formPayload = new FormData();
    formPayload.append("file_name", formData.file_name);
    formPayload.append("category", formData.category);
    if (formData.file) {
      formPayload.append("file", formData.file);
    } else {
      alert("Please select a file before submitting");
      return;
    }
    fetch(`${apiUrl}/api/user/${userId}/classroom/${classroomId}/files`, {
      method: "POST",
      body: formPayload,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Upload failed");
        }
      })
      .then((data) => {
        console.log("Upload Successful", data);
        setFormData({
          file_name: "",
          category: "",
          file: null,
        });
      })
      .catch((error) => {
        console.error("Error uploading files", error);
      });
  };

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

    fetch(`${apiUrl}/api/classroom/${urlClassroomId}/messages`)
      .then((res) => res.json())
      .then((data: Message[]) => setMessages(data))
      .catch((err) => console.error("Failed to fetch messages", err));
  }, [router, searchParams]);

  const sendMessage = async (): Promise<void> => {
    if (!newMessage.trim() || !userId || !classroomId) return;

    const res = await fetch(
      `${apiUrl}/api/user/${userId}/classrooms/${classroomId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      }
    );

    if (res.ok) {
      const storedUser = localStorage.getItem("user");
      const parsedUser: User = storedUser
        ? JSON.parse(storedUser)
        : { username: "Unknown" };

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
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Classroom Chat</h1>
      <h1>
        <button
          onClick={() => router.push(`/chatroom/files?classId=${classroomId}`)}
          className="ml-4 bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-300 mt-10"
        >
          Files
        </button>
      </h1>
      <div className="bg-gray-800 p-4 rounded mb-4 h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>
              {msg.sender?.username ||
                (msg as any).sender?.name ||
                (msg as any).username ||
                (msg as any).user?.username ||
                "Unknown"}
              :
            </strong>{" "}
            {msg.content}
            <div className="text-sm text-white">
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-gray-300"
        >
          Send
        </button>
        <button onClick={() => setShowForm(!showForm)}>
          <IoCloudUploadOutline size={24} className="text-gray-700" />
        </button>
        {showForm && (
          <form onSubmit={handleSubmit}>
            <div>
              <label className="text-black">File Name:</label>
              <input
                type="text"
                name="file_name"
                value={formData.file_name}
                onChange={handleChange}
                className="text-black"
              />
            </div>
            <div>
              <label className="text-black">Category:</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="text-black"
              />
            </div>
            <div>
              <label className="text-black">File:</label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                className="text-black"
              />
            </div>
            <button type="submit" className="text-black border-3 rounded">
              <span className="p-2">Submit</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
