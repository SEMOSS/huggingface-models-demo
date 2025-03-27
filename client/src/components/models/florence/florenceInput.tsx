import type React from "react";
import { useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  florenceStore,
  type FlorenceMode,
} from "../../../stores/florenceStore";
import { Button } from "../../../@providers/components/ui/button";
import { Input } from "../../../@providers/components/ui/input";
import { Label } from "../../../@providers/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../@providers/components/ui/select";
import { Card, CardContent } from "../../../@providers/components/ui/card";
import { Upload, LinkIcon } from "lucide-react";

const FlorenceInput: React.FC = observer(() => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (file) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Please upload a valid image file.");
        return;
      }

      try {
        await florenceStore.setImageFromFile(file);
      } catch (error) {
        console.error("Error processing uploaded file:", error);
        setUploadError("Failed to process the image. Please try another file.");
      }
    }
  };

  const handleUrlSubmit = () => {
    setUploadError(null);
    if (tempUrl) {
      if (!tempUrl.match(/^https?:\/\/.+/i)) {
        setUploadError(
          "Please enter a valid URL starting with http:// or https://"
        );
        return;
      }

      florenceStore.setImageUrl(tempUrl);
      setShowUrlInput(false);
      setTempUrl("");
    }
  };

  const handleRun = () => {
    if (!florenceStore.imageUrl && !florenceStore.imageBase64) {
      setUploadError("Please upload an image or provide a URL first.");
      return;
    }

    if (florenceStore.needsAdditionalText() && !florenceStore.additionalText) {
      setUploadError(
        "Please provide the additional text required for this mode."
      );
      return;
    }

    setUploadError(null);
    florenceStore.processImage();
  };

  const handleReset = () => {
    setUploadError(null);
    florenceStore.reset();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Image</Label>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
              <div className="absolute inset-0 flex items-center justify-center">
                {florenceStore.imageUrl && (
                  <img
                    src={florenceStore.imageUrl}
                    alt="Input image"
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={triggerFileInput}
                      className="flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Upload
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="flex items-center gap-2"
                    >
                      <LinkIcon size={16} />
                      URL
                    </Button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {uploadError && (
              <div className="text-sm font-medium text-red-500">
                {uploadError}
              </div>
            )}

            {showUrlInput && (
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Enter image URL"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                />
                <Button onClick={handleUrlSubmit}>Set</Button>
              </div>
            )}
          </div>

          {/* Mode Selection Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="mode-select" className="text-base font-medium">
              Mode
            </Label>
            <Select
              value={florenceStore.selectedMode}
              onValueChange={(value) =>
                florenceStore.setSelectedMode(value as FlorenceMode)
              }
            >
              <SelectTrigger id="mode-select" className="w-full">
                <SelectValue placeholder="Select a mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="caption">Caption</SelectItem>
                <SelectItem value="detailed caption">
                  Detailed Caption
                </SelectItem>
                <SelectItem value="more detailed caption">
                  More Detailed Caption
                </SelectItem>
                <SelectItem value="od">OD</SelectItem>
                <SelectItem value="dense region caption">
                  Dense Region Caption
                </SelectItem>
                <SelectItem value="regional proposal">
                  Regional Proposal
                </SelectItem>
                <SelectItem value="caption to phrase grounding">
                  Caption to Phrase Grounding
                </SelectItem>
                <SelectItem value="referring expression segmentation">
                  Referring Expression Segmentation
                </SelectItem>
                <SelectItem value="region to segmentation">
                  Region to Segmentation
                </SelectItem>
                <SelectItem value="ocr">OCR</SelectItem>
                <SelectItem value="ocr with region">OCR with Region</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Text Input for specific modes */}
          {florenceStore.needsAdditionalText() && (
            <div className="space-y-2">
              <Label
                htmlFor="additional-text"
                className="text-base font-medium"
              >
                Additional Text
              </Label>
              <Input
                id="additional-text"
                value={florenceStore.additionalText}
                onChange={(e) =>
                  florenceStore.setAdditionalText(e.target.value)
                }
                placeholder="Enter additional text"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handleRun}
              disabled={florenceStore.isProcessing}
              className="flex-1"
            >
              {florenceStore.isProcessing ? "Processing..." : "Run"}
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default FlorenceInput;
