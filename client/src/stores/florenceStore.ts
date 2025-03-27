import { makeAutoObservable } from "mobx";
import { visionAsk } from "../pixels/remote-engine-pixels";

export type FlorenceMode =
  | "caption"
  | "detailed caption"
  | "more detailed caption"
  | "od"
  | "dense region caption"
  | "region proposal"
  | "caption to phrase grounding"
  | "referring expression segmentation"
  | "region to segmentation"
  | "ocr"
  | "ocr with region";

export class FlorenceStore {
  selectedMode: FlorenceMode = "caption";
  imageUrl =
    "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/transformers/tasks/car.jpg?download=true";
  userUploadedImage = false;
  imageBase64: string | null = null;
  additionalText = "";
  isProcessing = false;
  result: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setBase64Image(base64: string) {
    this.imageBase64 = base64;
    this.userUploadedImage = true;
  }

  setSelectedMode(mode: FlorenceMode) {
    this.selectedMode = mode;
  }

  setImageUrl(url: string) {
    this.imageUrl = url;
    this.userUploadedImage = true;
    this.imageBase64 = null;
  }

  async setImageFromFile(file: File) {
    this.setIsProcessing(true);
    try {
      const reader = new FileReader();

      const base64Result = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to convert file to base64"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

      this.imageBase64 = base64Result;
      this.userUploadedImage = true;

      this.imageUrl = URL.createObjectURL(file);

      console.log("Image converted to base64 successfully");
    } catch (error) {
      console.error("Error converting file to base64:", error);
    } finally {
      this.setIsProcessing(false);
    }
  }

  setAdditionalText(text: string) {
    this.additionalText = text;
  }

  setIsProcessing(processing: boolean) {
    this.isProcessing = processing;
  }

  reset() {
    this.selectedMode = "caption";
    this.imageUrl =
      "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/transformers/tasks/car.jpg?download=true";
    this.userUploadedImage = false;
    this.imageBase64 = null;
    this.additionalText = "";
    this.isProcessing = false;
    this.result = null;
  }

  needsAdditionalText(): boolean {
    return [
      "caption to phrase grounding",
      "referring expression segmentation",
      "region to segmentation",
    ].includes(this.selectedMode);
  }

  async processImage() {
    this.setIsProcessing(true);

    const modeToTagMap: Record<FlorenceMode, string> = {
      caption: "<CAPTION>",
      "detailed caption": "<DETAILED_CAPTION>",
      "more detailed caption": "<MORE_DETAILED_CAPTION>",
      od: "<OD>",
      "dense region caption": "<DENSE_REGION_CAPTION>",
      "region proposal": "<REGION_PROPOSAL>",
      "caption to phrase grounding": "<CAPTION_TO_PHRASE_GROUNDING>",
      "referring expression segmentation":
        "<REFERRING_EXPRESSION_SEGMENTATION>",
      "region to segmentation": "<REGION_TO_SEGMENTATION>",
      ocr: "<OCR>",
      "ocr with region": "<OCR_WITH_REGION>",
    };

    const modeTag = modeToTagMap[this.selectedMode];

    let fullPrompt = modeTag;
    if (this.needsAdditionalText() && this.additionalText) {
      fullPrompt += " " + this.additionalText;
    }

    try {
      let imageSource;

      if (this.imageBase64) {
        imageSource = this.imageBase64;
        console.log("Using base64 image data");
      } else {
        imageSource = this.imageUrl;
        console.log("Using image URL:", this.imageUrl);
      }

      console.log("Sending request with prompt:", fullPrompt);

      const result = await visionAsk(
        "f7dd0ae0-b31c-45d4-906c-044bd217d829",
        fullPrompt,
        imageSource
      );
      //@ts-ignore
      const output = result.response;
      if (output) {
        this.result = output;
        console.log("Received result:", output);
      } else {
        console.warn("Response received but no output data found");
        this.result = "No output received from model";
      }
    } catch (error) {
      console.error("Error processing image:", error);
      // @ts-ignore
      this.result = `Error: ${error.message || "Unknown error occurred"}`;
    } finally {
      this.setIsProcessing(false);
    }
  }
}

export const florenceStore = new FlorenceStore();
