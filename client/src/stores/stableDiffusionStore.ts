import { makeAutoObservable } from "mobx";
import { imageGeneration } from "../pixels/remote-engine-pixels";

export interface StableDiffusionParams {
  negative_prompt?: string;
  height?: number;
  width?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
  num_images?: number;
}

export class StableDiffusionStore {
  // Input parameters
  prompt = "";
  negativePrompt =
    "low quality, blurry, distorted, disfigured, text, watermark";
  height = 512;
  width = 512;
  numInferenceSteps = 30;
  guidanceScale = 7.5;
  seed: number | null = null;
  numImages = 1;

  // State management
  isProcessing = false;
  imageData: string | null = null;
  imageUrl: string | null = null;
  error: string | null = null;
  messageId: string | null = null;

  // Timer properties
  generationStartTime: number | null = null;
  generationEndTime: number | null = null;
  generationDuration: number | null = null;

  // Response data
  responseData: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Setters
  setPrompt(prompt: string) {
    this.prompt = prompt;
  }

  setNegativePrompt(negativePrompt: string) {
    this.negativePrompt = negativePrompt;
  }

  setHeight(height: number) {
    this.height = Math.max(256, Math.min(1024, height));
  }

  setWidth(width: number) {
    this.width = Math.max(256, Math.min(1024, width));
  }

  setNumInferenceSteps(steps: number) {
    this.numInferenceSteps = Math.max(1, Math.min(100, steps));
  }

  setGuidanceScale(scale: number) {
    this.guidanceScale = Math.max(1, Math.min(20, scale));
  }

  setSeed(seed: number | null) {
    this.seed = seed;
  }

  setNumImages(num: number) {
    this.numImages = Math.max(1, Math.min(4, num));
  }

  setIsProcessing(processing: boolean) {
    this.isProcessing = processing;
  }

  setError(error: string | null) {
    this.error = error;
  }

  reset() {
    this.prompt = "";
    this.negativePrompt =
      "low quality, blurry, distorted, disfigured, text, watermark";
    this.height = 512;
    this.width = 512;
    this.numInferenceSteps = 30;
    this.guidanceScale = 7.5;
    this.seed = null;
    this.numImages = 1;
    this.isProcessing = false;
    this.imageData = null;
    this.imageUrl = null;
    this.error = null;
    this.messageId = null;
    this.generationStartTime = null;
    this.generationEndTime = null;
    this.generationDuration = null;
    this.responseData = null;
  }

  private sanitizeText(text: string): string {
    return text.replace(/"/g, "'");
  }

  async generateImage() {
    if (!this.prompt.trim()) {
      this.setError("Please enter a prompt to generate an image");
      return;
    }

    this.setIsProcessing(true);
    this.setError(null);

    // Start timing the generation
    this.generationStartTime = Date.now();
    this.generationEndTime = null;
    this.generationDuration = null;

    try {
      const sanitizedPrompt = this.sanitizeText(this.prompt);
      const params: StableDiffusionParams = {
        negative_prompt: this.negativePrompt,
        height: this.height,
        width: this.width,
        num_inference_steps: this.numInferenceSteps,
        guidance_scale: this.guidanceScale,
        num_images: this.numImages,
      };

      if (this.seed !== null) {
        params.seed = this.seed;
      }

      const result = await imageGeneration(
        "2c51591c-2d5e-4702-9d55-4b96dfb156c8",
        sanitizedPrompt,
        params
      );

      console.log("Image Generation Result:", result);

      this.responseData = result.response;
      this.messageId = result.messageId;

      // Extract image data from the new response structure
      if (
        this.responseData &&
        this.responseData.images &&
        this.responseData.images.length > 0
      ) {
        // The image is directly available as a data URL
        this.imageData = this.responseData.images[0];
        this.imageUrl = this.imageData;
      }

      // Calculate generation duration on success
      this.generationEndTime = Date.now();
      this.generationDuration =
        this.generationEndTime - (this.generationStartTime || 0);
    } catch (error) {
      console.error("Error generating image:", error);
      this.setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );

      // Calculate generation duration on error
      this.generationEndTime = Date.now();
      this.generationDuration =
        this.generationEndTime - (this.generationStartTime || 0);
    } finally {
      this.setIsProcessing(false);
    }
  }

  downloadImage() {
    if (!this.imageData) return;

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = this.imageData;
    link.download = `stable-diffusion-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Helper method to format generation duration
  getFormattedGenerationDuration(): string | null {
    if (this.generationDuration === null) return null;
    const seconds = (this.generationDuration / 1000).toFixed(2);
    return `${seconds}s`;
  }

  // Generate random seed
  generateRandomSeed() {
    this.seed = Math.floor(Math.random() * 1000000);
  }
}

export const stableDiffusionStore = new StableDiffusionStore();
