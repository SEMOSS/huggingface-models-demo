"use client";

import type React from "react";
import { observer } from "mobx-react-lite";
import whisperStore from "../../../stores/whisperStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../@providers/components/ui/card";
import { Skeleton } from "../../../@providers/components/ui/skeleton";
import { Badge } from "../../../@providers/components/ui/badge";
import { Clipboard, Check, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../@providers/components/ui/button";

const WhisperOutput: React.FC = observer(() => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (whisperStore.transcriptionResult) {
      navigator.clipboard.writeText(whisperStore.transcriptionResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Transcription Results</CardTitle>
        <div className="flex items-center gap-2">
          {whisperStore.transcriptionResult && (
            <Badge variant="outline" className="ml-2">
              Whisper Large v3
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {whisperStore.isProcessing ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : whisperStore.transcriptionResult ? (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute top-0 right-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={16} /> : <Clipboard size={16} />}
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <FileText size={16} />
                    Transcription
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap break-words text-balance leading-relaxed">
                    {whisperStore.transcriptionResult}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
              <span className="text-xs text-muted-foreground">
                Transcribed with Whisper Large v3 model
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-4">
            <div className="rounded-full bg-muted p-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-center">
              Upload or record audio to see transcription
            </p>
            <p className="text-xs text-center max-w-xs">
              Upload an audio file or record directly in your browser, then
              click Transcribe to convert speech to text
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default WhisperOutput;
