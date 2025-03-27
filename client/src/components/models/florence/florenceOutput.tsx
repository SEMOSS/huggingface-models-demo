import type React from "react";
import { observer } from "mobx-react-lite";
import { florenceStore } from "../../../stores/florenceStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../@providers/components/ui/card";
import { Skeleton } from "../../../@providers/components/ui/skeleton";
import { Badge } from "../../../@providers/components/ui/badge";
import { Clipboard, Check, Image, Code } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../@providers/components/ui/tabs";
import { Button } from "../../../@providers/components/ui/button";

const FlorenceOutput: React.FC = observer(() => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"json" | "image">("json");
  const [hasImageOverlay, setHasImageOverlay] = useState(false);
  const [overlayImageUrl, setOverlayImageUrl] = useState<string | null>(null);
  const [formattedJson, setFormattedJson] = useState<string>("");

  useEffect(() => {
    if (florenceStore.result) {
      try {
        const resultObj = JSON.parse(florenceStore.result);
        setFormattedJson(JSON.stringify(resultObj, null, 2));

        if (resultObj && resultObj["overlay.png"]) {
          setHasImageOverlay(true);
          setOverlayImageUrl(resultObj["overlay.png"]);
          setActiveTab("image");
        } else {
          setHasImageOverlay(false);
          setOverlayImageUrl(null);
          setActiveTab("json");
        }
      } catch (e) {
        setHasImageOverlay(false);
        setOverlayImageUrl(null);
        setActiveTab("json");
      }
    } else {
      setHasImageOverlay(false);
      setOverlayImageUrl(null);
    }
  }, [florenceStore.result]);

  const copyToClipboard = () => {
    if (florenceStore.result) {
      navigator.clipboard.writeText(florenceStore.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Results</CardTitle>
        <div className="flex items-center gap-2">
          {florenceStore.result && (
            <Badge variant="outline" className="ml-2">
              {florenceStore.selectedMode}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {florenceStore.isProcessing ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : florenceStore.result ? (
          <div className="space-y-4">
            {hasImageOverlay ? (
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "json" | "image")}
                className="w-full"
              >
                <div className="flex justify-between items-center mb-2">
                  <TabsList>
                    <TabsTrigger
                      value="json"
                      className="flex items-center gap-1"
                    >
                      <Code size={14} />
                      JSON
                    </TabsTrigger>
                    <TabsTrigger
                      value="image"
                      className="flex items-center gap-1"
                    >
                      <Image size={14} />
                      Image
                    </TabsTrigger>
                  </TabsList>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={16} /> : <Clipboard size={16} />}
                  </Button>
                </div>

                <TabsContent value="json" className="mt-0">
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap break-words overflow-x-auto">
                        {formattedJson}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="image" className="mt-0">
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex flex-col items-center">
                      {overlayImageUrl && (
                        <img
                          src={overlayImageUrl || "/placeholder.svg"}
                          alt="Model output visualization"
                          className="max-w-full rounded-md"
                        />
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Visualization generated by Florence-2 model
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="relative">
                <div className="absolute top-0 right-0">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={16} /> : <Clipboard size={16} />}
                  </button>
                </div>
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Model Output</h3>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap break-words overflow-x-auto">
                      {florenceStore.result}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
              <span className="text-xs text-muted-foreground">
                Processed with {florenceStore.selectedMode} mode
                {florenceStore.additionalText && ` and additional context`}
                {hasImageOverlay && `, visualization available`}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-4">
            <div className="rounded-full bg-muted p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <p className="text-center">Run the model to see results</p>
            <p className="text-xs text-center max-w-xs">
              Select an image and mode, then click the Run button to process
              with Florence-2
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default FlorenceOutput;
