import { Schema } from "mongoose";
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

const VtonJobModel = mongoose.model("VtonJob", VtonJobSchema);

export default VtonJobModel;
