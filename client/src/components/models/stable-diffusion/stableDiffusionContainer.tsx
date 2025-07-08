import React from "react";
import StableDiffusionBanner from "./stableDiffusionBanner";

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
        generating photo-realistic images given any text input.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* <FlorenceInput />
        <FlorenceOutput /> */}
      </div>
    </div>
  );
};

export default StableDiffusionContainer;
