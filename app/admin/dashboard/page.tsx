"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const savedUnit = localStorage.getItem("admin_unit");
    if (savedUnit) {
      router.replace(`/admin/${savedUnit}/dashboard`);
    } else {
      router.replace("/admin");
    }
  }, [router]);

  return null;
}
