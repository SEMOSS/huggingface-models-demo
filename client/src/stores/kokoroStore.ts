import { makeAutoObservable } from "mobx";
import { runTTSGeneration } from "../pixels/remote-engine-pixels";

export type KokoroVoices =
  | "af_heart"
  | "af_alloy"
  | "af_aoede"
  | "af_bella"
  | "af_jessica"
  | "af_kore"
  | "af_nicole"
  | "af_nova"
  | "af_river"
  | "af_sarah"
  | "sf_sky"
  | "am_adam"
  | "am_echo"
  | "am_eric"
  | "am_fenrir"
  | "am_liam"
  | "am_michael"
  | "am_onyx"
  | "am_puck"
  | "am_santa";

export class KokoroStore {
  selectedVoice: KokoroVoices = "af_heart";
  speed = 1.0;
  textInput = "";
  isProcessing = false;
  audioData: string | null = null;
  audioUrl: string | null = null;
  duration: number | null = null;
  sampleRate: number | null = null;
  messageId: string | null = null;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedVoice(voice: KokoroVoices) {
    this.selectedVoice = voice;
  }

  setSpeed(speed: number) {
    this.speed = Math.max(0.1, Math.min(2.0, speed));
  }

  setTextInput(text: string) {
    this.textInput = text;
  }

  setIsProcessing(processing: boolean) {
    this.isProcessing = processing;
  }

  setError(error: string | null) {
    this.error = error;
  }

  private sanitizeText(text: string): string {
    return text.replace(/"/g, "'");
  }

  reset() {
    this.selectedVoice = "af_bella";
    this.speed = 1.0;
    this.textInput = "";
    this.isProcessing = false;
    this.audioData = null;
    this.audioUrl = null;
    this.duration = null;
    this.sampleRate = null;
    this.messageId = null;
    this.error = null;
  }

  private base64ToBlob(base64Data: string): Blob {
    const base64 = base64Data.replace(/^data:audio\/wav;base64,/, "");
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "audio/wav" });
  }

  async generateSpeech() {
    if (!this.textInput.trim()) {
      this.setError("Please enter some text to convert to speech");
      return;
    }

    this.setIsProcessing(true);
    this.setError(null);

    try {
      const sanitizedText = this.sanitizeText(this.textInput);

      const result = await runTTSGeneration(
        "f8716fe5-34f5-43f4-9202-1e2191a5c2ba",
        sanitizedText,
        this.selectedVoice,
        this.speed
      );

      const response = result;

      const ttsResponse = response.response;

      this.audioData = ttsResponse.audio_data;
      this.duration = ttsResponse.duration;
      this.sampleRate = ttsResponse.sample_rate;
      this.messageId = response.messageId;

      if (this.audioData) {
        const blob = this.base64ToBlob(this.audioData);
        this.audioUrl = URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error("Error generating speech:", error);
      this.setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      this.setIsProcessing(false);
    }
  }

  downloadAudio() {
    if (!this.audioData) return;

    const blob = this.base64ToBlob(this.audioData);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kokoro-tts-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const kokoroStore = new KokoroStore();
