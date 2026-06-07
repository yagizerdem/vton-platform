"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../provider/theme-provider";
import {
  ThemeAnimationType,
  useModeAnimation,
} from "react-theme-switch-animation";
import RegisterCard from "./register-card";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import LoginCard from "./login-card";
import { api } from "../lib/api";
import { CustomOptions } from "../lib/api-response";
import { toast } from "sonner";
import { useApp } from "../provider/app-provider";
import AddApiKeyCard from "./add-api-key";

function Header() {
  const app = useApp();
  const { ref, toggleSwitchTheme } = useModeAnimation({
    animationType: ThemeAnimationType.BLUR_CIRCLE,
    blurAmount: 2, // Optional: adjust blur intensity
    duration: 500, // Optional: adjust animation duration
  });
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const [showRegisterCard, setShowRegisterCard] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [showAddApiKeyCard, setShowAddApiKeyCard] = useState(false);
  const registerCardRef = useRef<HTMLDivElement>(null);
  const loginCardRef = useRef<HTMLDivElement>(null);
  const addApiKeyCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("User state changed:", app.user);
  }, [app.user]);

  function handleThemeToggle() {
    toggleSwitchTheme();
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    }, 0);
  }

  useEffect(() => {
    if (showRegisterCard && registerCardRef.current) {
      gsap.fromTo(
        registerCardRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1 },
      );
    }
  }, [showRegisterCard]);

  useEffect(() => {
    if (showLoginCard && loginCardRef.current) {
      gsap.fromTo(
        loginCardRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1 },
      );
    }
  }, [showLoginCard]);

  function closeRegisterCard() {
    if (!registerCardRef.current) {
      setShowRegisterCard(false);
      return;
    }

    gsap.to(registerCardRef.current, {
      opacity: 0,
      y: -20,
      scale: 0.9,
      duration: 0.25,
      onComplete: () => {
        setShowRegisterCard(false);
      },
    });
  }

  function closeLoginCard() {
    if (!loginCardRef.current) {
      setShowLoginCard(false);
      return;
    }

    gsap.to(loginCardRef.current, {
      opacity: 0,
      y: -20,
      scale: 0.9,
      duration: 0.25,
      onComplete: () => {
        setShowLoginCard(false);
      },
    });
  }

  async function handleLogout() {
    try {
      app.setIsLoading(true);
      const { data: apiResponse } =
        await api.post<CustomOptions<null>>("/auth/logout");
      if (apiResponse.status.toString().startsWith("2")) {
        toast.success("Logged out successfully!");
        app.setUser(null);
      } else {
        toast.error(
          apiResponse.message || "Failed to logout. Please try again.",
        );
      }
    } finally {
      app.setIsLoading(false);
    }
  }

  return (
    <div
      className="w-8/9 mx-auto h-16 rounded-xl my-4 class flex flex-row items-center justify-between px-4 bg-card "
      style={{
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      }}
    >
      <div className="flex flex-row align-middle items-center space-x-4">
        <img
          src="/vton-logo.jpg"
          alt="Logo"
          className="h-16 w-auto rounded-full select-none"
        />
        <span className="text-xl font-bold">VTON Platform</span>
      </div>

      <div className="flex flex-row items-center justify-between space-x-20 select-none">
        <div className="flex flex-row space-x-4">
          <Button
            className="cursor-pointer font-bold"
            onClick={() => setShowRegisterCard(true)}
            disabled={!app.initApp}
          >
            register
          </Button>
          <Button
            className="cursor-pointer font-bold"
            onClick={() => setShowLoginCard(true)}
            disabled={!app.initApp}
          >
            login
          </Button>
          <Button
            className="cursor-pointer font-bold"
            onClick={handleLogout}
            disabled={!app.initApp}
          >
            logout
          </Button>
        </div>

        {app.user && app.user?.username && (
          <div className="flex flex-row items-center justify-between space-x-20 select-none">
            <span className="text-lg">Welcome, {app.user.username}!</span>
          </div>
        )}

        {app.user && app.user?.username && (
          <Button
            className="cursor-pointer font-bold"
            onClick={() => setShowAddApiKeyCard(true)}
            disabled={!app.initApp}
          >
            add api key
          </Button>
        )}

        <button ref={ref} onMouseUp={handleThemeToggle}>
          {mounted &&
            (isDarkMode ? (
              <MoonIcon className="cursor-pointer" />
            ) : (
              <SunIcon className="cursor-pointer" />
            ))}
        </button>
      </div>

      {showRegisterCard && (
        <div className="absolute inset-0 w-screen h-screen flex items-center justify-center">
          <div
            className="w-full h-full bg-black opacity-50 absolute z-1"
            onMouseUp={closeRegisterCard}
          ></div>
          <RegisterCard
            className="z-20  w-99
            bg-card
          "
            close={closeRegisterCard}
            ref={registerCardRef}
          />
        </div>
      )}

      {showLoginCard && (
        <div className="absolute inset-0 w-screen h-screen flex items-center justify-center">
          <div
            className="w-full h-full bg-black opacity-50 absolute z-1"
            onMouseUp={closeLoginCard}
          ></div>
          <LoginCard
            className="z-20  w-99
            bg-card
            "
            close={closeLoginCard}
            ref={loginCardRef}
          />
        </div>
      )}

      {showAddApiKeyCard && (
        <div className="absolute inset-0 w-screen h-screen flex items-center justify-center">
          <div
            className="w-full h-full bg-black opacity-50 absolute z-1"
            onMouseUp={() => setShowAddApiKeyCard(false)}
          ></div>
          <AddApiKeyCard
            className="z-20  w-99
            bg-card
            "
            close={() => setShowAddApiKeyCard(false)}
            ref={addApiKeyCardRef}
          />
        </div>
      )}
    </div>
  );
}

export default Header;
