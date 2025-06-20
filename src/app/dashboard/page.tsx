"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
}

interface ClassData {
  id: string;
  courseCode: string;
  courseName: string;
  semester: string;
}

export default function Dashboard(): React.ReactElement {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedUserId = localStorage.getItem("userId");

    if (storedUser && storedUserId) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch enrolled classes
      fetch(`http://localhost:8080/api/user/${storedUserId}/classrooms`)
        .then((res) => res.json())
        .then((data: ClassData[]) => setClasses(data))
        .catch((err) => console.error("Failed to load classes", err));
    } else {
      router.push("/login"); // redirect if not logged in
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      {user ? (
        <>
          <h1 className="text-3xl font-bold mb-4">
            Welcome, {user.username} 🎉
          </h1>

          <h2 className="text-xl font-semibold mb-2">Your Classes:</h2>
          {classes.length === 0 ? (
            <p>You are not enrolled in any classes.</p>
          ) : (
            <ul className="mb-6 space-y-2 w-full max-w-xl">
              {classes.map((cls) => (
                <li
                  key={cls.id}
                  className="bg-gray-800 px-4 py-2 rounded shadow flex justify-between items-center"
                >
                  <div>
                    {cls.courseCode} - {cls.courseName} ({cls.semester})
                  </div>
                  <button
                    onClick={() => router.push(`/chatroom?classId=${cls.id}`)}
                    className="ml-4 bg-white text-black px-3 py-1 rounded hover:bg-gray-300"
                  >
                    Chat
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("userId");
              router.push("/login");
            }}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-300"
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}