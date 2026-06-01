"use client";

import { useCallback, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

// In-UI crop/adjust before upload (plan §5). Given a selected image, the user
// frames a crop at a fixed aspect; on confirm we render the crop to a canvas and
// return a JPEG Blob ready for the backend pipeline.
export function ImageCropper({
  open,
  onOpenChange,
  src,
  aspect,
  title,
  outputWidth,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  src: string | null;
  aspect: number;
  title: string;
  outputWidth: number;
  onComplete: (blob: Blob) => void;
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completed, setCompleted] = useState<PixelCrop>();

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const initial = centerCrop(
        makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height),
        width,
        height,
      );
      setCrop(initial);
    },
    [aspect],
  );

  async function confirm() {
    const image = imgRef.current;
    if (!image || !completed) return;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const outW = outputWidth;
    const outH = Math.round(outputWidth / aspect);

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      image,
      completed.x * scaleX,
      completed.y * scaleY,
      completed.width * scaleX,
      completed.height * scaleY,
      0,
      0,
      outW,
      outH,
    );

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9),
    );
    if (blob) {
      onComplete(blob);
      onOpenChange(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Drag to reposition and resize the crop."
    >
      {src && (
        <div className="flex flex-col gap-4">
          <div className="bg-surface-muted flex max-h-[55vh] justify-center overflow-hidden rounded-md p-2">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompleted(c)}
              aspect={aspect}
              keepSelection
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={src}
                alt=""
                onLoad={onImageLoad}
                className="max-h-[50vh] object-contain"
              />
            </ReactCrop>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={confirm} disabled={!completed?.width}>
              Apply crop
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
