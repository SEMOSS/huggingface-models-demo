import type React from "react";
import StableDiffusionBanner from "./stableDiffusionBanner";
import StableDiffusionInput from "./stableDiffusionInput";
import StableDiffusionOutput from "./stableDiffusionOutput";

interface StableDiffusionContainerProps {
  children?: React.ReactNode;
}

const StableDiffusionContainer: React.FC<StableDiffusionContainerProps> = ({
  children,
}) => {
  return (
    <div className="w-full h-full">
      <StableDiffusionBanner />
      <div className="w-full p-4 bg-slate-50 border-b text-sm text-slate-700">
        Stable Diffusion is a latent text-to-image diffusion model capable of
        generating photo-realistic images given any text input. Adjust the
        parameters to fine-tune your image generation.
        <span className="ml-2 text-slate-600 font-medium">
          ⏱️ Generation time is tracked and displayed for each request.
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <StableDiffusionInput />
        <StableDiffusionOutput />
      </div>
    </div>
  );
};

export default StableDiffusionContainer;
