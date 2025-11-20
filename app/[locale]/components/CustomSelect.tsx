"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface CustomSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function CustomSelect({
  value,
  onChange,
  className = "",
  disabled = false,
  children,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        onFocus={() => !disabled && setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onMouseDown={(e) => {
          // Detect when dropdown is opened via mouse click
          if (!disabled && e.button === 0) {
            setIsOpen(true);
          }
        }}
        disabled={disabled}
        className={`w-full appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {children}
      </select>

      {/* Animated Chevron */}
      <motion.div
        className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
          disabled ? "opacity-60" : ""
        }`}
        animate={{ rotate: isOpen && !disabled ? 180 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <ChevronDown className="w-5 h-5 text-gray-700" />
      </motion.div>
    </div>
  );
}
