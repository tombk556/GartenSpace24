"use client";

import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import DropdownMenu from "./DropDownMenu";

const Nav = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="fixed flex-between w-full pt-3 z-50 bg-white">
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
          <Link href="/venues" className="black_btn">
            Find Venues
          </Link>
          <DropdownMenu/>
          </div>
        ) : (
          <div className="flex gap-3 md:gap-5">
            <Link href="/venues" className="black_btn">
              Find Venues
            </Link>
            <Link href="/login" className="black_btn">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
