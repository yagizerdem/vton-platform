"use client";

import Header from "../components/header";
import { BaseProvider } from "../provider/base-provider";

export default function Home() {
  return (
    <BaseProvider>
      <div className="w-screen h-screen flex flex-col overflow-hidden">
        <Header />
      </div>
    </BaseProvider>
  );
}
