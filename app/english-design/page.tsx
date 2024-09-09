"use client";
import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import { EnglishVideoProvider } from "./store-provider";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const params = useSearchParams();
  const isView = JSON.parse(params.get("view") || "false");
  const [delay, setDelay] = useState(isView ? 1000 : 0);
  const [isShowPage, setIsShowPage] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsShowPage(true);
    }, delay);
  });
  return (
    isShowPage && (
      <EnglishVideoProvider>
        <HomePage />
      </EnglishVideoProvider>
    )
  );
}
