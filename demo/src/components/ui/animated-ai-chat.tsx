"use client";

import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    ImageIcon,
    FileUp,
    Figma,
    MonitorIcon,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
    SendIcon,
    XIcon,
    LoaderIcon,
    Sparkles,
    Command,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react"
import { TextAutoPanel } from "../TextAutoPanel";
import { ChatAutoPanel } from "../ChatAutoPanel";
import { FunctionAutoPanel } from "../FunctionAutoPanel";
import { StructuredAutoPanel } from "../StructuredAutoPanel";
import { FileAutoPanel } from "../FileAutoPanel";
import { DocumentAutoPanel } from "../DocumentAutoPanel";
import { ImageGenerationPanel } from "../ImageGenerationPanel";
import { ImageUnderstandingPanel } from "../ImageUnderstandingPanel";
import { AudioAutoPanel } from "../AudioAutoPanel";
import { VideoAutoPanel } from "../VideoAutoPanel";
import { MultimodalAutoPanel } from "../MultimodalAutoPanel";
import { SearchGroundingPanel } from "../SearchGroundingPanel";
import { CodeExecutionPanel } from "../CodeExecutionPanel";
import { TokenCounterPanel } from "../TokenCounterPanel";
import { ThinkingPanel } from "../ThinkingPanel";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) {
              return;
            }

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
    icon: React.ReactNode;
    label: string;
    description: string;
    prefix: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <div className={cn(
        "relative",
        containerClassName
      )}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {showRing && isFocused && (
          <motion.span 
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {props.onChange && (
          <div 
            className="absolute bottom-2 right-2 opacity-0 w-2 h-2 bg-violet-500 rounded-full"
            style={{
              animation: 'none',
            }}
            id="textarea-ripple"
          />
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

const TABS = [
  { key: "text", label: "Text Generation" },
  { key: "chat", label: "Chat" },
  { key: "function", label: "Function Calling" },
  { key: "structured", label: "Structured Output" },
  { key: "file", label: "File API" },
  { key: "document", label: "Document Understanding" },
  { key: "imagegen", label: "Image Generation" },
  { key: "imageunder", label: "Image Understanding" },
  { key: "audio", label: "Audio Understanding" },
  { key: "video", label: "Video Understanding" },
  { key: "multimodal", label: "Multimodal" },
  { key: "search", label: "Search Grounding" },
  { key: "code", label: "Code Execution" },
  { key: "token", label: "Token Counter" },
  { key: "thinking", label: "Thinking" },
];

export default function AnimatedAINexus() {
  const [apiKey, setApiKey] = useState("");
  const [tab, setTab] = useState("text");

  return (
    <div className="min-h-screen flex flex-col w-full items-center justify-center bg-[#0a0a0b] text-white p-6 relative overflow-hidden">
      {/* Animated vibrant background for dark mode */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-fuchsia-700/30 via-violet-700/30 to-indigo-700/30 rounded-full filter blur-[140px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-indigo-600/30 via-blue-700/30 to-fuchsia-700/30 rounded-full filter blur-[140px] animate-pulse delay-700" />
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-br from-fuchsia-500/20 via-violet-500/20 to-indigo-500/20 rounded-full filter blur-[100px] animate-pulse delay-1000" />
      </div>
      <div className="w-full max-w-2xl mx-auto relative z-10">
        <motion.div
          className="relative z-10 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* API Key Input */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-white/90 drop-shadow">Gemini API Key:</label>
            <input
              type="password"
              className="w-full border border-violet-800/40 rounded-lg p-2 bg-[#18181b] text-white/90 placeholder:text-white/40 focus:border-violet-500 focus:ring-2 focus:ring-violet-700/40 transition-all shadow-lg shadow-black/10"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              autoComplete="off"
            />
          </div>
          {/* Animated Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {TABS.map(t => (
              <motion.button
                key={t.key}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all border border-transparent",
                  tab === t.key
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-700/20 border-violet-500/60 ring-2 ring-violet-700/40"
                    : "bg-[#18181b] text-white/70 hover:bg-[#232336] hover:text-white/90 border-[#232336]"
                )}
                onClick={() => setTab(t.key)}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ boxShadow: tab === t.key ? "0 0 12px 2px #a78bfa33" : undefined }}
              >
                {t.label}
              </motion.button>
            ))}
          </div>
          {/* Animated Feature Panel */}
          <motion.div
            className="relative backdrop-blur-2xl bg-[#18181b]/80 rounded-2xl border border-violet-900/40 shadow-2xl p-6 min-h-[350px] ring-1 ring-violet-800/30"
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ boxShadow: "0 8px 40px 0 #000a, 0 0 0 1.5px #a78bfa22" }}
          >
            <AnimatePresence mode="wait">
              {tab === "text" && <TextAutoPanel apiKey={apiKey} />}
              {tab === "chat" && <ChatAutoPanel apiKey={apiKey} />}
              {tab === "function" && <FunctionAutoPanel apiKey={apiKey} />}
              {tab === "structured" && <StructuredAutoPanel apiKey={apiKey} />}
              {tab === "file" && <FileAutoPanel apiKey={apiKey} />}
              {tab === "document" && <DocumentAutoPanel apiKey={apiKey} />}
              {tab === "imagegen" && <ImageGenerationPanel apiKey={apiKey} />}
              {tab === "imageunder" && <ImageUnderstandingPanel apiKey={apiKey} />}
              {tab === "audio" && <AudioAutoPanel apiKey={apiKey} />}
              {tab === "video" && <VideoAutoPanel apiKey={apiKey} />}
              {tab === "multimodal" && <MultimodalAutoPanel apiKey={apiKey} />}
              {tab === "search" && <SearchGroundingPanel apiKey={apiKey} />}
              {tab === "code" && <CodeExecutionPanel apiKey={apiKey} />}
              {tab === "token" && <TokenCounterPanel apiKey={apiKey} />}
              {tab === "thinking" && <ThinkingPanel apiKey={apiKey} />}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function TypingDots() {
    return (
        <div className="flex items-center ml-1">
            {[1, 2, 3].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 bg-white/90 rounded-full mx-0.5"
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                        opacity: [0.3, 0.9, 0.3],
                        scale: [0.85, 1.1, 0.85]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: dot * 0.15,
                        ease: "easeInOut",
                    }}
                    style={{
                        boxShadow: "0 0 4px rgba(255, 255, 255, 0.3)"
                    }}
                />
            ))}
        </div>
    );
}

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
}

function ActionButton({ icon, label }: ActionButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-all relative overflow-hidden group"
        >
            <div className="relative z-10 flex items-center gap-2">
                {icon}
                <span className="text-xs relative z-10">{label}</span>
            </div>
            
            <AnimatePresence>
                {isHovered && (
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </AnimatePresence>
            
            <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
}

const rippleKeyframes = `
@keyframes ripple {
  0% { transform: scale(0.5); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
}
`;

if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = rippleKeyframes;
    document.head.appendChild(style);
}


