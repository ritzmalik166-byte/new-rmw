"use client";

import { useContext } from "react";
import { RubyContext } from "@/components/ruby-bot/RubyContext";
import { RubyMark } from "@/components/ruby-bot/RubyMark";

/* Opens the Ruby chat panel above the shared WhatsApp/call rail. */
export function RubyLauncher() {
  const ruby = useContext(RubyContext);
  if (!ruby || ruby.isRubyOpen) return null;

  return (
    <button
      type="button"
      onClick={() => ruby.setIsRubyOpen(true)}
      aria-label="Chat with Ruby, our assistant"
      className="ruby-launcher theme-keep"
    >
      <RubyMark />
      <span>Ask Ruby</span>
    </button>
  );
}
