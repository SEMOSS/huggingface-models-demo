import { makeAutoObservable } from "mobx";
import { runTranscribe } from "../pixels/remote-engine-pixels";

class WhisperStore {
  transcriptionResult: string | null = null;
  isProcessing = false;
  audioFilePath: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAudioFile(filePath: string) {
    this.audioFilePath = filePath;
  }

  setIsProcessing(processing: boolean) {
    this.isProcessing = processing;
  }

  async transcribeAudio(filePath: string, insightId: string) {
    this.setIsProcessing(true);
    try {
      this.transcriptionResult = await runTranscribe(filePath, insightId);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      this.transcriptionResult = `Error: ${
        error instanceof Error ? error.message : "Unknown error occurred"
      }`;
    } finally {
      this.setIsProcessing(false);
    }
  }

  reset() {
    this.transcriptionResult = null;
    this.isProcessing = false;
    this.audioFilePath = null;
  }
}

const whisperStore = new WhisperStore();
export default whisperStore;
