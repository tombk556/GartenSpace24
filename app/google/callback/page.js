"use client";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    if (token) {
      localStorage.setItem("access_token", token);
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, []);

  return <div>Loading...</div>;
}
