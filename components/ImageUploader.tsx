"use client";

import React, { useState, useRef } from "react";
import { uploadToImgbb } from "@/lib/uploadToImgbb";
import { playSound } from "@/lib/sounds";
import {
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Check,
  X,
  Link as LinkIcon,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "صورة المنتج",
  helperText = "اختر صورة واضحة (PNG, JPG, WEBP) وسيتم رفعها مباشرة إلى ImgBB",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP)");
      return;
    }

    // Check size limit: max 16MB
    if (file.size > 16 * 1024 * 1024) {
      setError("حجم الصورة يجب ألا يتجاوز 16 ميجابايت");
      return;
    }

    setUploading(true);
    setError(null);
    playSound("click");

    try {
      const url = await uploadToImgbb(file);
      onChange(url);
      playSound("success");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "فشل رفع الصورة إلى ImgBB");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-zinc-300 flex items-center gap-1.5">
          <ImageIcon size={14} className="text-pink-400" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1 underline transition"
        >
          <LinkIcon size={12} />
          <span>{showUrlInput ? "إخفاء إدخال الرابط" : "إدخال رابط بدلاً من الرفع"}</span>
        </button>
      </div>

      {/* Preview Card if Image exists */}
      {value && !uploading && (
        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-pink-500/30 bg-black/60 group">
          <img
            src={value}
            alt="Product Preview"
            className="w-full h-full object-contain p-2"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-zinc-900/90 text-pink-400 hover:bg-zinc-800 text-xs flex items-center gap-1 border border-zinc-700"
            >
              <ExternalLink size={14} />
              <span>معاينة الرابط</span>
            </a>
            <button
              type="button"
              onClick={() => {
                playSound("click");
                onChange("");
              }}
              className="p-2 rounded-lg bg-red-950/90 text-red-400 hover:bg-red-900 text-xs flex items-center gap-1 border border-red-800"
            >
              <X size={14} />
              <span>إزالة الصورة</span>
            </button>
          </div>
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-pink-500/30 text-[10px] text-pink-300 font-mono">
            ImgBB Hosted ✓
          </span>
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
          dragActive
            ? "border-pink-400 bg-pink-500/10 scale-[1.01]"
            : "border-zinc-700 hover:border-pink-500/50 bg-zinc-950/60 hover:bg-zinc-900/40"
        } ${uploading ? "pointer-events-none opacity-80" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <div className="py-4 flex flex-col items-center gap-2 text-pink-400">
            <Loader2 size={26} className="animate-spin text-pink-400" />
            <span className="text-xs font-bold text-pink-300">
              جاري رفع الصورة إلى ImgBB وتوليد الرابط المباشر...
            </span>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
              <UploadCloud size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-200">
                {value ? "انقر هنا أو اسحب صورة جديدة لتغيير الصورة" : "انقر لاختيار صورة من جهازك أو اسحبها هنا"}
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {helperText}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Optional Direct URL Input */}
      {showUrlInput && (
        <div className="pt-1">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="أو الصق رابط الصورة المباشر هنا (URL)..."
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-mono focus:outline-none focus:border-pink-500"
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-[11px] text-red-400 flex items-center gap-1 font-medium">
          <X size={12} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
