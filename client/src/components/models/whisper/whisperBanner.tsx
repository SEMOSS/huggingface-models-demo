import { observer } from "mobx-react-lite";
import { SiAudiomack } from "react-icons/si";
import { cn } from "../../../@providers/lib/utils";
import { Card } from "../../../@providers/components/ui/card";
import { GrWindows } from "react-icons/gr";

export const WhisperBanner = observer(() => {
  return (
    <Card className="w-full flex items-center justify-between px-6 py-3 bg-background">
      {/* Left side - Speech-To-Text with icon */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <SiAudiomack className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">Speech-To-Text</span>
      </div>

      {/* Middle - Florence */}
      <div className="text-xl font-bold flex justify-center items-center">
        {" "}
        <GrWindows className="mr-2 size-4" />
        <span>Whisper V3</span>
      </div>

      {/* Right side - Model Status */}
      {/* Model is a function engine :( */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Function Engine</span>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-3 w-3 rounded-full",
              "bg-green-500",
              "shadow-[0_0_8px_2px]",
              "shadow-green-500/50"
            )}
          />
          {/* <span className="font-semibold">{modelState}</span> */}
        </div>
      </div>
    </Card>
  );
});

export default WhisperBanner;
