import React from "react";
import WhisperBanner from "./whisperBanner";
import WhisperInput from "./whisperInput";
import WhisperOutput from "./whisperOutput";
import ModelDetails from "../../containers/model-details";

interface WhisperContainerProps {
  children?: React.ReactNode;
}

const WhisperContainer: React.FC<WhisperContainerProps> = ({ children }) => {
  const pythonExample = `from gaas_gpt_function import FunctionEngine 
function = FunctionEngine(engine_id = "5967ce22-ff0b-402c-8607-4bdcd2772633", insight_id = your_insightId)
output = function.execute({"filePath":"string"})`;
  const pixelExample = `ExecuteFunctionEngine(engine = "5967ce22-ff0b-402c-8607-4bdcd2772633", map=[{"filePath":"/path-to/file.wav"}] );`;
  return (
    <div className="w-full h-full">
      <WhisperBanner />
      <div className="w-full p-4 bg-slate-50 border-b text-sm text-slate-700">
        This model is used to transcribe short-form audio files and is designed
        to be compatible with OpenAI's sequential long-form transcription
        algorithm. Whisper is a pre-trained model for automatic speech
        recognition (ASR) and speech translation. Trained on 680k hours of
        labeled data, Whisper models demonstrate a strong ability to generalize
        to many datasets and domains without the need for fine-tuning.
        Whisper-large-v3 is one of the 5 configurations of the model with 1550M
        parameters.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <WhisperInput />
        <WhisperOutput />
      </div>
      <div className="p-4">
        <ModelDetails
          modelType="Function Engine"
          pythonExample={pythonExample}
          pixelExample={pixelExample}
        />
      </div>
    </div>
  );
};

export default WhisperContainer;
