// app/chatroom/page.tsx
import React, { Suspense } from "react";
import ChatroomClient from "./ChatroomClient";

export const revalidate = 0; // optional, disables static prerender

export default function ChatroomPage() {
  return (
    <Suspense fallback={<div>Loading chatroom...</div>}>
      <ChatroomClient />
    </Suspense>
  );
}
