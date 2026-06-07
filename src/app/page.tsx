"use client";

import { Fragment } from "react/jsx-runtime";
import Header from "../components/header";
import { useApp } from "../provider/app-provider";
import Loader from "../components/spinner";
import VtonPanel from "../components/vton-panel";
import { Sparkles, Shirt, ImageIcon, Zap } from "lucide-react";
import Gallery from "../components/gallery";

export default function Home() {
  const app = useApp();

  return (
    <Fragment>
      {app.isLoading && (
        <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center">
          <div className="absolute inset-0 z-10 bg-black opacity-80" />
          <Loader className="absolute z-20" />
        </div>
      )}
      <div className="md:collapse visible w-full h-12 my-4 flex flex-row align-middle items-center space-x-4  ">
        <img
          src="/vton-logo.jpg"
          alt="Logo"
          className="rounded-full select-none h-12 w-12"
        />
        <span className="text-xl font-bold">VTON Platform</span>
      </div>

      <main className="min-h-screen w-screen overflow-x-hidden bg-background text-foreground">
        <Header />

        <section className="mx-auto grid w-11/12 max-w-7xl grid-cols-1 items-center gap-10 py-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm shadow-sm">
              <Sparkles className="h-4 w-4" />
              AI Virtual Try-On Platform
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Try clothes on anyone with AI.
            </h1>

            <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              Upload a person image and a garment image. VTON generates a
              realistic virtual try-on result in seconds.
            </p>

            <div className="grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <ImageIcon className="mb-3 h-6 w-6" />
                <h3 className="font-bold">Person</h3>
                <p className="text-sm text-muted-foreground">
                  Upload model photo.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <Shirt className="mb-3 h-6 w-6" />
                <h3 className="font-bold">Garment</h3>
                <p className="text-sm text-muted-foreground">
                  Upload clothing.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <Zap className="mb-3 h-6 w-6" />
                <h3 className="font-bold">Result</h3>
                <p className="text-sm text-muted-foreground">
                  Generate output.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" />
            <div className="relative rounded-[2rem] border bg-card p-4 shadow-2xl">
              <VtonPanel />
            </div>
          </div>
        </section>

        <section className="mx-auto w-11/12 max-w-7xl pb-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="mb-2 text-xl font-bold">Fast workflow</h2>
              <p className="text-muted-foreground">
                Select two images, submit the job, and display the generated
                output cleanly.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6">
              <h2 className="mb-2 text-xl font-bold">API key support</h2>
              <p className="text-muted-foreground">
                Users can add their own API key and use the platform after
                login.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6">
              <h2 className="mb-2 text-xl font-bold">Responsive design</h2>
              <p className="text-muted-foreground">
                Works better on desktop and mobile than your current raw panel.
              </p>
            </div>
          </div>
        </section>

        <Gallery />
      </main>
    </Fragment>
  );
}
