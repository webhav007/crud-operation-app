"use client";

import * as Switch from "@radix-ui/react-switch";
import { useThemeStore } from "@/store/themeStore";

export default function ThemeToggle() {
  const dark = useThemeStore((s) => s.dark);
  const toggle = useThemeStore((s) => s.toggleDark);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{dark ? "Dark" : "Light"}</span>
      <Switch.Root
        checked={dark}
        onCheckedChange={toggle}
        className="
          w-[42px] h-[25px] bg-neutral-300 
          dark:bg-neutral-700 rounded-full 
          relative data-[state=checked]:bg-blue-600 transition
        "
      >
        <Switch.Thumb
          className="
            block w-[18px] h-[18px] bg-white rounded-full 
            shadow translate-x-1 will-change-transform 
            data-[state=checked]:translate-x-[19px] 
            transition-transform
          "
        />
      </Switch.Root>
    </div>
  );
}
