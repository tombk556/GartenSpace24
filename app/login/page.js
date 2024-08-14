"use client";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
export default function Page() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        body: new URLSearchParams({
          username: email, // Since OAuth2PasswordRequestForm expects `username`
          password: password,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Successfully logged in");
      } else {
        const errorData = await response.json();
        console.error("Login error:", errorData);
      }
    } catch (error) {
      console.error("Login error:", error);
      
    }
  };

  return (
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
          <div>
            <h2 className="lg:text-5xl text-4xl font-extrabold lg:leading-[55px] text-black-800">
              Login to access your Account
            </h2>
            <p className="lg:text-2xl mt-6 text-gray-800">
              Access your account to manage your venues, bookings and more.
            </p>
            <p className="lg:text-xl mt-12 text-gray-800">
              Don't have an account?{" "}
              <Link href="/signup" className="orange_text font-semibold hover:underline">
                  Register here
              </Link>
            </p>
          </div>

          <form className="max-w-md md:ml-auto w-full" onSubmit={handleSubmit}>
            <h3 className="text-black-800 text-3xl font-extrabold mb-8">
              Login
            </h3>

            <div className="space-y-4">
              <div>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full text text-gray-800 px-4 py-3.5 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              </div>
              <div>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full text text-gray-800 px-4 py-3.5 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-800"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-semibold"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="black_btn w-full text-white text-sm font-semibold py-3.5 rounded-md"
              >
                Login
              </button>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <hr className="w-full border-gray-300" />
              <p className="text-sm text-gray-800 text-center">or</p>
              <hr className="w-full border-gray-300" />
            </div>
            <div className="mt-3">
              <button
                type="submit"
                className="outline_btn w-full text-white text-sm font-semibold py-3.5 rounded-md"
              >
                <FcGoogle size={20} className="mr-2"/> 
                Continue with Google
              </button>
            </div>

          </form>
        </div>
  );
}
