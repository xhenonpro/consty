"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RequireAuth() {
  const router = useRouter();
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
    }
  }, [router]);
  return null;
}
