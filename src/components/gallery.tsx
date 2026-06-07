"use client";

import { Fragment } from "react/jsx-runtime";
import { useApp } from "../provider/app-provider";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { useGallery } from "../provider/gallery-provider";

function Gallery() {
  const { isLoggedIn, user } = useApp();
  const { vJobs, setVJobs, isLoading, fetchVtonJobs, deleteVtonJob } =
    useGallery();

  const imageJobs = vJobs.filter((job) => job.resultImageUrl);

  useEffect(() => {
    if (isLoggedIn && user?._id) {
      fetchVtonJobs(false);
    }
  }, [isLoggedIn, user?._id]);

  useEffect(() => {
    if (!isLoggedIn) {
      setVJobs([]);
    }
  }, [isLoggedIn]);

  async function downloadImage(url: string, filename: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  }

  return (
    <Fragment>
      <section className="mx-auto w-11/12 max-w-7xl py-10">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-3xl font-black tracking-tight">Gallery</h2>
          <p className="text-muted-foreground">
            Your generated virtual try-on results.
          </p>
        </div>

        {!isLoggedIn && (
          <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
            Please login to see your gallery.
          </div>
        )}

        {isLoggedIn && imageJobs.length === 0 && !isLoading && (
          <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
            No generated images yet.
          </div>
        )}

        {imageJobs.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {imageJobs.map((job) => (
              <div
                key={job.jobId}
                className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-xl"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-muted">
                  <img
                    src={job.resultImageUrl}
                    alt={`VTON result ${job.jobId}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-2 p-3">
                  <p className="text-xs text-muted-foreground">
                    Status: {job.status}
                  </p>

                  <Button
                    type="button"
                    className="w-full cursor-pointer"
                    onClick={() =>
                      downloadImage(
                        job.resultImageUrl!,
                        `vton-result-${job.jobId}.png`,
                      )
                    }
                  >
                    Download
                  </Button>

                  <Button
                    variant="destructive"
                    type="button"
                    className="w-full cursor-pointer"
                    onClick={() => deleteVtonJob(job.jobId)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoggedIn && (
          <div className="mt-8 flex justify-center">
            <Button onClick={() => fetchVtonJobs(true)} disabled={isLoading}>
              {isLoading ? "Loading..." : "Load more"}
            </Button>
          </div>
        )}
      </section>
    </Fragment>
  );
}

export default Gallery;
