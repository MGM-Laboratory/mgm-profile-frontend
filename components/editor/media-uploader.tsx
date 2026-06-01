"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

import { ImageCropper } from "@/components/editor/image-cropper";
import { uploadImage } from "@/lib/api";
import { meKey } from "@/lib/hooks";
import { cn } from "@/lib/cn";

// Avatar/banner uploader: pick a file, crop in-UI, upload the cropped JPEG to
// the backend media endpoint, then refetch /me. The preview uses the stable
// public endpoint; it falls back to a placeholder if no image exists yet.

type Kind = "avatar" | "banner";

export function MediaUploader({
  kind,
  sub,
  stableUrl,
}: {
  kind: Kind;
  sub: string | undefined;
  stableUrl: string | null;
}) {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bust, setBust] = useState(0);
  const [broken, setBroken] = useState(false);

  const aspect = kind === "avatar" ? 1 : 3;
  const outputWidth = kind === "avatar" ? 512 : 1600;
  const showImage = !!stableUrl && !broken;
  const display = stableUrl ? `${stableUrl}${stableUrl.includes("?") ? "&" : "?"}v=${bust}` : null;

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSrc(URL.createObjectURL(file));
    setCropOpen(true);
    e.target.value = "";
  }

  async function onCropped(blob: Blob) {
    setBusy(true);
    try {
      await uploadImage(`me/${kind}`, blob);
      await qc.invalidateQueries({ queryKey: meKey });
      setBroken(false);
      setBust(Date.now());
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={!sub}
        className={cn(
          "group border-line bg-surface-muted hover:border-brand-blue relative overflow-hidden border transition-colors duration-200",
          kind === "avatar" ? "h-28 w-28 rounded-full" : "h-36 w-full rounded-lg",
        )}
        aria-label={kind === "avatar" ? "Change profile picture" : "Change banner"}
      >
        {showImage && display ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={display}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setBroken(true)}
          />
        ) : (
          <span className="text-ink-4 flex h-full w-full flex-col items-center justify-center gap-1">
            <ImagePlus size={20} strokeWidth={2.25} />
            <span className="text-caption">{kind === "avatar" ? "Avatar" : "Banner"}</span>
          </span>
        )}
        <span className="bg-ink/0 group-hover:bg-ink/30 absolute inset-0 flex items-center justify-center transition-colors duration-200">
          {busy ? (
            <Loader2 className="animate-spin text-white" size={20} strokeWidth={2.25} />
          ) : (
            <ImagePlus
              size={18}
              strokeWidth={2.25}
              className="text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />
          )}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={pick}
        disabled={!sub}
      />
      <ImageCropper
        open={cropOpen}
        onOpenChange={setCropOpen}
        src={src}
        aspect={aspect}
        outputWidth={outputWidth}
        title={kind === "avatar" ? "Crop profile picture" : "Crop banner"}
        onComplete={onCropped}
      />
    </>
  );
}
