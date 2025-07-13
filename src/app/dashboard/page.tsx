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
  imageUrl: string;
}

export default function Dashboard(): React.ReactElement {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
      fetch(`${apiUrl}/api/user/${storedUserId}/classrooms`)
        .then((res) => res.json())
        .then((data: ClassData[]) => setClasses(data))
        .catch((err) => console.error("Failed to load classes", err));
    } else {
      router.push("/login"); // redirect if not logged in
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 p-7">
      {user ? (
        <>
          <h1 className="text-5xl font-bold mb-4 w-100%">
            {user.username}'s Dashboard
            <hr
              style={{
                background: "blue",
                color: "blue",
                borderColor: "blue",
                height: "2px",
                width: "100%",
              }}
            />
          </h1>

          <h2 className="text-xl font-semibold mb-2">Your Classes:</h2>
          {classes.length === 0 ? (
            <p>You are not enrolled in any classes.</p>
          ) : (
            <ul className="w-full flex flex-row gap-4 overflow-x-auto pb-4">
              {classes.map((cls) => (
                <>
                  <li
                    key={cls.id}
                    className="bg-gray-800 px-4 py-2 rounded shadow flex flex-col min-w-[300px]"
                  >
                    <div className="text-2xl font-medium text-white">
                      {cls.courseCode} - {cls.courseName} ({cls.semester})
                    </div>
                    <div className="pt-4">
                      <img
                        src={cls.imageUrl}
                        alt={`${cls.courseCode} banner`}
                        className="w-2xl h-[300px] object-cover rounded"
                      />
                    </div>
                    <button
                      onClick={() => router.push(`/chatroom?classId=${cls.id}`)}
                      className="ml-4 bg-white text-black px-3 py-1 rounded hover:bg-gray-300 mt-10"
                    >
                      Chat
                    </button>
                  </li>
                </>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
