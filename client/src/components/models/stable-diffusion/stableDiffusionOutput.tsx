"use client";

import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { stableDiffusionStore } from "../../../stores/stableDiffusionStore";
import { Button } from "../../../@providers/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../@providers/components/ui/card";
import { Badge } from "../../../@providers/components/ui/badge";
import { Separator } from "../../../@providers/components/ui/separator";
import { Download, ImageIcon, Timer, Zap, Settings, Hash } from "lucide-react";

const StableDiffusionOutput: React.FC = observer(() => {
  const [liveGenerationTime, setLiveGenerationTime] = React.useState(0);

  // Live timer effect for generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      stableDiffusionStore.isProcessing &&
      stableDiffusionStore.generationStartTime
    ) {
      interval = setInterval(() => {
        setLiveGenerationTime(
          Date.now() - stableDiffusionStore.generationStartTime!
        );
      }, 100); // Update every 100ms for smooth timer
    } else {
      setLiveGenerationTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    stableDiffusionStore.isProcessing,
    stableDiffusionStore.generationStartTime,
  ]);

  const handleDownload = () => {
    stableDiffusionStore.downloadImage();
  };

  if (!stableDiffusionStore.imageUrl && !stableDiffusionStore.isProcessing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Generated Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Generate an image to see the result here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Generated Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {stableDiffusionStore.isProcessing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Generating image...</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span>{(liveGenerationTime / 1000).toFixed(1)}s</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Generated Image */}
            {stableDiffusionStore.imageUrl && (
              <>
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={stableDiffusionStore.imageUrl || "/placeholder.svg"}
                      alt="Generated image"
                      className="w-full h-auto rounded-lg border shadow-sm"
                      style={{ maxHeight: "512px", objectFit: "contain" }}
                    />
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={handleDownload}
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Image
                  </Button>
                </div>

                <Separator />
              </>
            )}

            {/* Image Information */}
            <div className="space-y-4">
              <h4 className="font-medium">Generation Details</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Dimensions</span>
                  </div>
                  <Badge variant="secondary">
                    {stableDiffusionStore.width} × {stableDiffusionStore.height}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Steps</span>
                  </div>
                  <Badge variant="secondary">
                    {stableDiffusionStore.numInferenceSteps}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Guidance Scale</span>
                  <Badge variant="outline">
                    {stableDiffusionStore.guidanceScale.toFixed(1)}
                  </Badge>
                </div>

                {stableDiffusionStore.seed && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Seed</span>
                    </div>
                    <Badge variant="outline">{stableDiffusionStore.seed}</Badge>
                  </div>
                )}
              </div>

              {/* Generation Timer */}
              {stableDiffusionStore.generationDuration && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Generation Time</span>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    {stableDiffusionStore.getFormattedGenerationDuration()}
                  </Badge>
                </div>
              )}

              {/* Prompt Display */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Prompt</span>
                <div className="text-xs bg-muted p-3 rounded border">
                  {stableDiffusionStore.prompt}
                </div>
              </div>

              {stableDiffusionStore.negativePrompt && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Negative Prompt</span>
                  <div className="text-xs bg-muted p-3 rounded border">
                    {stableDiffusionStore.negativePrompt}
                  </div>
                </div>
              )}

              {stableDiffusionStore.messageId && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Message ID</span>
                  <code className="text-xs bg-muted p-2 rounded block break-all">
                    {stableDiffusionStore.messageId}
                  </code>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});

export default StableDiffusionOutput;
