import React from "react";

export function generateStaticParams() {
  return [
    { unit: "sd" },
    { unit: "smp" }
  ];
}

export default function UnitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
