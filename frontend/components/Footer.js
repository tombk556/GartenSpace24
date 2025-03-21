import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full mb-3 pt-3 z-50">
      <div className="w-full mx-auto max-w-screen-xl p-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center justify-center md:justify-start w-full md:w-auto mb-4 md:mb-0">
          <Image
            src="/assets/images/Logo_GardenSpace24.svg"
            alt="Promptopia Logo"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>

        <span className="text-gray-600 text-sm text-center md:text-left mb-4 md:mb-0">
          <Link href="/" className="hover:underline">
            GartenSpace24
          </Link>
        </span>

        <div className="flex flex-wrap justify-center md:justify-end items-center text-sm text-gray-600 font-medium space-x-4 md:space-x-6">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/impressum" className="hover:underline">
            Impressum
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
