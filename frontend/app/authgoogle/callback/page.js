"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { FaSpinner } from "react-icons/fa";

export default function Page() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const error = queryParams.get("error");

    if (token) {
      localStorage.setItem("access_token", token);
      router.push('/userentities');
    } else if (error) {
      setErrorMessage(error);
    } else {
      router.push('/authlogin');
    }
  }, [router]);

  return (
    <div>
      {errorMessage ? (
        <div style={{ color: 'red' }}>{errorMessage}</div>
      ) : (
        <div><FaSpinner className="animate-spin text-gray-700 text-4xl" /></div>
      )}
    </div>
  );
}
