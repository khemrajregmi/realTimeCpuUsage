import mongoose from "mongoose";

const cpuUsageSchema = new mongoose.Schema({
  usage: Number,
  timestamp: Date,
  metadata: Object
}, {
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'seconds',
  },
  // expireAfterSeconds: 60 * 60 * 24 * 7 // 7 days
  expireAfterSeconds: 15 // 15 seconds
});

export default mongoose.model('CpuUsage', cpuUsageSchema);
