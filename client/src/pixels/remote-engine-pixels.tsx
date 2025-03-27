import { runPixel, partial } from "@semoss/sdk";

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
