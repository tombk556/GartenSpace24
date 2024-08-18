"use client";
import { useEffect } from "react";

export default function Page() {

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("access_token", token);
      console.log("token", token);
    } else {
        console.log("no token");
    }
  }, []);

  return <div>Loading...</div>;
}
