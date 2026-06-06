"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../provider/theme-provider";
import {
  ThemeAnimationType,
  useModeAnimation,
} from "react-theme-switch-animation";

function Header() {
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
    animationType: ThemeAnimationType.BLUR_CIRCLE,
    blurAmount: 2, // Optional: adjust blur intensity
    duration: 500, // Optional: adjust animation duration
  });

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
          <Button className="cursor-pointer font-bold">register</Button>
          <Button className="cursor-pointer font-bold">login</Button>
          <Button className="cursor-pointer font-bold">logout</Button>
        </div>
        <button ref={ref} onMouseUp={toggleSwitchTheme}>
          {isDarkMode && <MoonIcon className="cursor-pointer" />}
          {!isDarkMode && <SunIcon className="cursor-pointer" />}
        </button>
      </div>
    </div>
  );
}

export default Header;
