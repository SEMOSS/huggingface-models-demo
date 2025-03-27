import React from "react";
import FlorenceBanner from "./florenceBanner";
import FlorenceInput from "./florenceInput";
import FlorenceOutput from "./florenceOutput";

interface FlorenceContainerProps {
  children?: React.ReactNode;
}

const FlorenceContainer: React.FC<FlorenceContainerProps> = ({ children }) => {
  return (
    <div className="w-full h-full">
      <FlorenceBanner />
      <div className="w-full p-4 bg-slate-50 border-b text-sm text-slate-700">
        Florence-2 is an advanced vision foundation model using a prompt-based
        approach to handle a wide range of vision and vision-language tasks. It
        can interpret simple text prompts to perform tasks like captioning,
        object detection and segmentation.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <FlorenceInput />
        <FlorenceOutput />
      </div>
    </div>
  );
};

export default FlorenceContainer;
