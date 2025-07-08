"use client";

import React, { useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { kokoroStore } from "../../../stores/kokoroStore";
import { Button } from "../../../@providers/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../@providers/components/ui/card";
import { Badge } from "../../../@providers/components/ui/badge";
import { Separator } from "../../../@providers/components/ui/separator";
import {
  Play,
  Pause,
  Download,
  Volume2,
  Clock,
  Zap,
  Timer,
} from "lucide-react";

const KokoroOutput: React.FC = observer(() => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [liveGenerationTime, setLiveGenerationTime] = React.useState(0);

  // Live timer effect for generation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (kokoroStore.isProcessing && kokoroStore.generationStartTime) {
      interval = setInterval(() => {
        setLiveGenerationTime(Date.now() - kokoroStore.generationStartTime!);
      }, 100); // Update every 100ms for smooth timer
    } else {
      setLiveGenerationTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [kokoroStore.isProcessing, kokoroStore.generationStartTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [kokoroStore.audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Number.parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleDownload = () => {
    kokoroStore.downloadAudio();
  };

  if (!kokoroStore.audioUrl && !kokoroStore.isProcessing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio Output
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Volume2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Generate speech to see the audio output here
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
          <Volume2 className="h-5 w-5" />
          Audio Output
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {kokoroStore.isProcessing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <Volume2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Generating speech...</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span>{(liveGenerationTime / 1000).toFixed(1)}s</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Audio Player */}
            {kokoroStore.audioUrl && (
              <>
                <audio
                  ref={audioRef}
                  src={kokoroStore.audioUrl}
                  preload="metadata"
                />

                {/* Playback Controls */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button
                      size="sm"
                      onClick={togglePlayPause}
                      className="flex items-center gap-2"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownload}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Audio Information */}
            <div className="space-y-4">
              <h4 className="font-medium">Audio Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <Badge variant="secondary">
                    {kokoroStore.duration
                      ? `${kokoroStore.duration.toFixed(1)}s`
                      : "N/A"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Sample Rate</span>
                  </div>
                  <Badge variant="secondary">
                    {kokoroStore.sampleRate
                      ? `${kokoroStore.sampleRate} Hz`
                      : "N/A"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Voice</span>
                <Badge variant="outline">{kokoroStore.selectedVoice}</Badge>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Speed</span>
                <Badge variant="outline">{kokoroStore.speed.toFixed(1)}x</Badge>
              </div>

              {/* Generation Timer */}
              {kokoroStore.generationDuration && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Generation Time</span>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    {kokoroStore.getFormattedGenerationDuration()}
                  </Badge>
                </div>
              )}

              {kokoroStore.messageId && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Message ID</span>
                  <code className="text-xs bg-muted p-2 rounded block break-all">
                    {kokoroStore.messageId}
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

export default KokoroOutput;
