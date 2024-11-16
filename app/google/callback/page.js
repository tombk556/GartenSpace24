"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const error = queryParams.get("error");

    if (token) {
      localStorage.setItem("access_token", token);
      router.push('/');
    } else if (error) {
      setErrorMessage(error);
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      {errorMessage ? (
        <div style={{ color: 'red' }}>{errorMessage}</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
