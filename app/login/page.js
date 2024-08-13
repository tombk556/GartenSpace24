import React from "react";
import Link from "next/link";
const page = () => {
  return (
    <div>
      Login Page
      <p>Dont have an account?</p>
      <Link href="/signup" className="black_btn">
        Signup
      </Link>
    </div>
  );
};

export default page;
