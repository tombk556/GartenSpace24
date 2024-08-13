"use client";

import Link from "next/link";
import Image from "next/image";

const Nav = () => {
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
        <div className="flex gap-3 md:gap-5">
          <Link href="/login" className="outline_btn">
            Login
          </Link>
          <Link href="/signup" className="outline_btn">
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
