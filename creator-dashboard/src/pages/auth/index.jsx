import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthGuardLogin from "../../components/auth/AuthGuardLogin";

export default function index() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth/login");
  }, []);

  return (
    <AuthGuardLogin>
      <></>
    </AuthGuardLogin>
  )
}
