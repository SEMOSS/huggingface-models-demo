import { runPixel, partial } from "@semoss/sdk";

export const getUserProjectList = async () => {
  const { errors, pixelReturn } = await runPixel(`GetProjectList();`);

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }
  const { output } = pixelReturn[0];

  return output;
};

export const getUserInfo = async () => {
  const { errors, pixelReturn } = await runPixel(`GetUserInfo();`);

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }
  const { output } = pixelReturn[0];

  return output;
};

export const getOpenInsights = async () => {
  const { errors, pixelReturn } = await runPixel(`MyOpenInsights();`);

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }
  const { output } = pixelReturn[0];

  return output;
};

export const getAvailableEngines = async () => {
  const { errors, pixelReturn } = await runPixel(
    `MyEngines ( engineTypes = [ "MODEL" ] ) ;`
  );

  if (errors.length > 0) {
    throw new Error(errors.join(""));
  }
  const { output } = pixelReturn[0];

  return output;
};
