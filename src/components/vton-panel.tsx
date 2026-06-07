"use client";

import { useState } from "react";
import { UploadIcon, ImageIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

function VtonPanel() {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string | null) => void,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setter(URL.createObjectURL(file));
  }

  function handleGenerate() {
    // API çağrısından sonra burada output set edeceksin
    setOutputImage(personImage);
  }

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 p-4 lg:grid-cols-[1fr_1.2fr]">
      <div className="grid gap-6">
        <UploadCard
          title="Person Image"
          description="Upload the model/person photo."
          image={personImage}
          onChange={(e) => handleImageChange(e, setPersonImage)}
        />

        <UploadCard
          title="Garment Image"
          description="Upload the clothing product image."
          image={garmentImage}
          onChange={(e) => handleImageChange(e, setGarmentImage)}
        />

        <Button
          size="lg"
          className="h-12 w-full font-bold"
          disabled={!personImage || !garmentImage}
          onClick={handleGenerate}
        >
          <SparklesIcon className="mr-2 h-5 w-5" />
          Generate Try-On
        </Button>
      </div>

      <Card className="min-h-[500px] overflow-hidden bg-card">
        <CardHeader>
          <CardTitle>Virtual Try-On Output</CardTitle>
          <CardDescription>
            Generated result will appear here after processing.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex min-h-[380px] items-center justify-center rounded-xl border border-dashed bg-muted/30 p-4">
            {outputImage ? (
              <img
                src={outputImage}
                alt="Generated virtual try-on output"
                className="max-h-[520px] w-full rounded-xl object-contain"
              />
            ) : (
              <div className="flex flex-col items-center text-center text-muted-foreground">
                <ImageIcon className="mb-4 h-14 w-14 opacity-60" />
                <p className="text-lg font-semibold">No output yet</p>
                <p className="max-w-sm text-sm">
                  Upload a person image and garment image, then generate the
                  try-on result.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function UploadCard({
  title,
  description,
  image,
  onChange,
}: {
  title: string;
  description: string;
  image: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Card className="overflow-hidden bg-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <label className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-4 transition hover:bg-muted/50">
          {image ? (
            <img
              src={image}
              alt={title}
              className="max-h-[260px] w-full rounded-lg object-contain"
            />
          ) : (
            <div className="flex flex-col items-center text-center text-muted-foreground">
              <UploadIcon className="mb-3 h-10 w-10" />
              <p className="font-medium">Click to upload</p>
              <p className="text-sm">PNG, JPG, JPEG</p>
            </div>
          )}

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={onChange}
          />
        </label>
      </CardContent>
    </Card>
  );
}

export default VtonPanel;
