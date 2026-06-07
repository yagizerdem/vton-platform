import { Schema, Types } from "mongoose";
import mongoose from "mongoose";

const VtonJobSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  resultImageUrl: { type: String },
  errorMessage: { type: String },
});

VtonJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const VtonJobModel =
  mongoose.models.VtonJob || mongoose.model("VtonJob", VtonJobSchema);

type VtonJobStatus = "pending" | "processing" | "completed" | "failed";

interface IVtonJob {
  userId: Types.ObjectId;
  jobId: string;
  status: VtonJobStatus;
  resultImageUrl?: string;
  errorMessage?: string;
}

export default VtonJobModel;

export type { IVtonJob };
