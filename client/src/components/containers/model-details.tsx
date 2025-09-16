import type React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../@providers/components/ui/card";
import { Badge } from "../../@providers/components/ui/badge";
import { Code, Copy, Check } from "lucide-react";
import { Button } from "../../@providers/components/ui/button";
import { useState } from "react";

interface ModelDetailsProps {
  modelType: string;
  pythonExample?: string;
  pixelExample?: string;
}

const ModelDetails: React.FC<ModelDetailsProps> = ({
  modelType,
  pythonExample,
  pixelExample,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderCodeBlock = (code: string, language: string, title: string) => {
    if (!code) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code size={16} />
            <span className="text-sm font-medium">{title}</span>
            <Badge variant="outline" className="text-xs">
              {language}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(code, language)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title={`Copy ${language} code`}
          >
            {copiedCode === language ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
        <div className="relative">
          <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm font-mono">
            <code className="text-foreground">{code}</code>
          </pre>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code size={20} />
          Model Details
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{modelType}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {pythonExample &&
          renderCodeBlock(pythonExample, "python", "Python Example")}
        {pixelExample &&
          renderCodeBlock(pixelExample, "pixel", "Pixel Example")}

        {!pythonExample && !pixelExample && (
          <div className="text-center text-muted-foreground py-8">
            <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No code examples available for this model type.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelDetails;
