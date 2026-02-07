"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setUser } from "../../pages/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user")); 

      console.log("user is", user);

      if (!user) {
        router.push("/auth/login");
      } else {
        console.log("user is", user);
        dispatch(setUser(user));
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  return isAuthenticated ? children : null;
}
