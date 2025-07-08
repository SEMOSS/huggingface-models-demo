"use client";

import type React from "react";
import { observer } from "mobx-react-lite";
import { kokoroStore, type KokoroVoices } from "../../../stores/kokoroStore";
import { Button } from "../../../@providers/components/ui/button";
import { Textarea } from "../../../@providers/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../@providers/components/ui/select";
import { Slider } from "../../../@providers/components/ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../@providers/components/ui/card";
import { Label } from "../../../@providers/components/ui/label";
import { Loader2, Mic } from "lucide-react";

const voiceOptions: { value: KokoroVoices; label: string; gender: string }[] = [
  { value: "af_alloy", label: "Alloy", gender: "Female" },
  { value: "af_aoede", label: "Aoede", gender: "Female" },
  { value: "af_bella", label: "Bella", gender: "Female" },
  { value: "af_heart", label: "Heart", gender: "Female" },
  { value: "af_jessica", label: "Jessica", gender: "Female" },
  { value: "af_kore", label: "Kore", gender: "Female" },
  { value: "af_nicole", label: "Nicole", gender: "Female" },
  { value: "af_nova", label: "Nova", gender: "Female" },
  { value: "af_river", label: "River", gender: "Female" },
  { value: "af_sarah", label: "Sarah", gender: "Female" },
  { value: "sf_sky", label: "Sky", gender: "Female" },
  { value: "am_adam", label: "Adam", gender: "Male" },
  { value: "am_echo", label: "Echo", gender: "Male" },
  { value: "am_eric", label: "Eric", gender: "Male" },
  { value: "am_fenrir", label: "Fenrir", gender: "Male" },
  { value: "am_liam", label: "Liam", gender: "Male" },
  { value: "am_michael", label: "Michael", gender: "Male" },
  { value: "am_onyx", label: "Onyx", gender: "Male" },
  { value: "am_puck", label: "Puck", gender: "Male" },
  { value: "am_santa", label: "Santa", gender: "Male" },
];

const KokoroInput: React.FC = observer(() => {
  const handleGenerate = () => {
    kokoroStore.generateSpeech();
  };

  const handleReset = () => {
    kokoroStore.reset();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Text-to-Speech Input
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Text Input */}
        <div className="space-y-2">
          <Label htmlFor="text-input">Text to Convert</Label>
          <Textarea
            id="text-input"
            placeholder="Enter the text you want to convert to speech..."
            value={kokoroStore.textInput}
            onChange={(e) => kokoroStore.setTextInput(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={kokoroStore.isProcessing}
          />
          <div className="text-sm text-muted-foreground">
            {kokoroStore.textInput.length} characters
          </div>
        </div>

        {/* Voice Selection */}
        <div className="space-y-2">
          <Label htmlFor="voice-select">Voice</Label>
          <Select
            value={kokoroStore.selectedVoice}
            onValueChange={(value: KokoroVoices) =>
              kokoroStore.setSelectedVoice(value)
            }
            disabled={kokoroStore.isProcessing}
          >
            <SelectTrigger id="voice-select">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voiceOptions.map((voice) => (
                <SelectItem key={voice.value} value={voice.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{voice.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {voice.gender}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <Label htmlFor="speed-slider">
            Speed: {kokoroStore.speed.toFixed(1)}x
          </Label>
          <Slider
            id="speed-slider"
            min={0.1}
            max={2.0}
            step={0.1}
            value={[kokoroStore.speed]}
            onValueChange={(value) => kokoroStore.setSpeed(value[0])}
            disabled={kokoroStore.isProcessing}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.1x (Slow)</span>
            <span>2.0x (Fast)</span>
          </div>
        </div>

        {/* Error Display */}
        {kokoroStore.error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{kokoroStore.error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            disabled={kokoroStore.isProcessing || !kokoroStore.textInput.trim()}
            className="flex-1"
          >
            {kokoroStore.isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Speech"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={kokoroStore.isProcessing}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default KokoroInput;
