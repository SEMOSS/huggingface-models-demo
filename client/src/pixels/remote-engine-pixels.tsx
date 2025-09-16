import { runPixel, partial } from "@semoss/sdk/react";

export const getMyRemoteModels = async () => {
  const { errors, pixelReturn } = await runPixel(`MyRemoteModelsStatus();`);

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }

  const { output } = pixelReturn[0];

  return output;
};

export const shutdownRemoteModel = async (modelId: string) => {
  const { errors, pixelReturn } = await runPixel(
    `RemoteModelShutdown ( engine = "${modelId}" ) ;`
  );

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }

  const { output } = pixelReturn[0];

  return output;
};

export const startRemoteModel = async (modelId: string) => {
  const { errors, pixelReturn } = await runPixel(
    `RemoteModelStart ( engine = "${modelId}" ) ;`
  );

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }

  const { output } = pixelReturn[0];

  return output;
};

export const visionAsk = async (
  engine: string,
  command: string,
  image: string
) => {
  const { errors, pixelReturn } = await runPixel(
    `Vision ( engine = "${engine}", command = "${command}", image = "${image}" ) ;`
  );

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }

  const { output } = pixelReturn[0];

  return output;
};

interface ImageGenerationParams {
  negative_prompt?: string;
  height?: number;
  width?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
  num_images?: number;
}

interface PixelResponse {
  errors: string[];
  pixelReturn: Array<{
    output: any;
  }>;
}

export const runTTSGeneration = async (
  engine: string,
  prompt: string,
  voice: string,
  speed: number = 1.0
) => {
  const params = {
    voice: voice,
    speed: speed.toString(),
  };

  const pixelCall = `LLM ( engine = "${engine}", command = "${prompt}", paramValues = [${JSON.stringify(
    params
  )}]) ;`;

  const { errors, pixelReturn }: PixelResponse = await runPixel(pixelCall);

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }

  const { output } = pixelReturn[0];

  console.log("TTS Generation Output:", output);

  return output;
};

export const imageGeneration = async (
  engine: string,
  prompt: string,
  options: ImageGenerationParams = {}
): Promise<any> => {
  const params: ImageGenerationParams = {};

  if (options.negative_prompt) params.negative_prompt = options.negative_prompt;
  if (options.height) params.height = options.height;
  if (options.width) params.width = options.width;
  if (options.num_inference_steps)
    params.num_inference_steps = options.num_inference_steps;
  if (options.guidance_scale) params.guidance_scale = options.guidance_scale;
  if (options.seed) params.seed = options.seed;
  if (options.num_images) params.num_images = options.num_images;
  let pixelCall = "";
  if (Object.keys(params).length === 0) {
    pixelCall = `LLM ( engine = "${engine}", command = "${prompt}" ) ;`;
  } else {
    pixelCall = `LLM ( engine = "${engine}", command = "${prompt}", paramValues = [${JSON.stringify(
      params
    )}]) ;`;
  }

  const { errors, pixelReturn }: PixelResponse = await runPixel(pixelCall);

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }

  const { output } = pixelReturn[0];

  return output;
};

export const runTranscribe = async (filePath: string, insightId: string) => {
  let pixelCall = `ExecuteFunctionEngine(engine = "5967ce22-ff0b-402c-8607-4bdcd2772633", map=[{"filePath":"${filePath}"}] );`;

  const { errors, pixelReturn }: PixelResponse = await runPixel(
    pixelCall,
    insightId
  );

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }

  const { output } = pixelReturn[0];

  return output;
};
