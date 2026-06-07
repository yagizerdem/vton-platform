"use client";

import { useEffect, useState } from "react";
import { UploadIcon, ImageIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { api } from "../lib/api";
import { CustomOptions } from "../lib/api-response";
import { toast } from "sonner";
import { IVtonJob } from "../models/vton-job";

function VtonPanel() {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (value: File | null) => void,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setter(file);
  }

  async function handleGenerate() {
    try {
      setIsCreatingJob(true);
      const formData = new FormData();

      if (!personImage) {
        return toast.error("Please upload a person image.");
      }

      if (!garmentImage) {
        return toast.error("Please upload a garment image.");
      }

      formData.append("personImage", personImage);
      formData.append("garmentImage", garmentImage);

      const { data: apiResponse } = await api.post<CustomOptions<IVtonJob>>(
        "/vton/try-on",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const isSuccess = apiResponse.status.toString().startsWith("2");

      if (isSuccess) {
        setJobId(apiResponse.data?.jobId || null);
        setIsPolling(true);
      }

      if (isSuccess) {
        toast.success("Try-on generated successfully!");
      } else {
        toast.error(`Failed to generate try-on: ${apiResponse.message}`);
      }
    } finally {
      setIsCreatingJob(false);
    }
  }

  useEffect(() => {
    if (!isPolling || !jobId) return;

    async function fetchJobStatus() {
      try {
        const { data: apiResponse } = await api.get<CustomOptions<IVtonJob[]>>(
          `/vton/get-job?jobId=${jobId}`,
        );

        const job = apiResponse.data?.[0];

        console.log(job);

        if (!job) return;

        if (job.status === "completed") {
          setOutputImage(job.resultImageUrl ?? null);
          toast.success("Try-on generated successfully!");
          setIsPolling(false);
          return;
        }

        if (job.status === "failed") {
          console.error(job.errorMessage);
          toast.error(`Job failed: ${job.errorMessage}`);
          setIsPolling(false);
          return;
        }
      } catch (error) {
        console.error("Error fetching job status:", error);
        toast.error("An error occurred while fetching job status.");
        setIsPolling(false);
      }
    }

    fetchJobStatus();

    const interval = setInterval(fetchJobStatus, 3000);

    return () => clearInterval(interval);
  }, [isPolling, jobId]);

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 p-4 lg:grid-cols-[1fr_1.2fr]">
      <div className="grid gap-6">
        <UploadCard
          title="Person Image"
          description="Upload the model/person photo."
          image={personImage ? URL.createObjectURL(personImage) : null}
          onChange={(e) => handleImageChange(e, setPersonImage)}
        />

        <UploadCard
          title="Garment Image"
          description="Upload the clothing product image."
          image={garmentImage ? URL.createObjectURL(garmentImage) : null}
          onChange={(e) => handleImageChange(e, setGarmentImage)}
        />

        <Button
          size="lg"
          className="h-12 w-full font-bold"
          disabled={!personImage || !garmentImage || isPolling || isCreatingJob}
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
