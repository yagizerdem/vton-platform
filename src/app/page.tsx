"use client";

import { Fragment } from "react/jsx-runtime";
import Header from "../components/header";
import { useApp } from "../provider/app-provider";
import Loader from "../components/spinner";
import VtonPanel from "../components/vton-panel";

export default function Home() {
  const app = useApp();

  return (
    <Fragment>
      {app.isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center top-0 left-0 w-screen h-screen">
          <div className="absolute inset-0 bg-black opacity-80 top-0 left-0 z-10"></div>
          <Loader className="absolute z-20 " />
        </div>
      )}
      <div className="w-screen h-screen flex flex-col overflow-y-scroll">
        <Header />
        <VtonPanel />
      </div>
    </Fragment>
  );
}
