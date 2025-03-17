"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import axios from "axios";
import ErrorMessage from "@components/ErrorMessage";

export default function Page() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    if (!termsAccepted) {
      setError("You must accept the Terms & Conditions to create an account.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign_up`, {
        email,
        username,
        password,
      });

      if (response.status === 201) {
        router.push("/login");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        const errorDetails = err.response.data.detail;
        if (Array.isArray(errorDetails) && errorDetails.length > 0) {
          const firstError = errorDetails[0];
          setError(firstError.msg); 
        } else {
          setError(err.response.data.detail);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };


  return (
    <div className="max-w-md w-full mx-auto rounded-2xl">
      <form className="max-w-md md:ml-auto w-full" onSubmit={handleSubmit}>
        <h3 className="text-black-800 text-3xl font-extrabold mb-8">
          Konto erstellen
        </h3>
        <div className="space-y-4 mt-2">
          <div>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full text-gray-800 px-4 py-3.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
              placeholder="Email Addresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              name="username"
              type="username"
              autoComplete="username"
              required
              className="w-full text-gray-800 px-4 py-3.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
              placeholder="Nutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full text-gray-800 px-4 py-3.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <ErrorMessage message={error} />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label
                htmlFor="remember-me"
                className="ml-3 block text-sm text-gray-800"
              >
                Ich aktzeptiere die {" "}
                <Link
                  href="#"
                  className="font-semibold hover:underline"
                >
                  Nutzungsbedingungen
                </Link>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="black_btn w-full text-white text-sm font-semibold py-3.5 rounded-md"
          >
            Konto erstellen
          </button>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <hr className="w-full border-gray-300" />
          <p className="text-sm text-gray-800 text-center">oder</p>
          <hr className="w-full border-gray-300" />
        </div>
        <div className="mt-3">
          <button
            type="button"
            className="outline_btn w-full text-white text-sm font-semibold py-3.5 rounded-md"
            onClick={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/login/google`)
            }
          >
            <FcGoogle size={20} className="mr-2" />
            Mit Google Anmelden
          </button>
        </div>
      </form>
    </div>
  );
}
