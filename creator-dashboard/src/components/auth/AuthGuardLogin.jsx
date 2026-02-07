import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AuthGuardLogin({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        router.push("/home");
      }
    }
  }, [router]);

  return children;
}
