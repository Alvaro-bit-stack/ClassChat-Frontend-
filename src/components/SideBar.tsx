"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
interface User {
  username: string;
}

interface ClassData {
  id: string;
  courseCode: string;
  courseName: string;
  semester: string;
}

export default function SideBar() {
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
    <>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* <!-- Page content here --> */}
          <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
            Courses
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          {classes.length === 0 ? (
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              <a href="/ChooseClasses" className="text-xl">
                Add Classes
              </a>
              <hr
                style={{
                  background: "blue",
                  color: "blue",
                  borderColor: "blue",
                  height: "4px",
                  width: "100%",
                }}
              />
              <p>You are not enrolled in any classes.</p>
            </ul>
          ) : (
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              {/* <!-- Sidebar content here --> */}
              <a href="/ChooseClasses" className="text-xl">
                Add Classes
              </a>
              <hr
                style={{
                  background: "blue",
                  color: "blue",
                  borderColor: "blue",
                  height: "4px",
                  width: "100%",
                }}
              />
              {classes.map((cls) => (
                <li
                  key={cls.id}
                  className="bg-white px-4 py-2 rounded shadow flex justify-between items-center"
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
        </div>
      </div>
    </>
  );
}
