import mongoose from 'mongoose';

const SpoofLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalAssetId: { type: String, required: true },
  newAssetId: { type: String, default: null },
  originalLine: { type: String, default: null },
  assetName: { type: String, default: 'Unknown' },
  fileSize: { type: Number, default: 0 },
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
  error: { type: String, default: null },
  duration: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SpoofLog || mongoose.model('SpoofLog', SpoofLogSchema);
