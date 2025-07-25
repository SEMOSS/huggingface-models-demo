"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Image, Type } from "lucide-react";
import { cn } from "../../../@providers/lib/utils";
import { Card } from "../../../@providers/components/ui/card";
import modelsStore from "../../../stores/modelsStore";
import { RiImageCircleAiFill } from "react-icons/ri";

export const StableDiffusionBanner = observer(() => {
  const [modelState, setModelState] = useState<"COLD" | "WARM" | "HOT">("COLD");

  useEffect(() => {
    modelsStore.fetchModelStatuses();
  }, []);

  useEffect(() => {
    const isActive = modelsStore.activeModels.some(
      (model) => model.name === "stable-diffusion-v1-5"
    );
    const isWarming = modelsStore.warmingModels.some(
      (model) => model.name === "stable-diffusion-v1-5"
    );

    if (isActive) {
      setModelState("HOT");
    } else if (isWarming) {
      setModelState("WARM");
    } else {
      setModelState("COLD");
    }
  }, [modelsStore.activeModels, modelsStore.warmingModels]);

  const statusColors = {
    COLD: "bg-blue-500",
    WARM: "bg-amber-500",
    HOT: "bg-green-500",
  };

  const glowColors = {
    COLD: "shadow-blue-500/50",
    WARM: "shadow-amber-500/50",
    HOT: "shadow-green-500/50",
  };

  return (
    <Card className="w-full flex items-center justify-between px-6 py-3 bg-background">
      {/* Left side - Image-Text-To-Text with icon */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Image className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">Text-To-Image</span>
      </div>

      {/* Middle */}
      <div className="text-xl font-bold flex justify-center items-center">
        {" "}
        <RiImageCircleAiFill className="mr-2 size-4" />
        <span>Stable Diffusion v1.5</span>
      </div>

      {/* Right side - Model Status */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Model Status</span>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-3 w-3 rounded-full",
              statusColors[modelState],
              "shadow-[0_0_8px_2px]",
              glowColors[modelState]
            )}
          />
          <span className="font-semibold">{modelState}</span>
        </div>
      </div>
    </Card>
  );
});

export default StableDiffusionBanner;
