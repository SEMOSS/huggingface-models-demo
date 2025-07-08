import type React from "react";
import KokoroBanner from "./kokoroBanner";
import KokoroInput from "./kokoroInput";
import KokoroOutput from "./kokoroOutput";

interface KokoroContainerProps {
  children?: React.ReactNode;
}

const KokoroContainer: React.FC<KokoroContainerProps> = ({ children }) => {
  return (
    <div className="w-full h-full">
      <KokoroBanner />
      <div className="w-full p-4 bg-slate-50 border-b text-sm text-slate-700">
        Kokoro is an open-weight TTS model with 82 million parameters. Despite
        its lightweight architecture, it delivers comparable quality to larger
        models while being significantly faster and more cost-efficient.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <KokoroInput />
        <KokoroOutput />
      </div>
    </div>
  );
};

export default KokoroContainer;
