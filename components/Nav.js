"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const Nav = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo_icon.png"
          alt="Promptopia Logo"
          width={110}
          height={110}
          className="object-contain"
        />
      </Link>
      <div className="sm:flex hidden">
        {isSignedIn ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-prompt" className="black_btn">
              Create Post
            </Link>

            <button
              type="button"
              onClick={() => setIsSignedIn(false)} // Simulate sign out
              className="outline_btn"
            >
              Sign Out
            </button>

            <Link href="/profile">
              <Image
                src="/assets/images/logo.svg"
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsSignedIn(true)} // Simulate sign in
            className="outline_btn"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
