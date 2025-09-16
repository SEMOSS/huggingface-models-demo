import type React from "react";
import KokoroBanner from "./kokoroBanner";
import KokoroInput from "./kokoroInput";
import KokoroOutput from "./kokoroOutput";
import ModelDetails from "../../containers/model-details";

interface KokoroContainerProps {
  children?: React.ReactNode;
}

const KokoroContainer: React.FC<KokoroContainerProps> = ({ children }) => {
  const pythonExample = `from ai_server import ModelEngine
question = 'This is a test of the Kokoro82m model.'
model = ModelEngine(engine_id = "f8716fe5-34f5-43f4-9202-1e2191a5c2ba", insight_id = your_insightId)
output = model.ask(question = question, param_dict={"voice": "af_bella"})`;
  const pixelExample = `LLM ( engine = "f8716fe5-34f5-43f4-9202-1e2191a5c2ba", command = "This is a test of the Kokoro82m model. ", paramValues = [{"voice":"af_heart","speed":"1"}]) ;`;
  return (
    <div className="w-full h-full">
      <KokoroBanner />
      <div className="w-full p-4 bg-slate-50 border-b text-sm text-slate-700">
        Kokoro is an open-weight TTS model with 82 million parameters. Despite
        its lightweight architecture, it delivers comparable quality to larger
        models while being significantly faster and more cost-efficient.
        <span className="ml-2 text-slate-600 font-medium">
          ⏱️ Generation time is tracked and displayed for each request.
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <KokoroInput />
        <KokoroOutput />
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

export default KokoroContainer;
