"use client";

import React from "react";
import { observer } from "mobx-react-lite";
import { stableDiffusionStore } from "../../../stores/stableDiffusionStore";
import { Button } from "../../../@providers/components/ui/button";
import { Textarea } from "../../../@providers/components/ui/textarea";
import { Input } from "../../../@providers/components/ui/input";
import { Slider } from "../../../@providers/components/ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../@providers/components/ui/card";
import { Label } from "../../../@providers/components/ui/label";
import { Separator } from "../../../@providers/components/ui/separator";
import { Loader2, ImageIcon, Shuffle, RotateCcw, Settings } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../@providers/components/ui/collapsible";

const StableDiffusionInput: React.FC = observer(() => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleGenerate = () => {
    stableDiffusionStore.generateImage();
  };

  const handleReset = () => {
    stableDiffusionStore.reset();
  };

  const handleRandomSeed = () => {
    stableDiffusionStore.generateRandomSeed();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image Generation Input
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prompt Input */}
        <div className="space-y-2">
          <Label htmlFor="prompt-input">Prompt</Label>
          <Textarea
            id="prompt-input"
            placeholder="A photo of a cat in space, wearing an astronaut helmet"
            value={stableDiffusionStore.prompt}
            onChange={(e) => stableDiffusionStore.setPrompt(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={stableDiffusionStore.isProcessing}
          />
          <div className="text-sm text-muted-foreground">
            {stableDiffusionStore.prompt.length} characters
          </div>
        </div>

        {/* Negative Prompt */}
        <div className="space-y-2">
          <Label htmlFor="negative-prompt-input">Negative Prompt</Label>
          <Textarea
            id="negative-prompt-input"
            placeholder="low quality, blurry, distorted..."
            value={stableDiffusionStore.negativePrompt}
            onChange={(e) =>
              stableDiffusionStore.setNegativePrompt(e.target.value)
            }
            className="min-h-[80px] resize-none"
            disabled={stableDiffusionStore.isProcessing}
          />
        </div>

        <Separator />

        {/* Basic Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width-input">Width</Label>
            <Input
              id="width-input"
              type="number"
              min="256"
              max="1024"
              step="64"
              value={stableDiffusionStore.width}
              onChange={(e) =>
                stableDiffusionStore.setWidth(Number(e.target.value))
              }
              disabled={stableDiffusionStore.isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height-input">Height</Label>
            <Input
              id="height-input"
              type="number"
              min="256"
              max="1024"
              step="64"
              value={stableDiffusionStore.height}
              onChange={(e) =>
                stableDiffusionStore.setHeight(Number(e.target.value))
              }
              disabled={stableDiffusionStore.isProcessing}
            />
          </div>
        </div>

        {/* Advanced Parameters */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full bg-transparent">
              <Settings className="mr-2 h-4 w-4" />
              Advanced Parameters
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Inference Steps */}
            <div className="space-y-2">
              <Label htmlFor="steps-slider">
                Inference Steps: {stableDiffusionStore.numInferenceSteps}
              </Label>
              <Slider
                id="steps-slider"
                min={1}
                max={100}
                step={1}
                value={[stableDiffusionStore.numInferenceSteps]}
                onValueChange={(value) =>
                  stableDiffusionStore.setNumInferenceSteps(value[0])
                }
                disabled={stableDiffusionStore.isProcessing}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 (Fast)</span>
                <span>100 (High Quality)</span>
              </div>
            </div>

            {/* Guidance Scale */}
            <div className="space-y-2">
              <Label htmlFor="guidance-slider">
                Guidance Scale: {stableDiffusionStore.guidanceScale.toFixed(1)}
              </Label>
              <Slider
                id="guidance-slider"
                min={1}
                max={20}
                step={0.5}
                value={[stableDiffusionStore.guidanceScale]}
                onValueChange={(value) =>
                  stableDiffusionStore.setGuidanceScale(value[0])
                }
                disabled={stableDiffusionStore.isProcessing}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1.0 (Creative)</span>
                <span>20.0 (Strict)</span>
              </div>
            </div>

            {/* Seed */}
            <div className="space-y-2">
              <Label htmlFor="seed-input">Seed (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="seed-input"
                  type="number"
                  placeholder="Random seed"
                  value={stableDiffusionStore.seed || ""}
                  onChange={(e) =>
                    stableDiffusionStore.setSeed(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  disabled={stableDiffusionStore.isProcessing}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRandomSeed}
                  disabled={stableDiffusionStore.isProcessing}
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Number of Images */}
            <div className="space-y-2">
              <Label htmlFor="num-images-input">Number of Images</Label>
              <Input
                id="num-images-input"
                type="number"
                min="1"
                max="4"
                value={stableDiffusionStore.numImages}
                onChange={(e) =>
                  stableDiffusionStore.setNumImages(Number(e.target.value))
                }
                disabled={stableDiffusionStore.isProcessing}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Error Display */}
        {stableDiffusionStore.error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">
              {stableDiffusionStore.error}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            disabled={
              stableDiffusionStore.isProcessing ||
              !stableDiffusionStore.prompt.trim()
            }
            className="flex-1"
          >
            {stableDiffusionStore.isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Image"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={stableDiffusionStore.isProcessing}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default StableDiffusionInput;
