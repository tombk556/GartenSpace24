"use client";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import ErrorMessage from "@components/ErrorMessage";

export default function Page() {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/");
    } else {
      const queryParams = new URLSearchParams(window.location.search);
      const errorParam = queryParams.get("error");
      if (errorParam) {
        setError(errorParam);
      }
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div></div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = await login(username, password);
    if (errorMessage) {
      setError(errorMessage);
    }
  };

  return (
    <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
      <div>
        <h2 className="lg:text-5xl text-4xl font-extrabold lg:leading-[55px] text-black-800">
          Konto erstellen oder anmelden
        </h2>
        <p className="lg:text-2xl mt-6 text-gray-800">
          Um einen Kleingarten anzubieten oder eine Suchanfrage aufzugeben,
          benötigst du ein Konto. 
          Melde dich an oder registriere dich in wenigen
          Schritten.
        </p>
        <p className="lg:text-2xl mt-12 text-gray-800">
          Du hast noch kein Konto?{" "}
          <Link
            href="/authsignup"
            className="green_text font-semibold hover:underline"
          >
            Hier registrieren
          </Link>
        </p>
      </div>
      <form className="max-w-md md:ml-auto w-full" onSubmit={handleSubmit}>
        <h3 className="text-black-800 text-3xl font-extrabold mb-8">
          Anmelden
        </h3>
        <div className="space-y-4">
          <div>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full text-gray-800 px-4 py-3.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
              placeholder="Email Addresse"
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
            <div className="text-sm">
              <Link href="#" className="font-semibold hover:underline">
                Passwort vergessen?
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <button
            type="submit"
            className="black_btn w-full text-white text-sm font-semibold py-3.5 rounded-md"
          >
            Anmelden
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
