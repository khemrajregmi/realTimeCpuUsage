import CpuUsageModel from '../models/cpu'
import { getCpuUsage as cpuUsage } from "../services/cpu"
import { chunkArray } from '../utils';

async function getCpuUsage(req: any, res: any) {
  try {
    const usage = await cpuUsage()
    const newUsageEntry = new CpuUsageModel({ usage, timestamp: new Date() });
    await newUsageEntry.save();
    res.status(200).json({ usage })
  } catch (error) {
    res.status(500).json({ error: error.toString() })
  }
}

async function getStatsForCustomPeriod(req: any, res: any) {
  const { startTime } = req.query;
  let { endTime } = req.query;

  const startDate = new Date(parseInt(startTime) * 1000);
  const endDate = endTime ? new Date(parseInt(endTime) * 1000) : new Date();

  try {
    const customPeriodStats = await CpuUsageModel.find({
      timestamp: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ timestamp: 1 });

    const stepSize = Math.ceil(customPeriodStats.length / 10) || 1;

    const customPeriodStatsChunk = chunkArray(customPeriodStats, stepSize);

    const chunks = customPeriodStatsChunk.map(() => ({ sum: 0, count: 0 }));
    
    customPeriodStatsChunk.forEach((stats, index) => {
      const avgUsage = stats.reduce((acc, stat) => acc + stat.usage, 0);
      chunks[index].sum = avgUsage;
      chunks[index].count = stats.length;
    });


    const averages = chunks.map(chunk => chunk.count > 0 ? chunk.sum / chunk.count : 0);

    res.status(200).json({ averages });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

async function getLastMinuteStats(req: any, res: any) {
  const lastMinute = new Date(new Date().getTime() - 60 * 1000);
  try {
    const stats = await CpuUsageModel.find({
      timestamp: {
        $gte: lastMinute
      }
    }).sort({ timestamp: -1 });
    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

async function deleteAllStats() {
  try {
    await CpuUsageModel.deleteMany({})
  } catch (error) {
    console.log(error)
  }
}

export {
  getCpuUsage,
  deleteAllStats,
  getStatsForCustomPeriod,
  getLastMinuteStats
}