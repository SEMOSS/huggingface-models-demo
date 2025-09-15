import type React from "react";
import { useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useInsight } from "@semoss/sdk-react";
import { Button } from "../../../@providers/components/ui/button";
import { Label } from "../../../@providers/components/ui/label";
import { Card, CardContent } from "../../../@providers/components/ui/card";
import { Upload, Mic, Square, Play, Pause } from "lucide-react";
import whisperStore from "../../../stores/whisperStore";

const WhisperInput: React.FC = observer(() => {
  const { actions } = useInsight();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] =
    useState<NodeJS.Timeout | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const uploadToSemoss = async (localFile: File) => {
    const upload = await actions.upload(localFile, "audio-file");

    if (!upload || upload.length === 0) {
      throw new Error("Upload failed");
    }

    const docLocation = upload[0].fileLocation;
    const uploadedFilePath = docLocation.replace(/\\/g, "/");

    return uploadedFilePath;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (file) {
      if (!file.type.startsWith("audio/")) {
        setUploadError("Please upload a valid audio file.");
        return;
      }

      try {
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
        setRecordedAudio(null);

        const filePath = await uploadToSemoss(file);
        whisperStore.setAudioFile(filePath);
      } catch (error) {
        console.error("Error processing uploaded file:", error);
        setUploadError(
          "Failed to process the audio file. Please try another file."
        );
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setRecordedAudio(blob);

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const file = new File([blob], "recording.webm", { type: "audio/webm" });
        try {
          const filePath = await uploadToSemoss(file);
          whisperStore.setAudioFile(filePath);
        } catch (error) {
          console.error("Error uploading recorded audio:", error);
          setUploadError("Failed to upload recorded audio.");
        }

        // Clean up
        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
    } catch (error) {
      console.error("Error starting recording:", error);
      setUploadError("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRun = () => {
    if (!whisperStore.audioFilePath) {
      setUploadError("Please upload an audio file or record audio first.");
      return;
    }

    setUploadError(null);
    whisperStore.transcribeAudio(whisperStore.audioFilePath);
  };

  const handleReset = () => {
    setUploadError(null);
    setRecordedAudio(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }
    whisperStore.reset();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Audio Upload/Recording Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Audio</Label>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
              <div className="absolute inset-0 flex items-center justify-center">
                {audioUrl && (
                  <div className="flex flex-col items-center space-y-4 w-full p-4">
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full"
                      controls
                    />
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={togglePlayback}
                        className="flex items-center gap-2 bg-transparent"
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        {isPlaying ? "Pause" : "Play"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={triggerFileInput}
                      className="flex items-center gap-2 bg-transparent"
                      disabled={isRecording}
                    >
                      <Upload size={16} />
                      Upload
                    </Button>
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      onClick={isRecording ? stopRecording : startRecording}
                      className="flex items-center gap-2"
                    >
                      {isRecording ? <Square size={16} /> : <Mic size={16} />}
                      {isRecording ? "Stop" : "Record"}
                    </Button>
                  </div>
                  {isRecording && (
                    <div className="text-sm text-red-600 font-medium">
                      Recording: {formatTime(recordingTime)}
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="audio/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {uploadError && (
              <div className="text-sm font-medium text-red-500">
                {uploadError}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handleRun}
              disabled={whisperStore.isProcessing || isRecording}
              className="flex-1"
            >
              {whisperStore.isProcessing ? "Transcribing..." : "Transcribe"}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 bg-transparent"
              disabled={isRecording}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default WhisperInput;
