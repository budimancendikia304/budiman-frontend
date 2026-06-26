import React from "react";

export function generateStaticParams() {
  return [
    { unit: "sd" },
    { unit: "smp" }
  ];
}

export default function AdminUnitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
