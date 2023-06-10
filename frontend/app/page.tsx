"use client";

import dynamic from "next/dynamic";

const Dynamic = dynamic(() => import("../components/home"), {
  ssr: false,
});

export default function Home() {
  return <Dynamic />;
}
