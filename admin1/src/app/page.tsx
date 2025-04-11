"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ComicList from "./comics/list/ComicList";
import { useEffect } from "react";

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Đang tải...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Đang chuyển hướng đến trang đăng nhập...</div>;
  }

  return (
      <ComicList />
  );
}