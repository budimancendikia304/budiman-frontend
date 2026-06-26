"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AdminUnitRoot() {
  const router = useRouter();
  const { unit } = useParams();

  useEffect(() => {
    if (unit) {
      router.replace(`/admin/${unit}/dashboard`);
    }
  }, [unit, router]);

  return null;
}
