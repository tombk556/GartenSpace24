"use client";

import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";

const Nav = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex-between w-full mb-3 pt-3">
      <Link href="/" className="flex gap-2 flex-center ml-5">
        <Image
          src="/assets/images/logo_icon.png"
          alt="Promptopia Logo"
          width={110}
          height={110}
          className="object-contain"
        />
      </Link>
      <div className="sm:flex hidden mr-5">
        {user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/dashboard" className="black_btn">
              Dashboard
            </Link>
            <button onClick={logout} className="outline_btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3 md:gap-5">
            <Link href="/login" className="black_btn">
              Login
            </Link>
            <Link href="/signup" className="outline_btn">
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
