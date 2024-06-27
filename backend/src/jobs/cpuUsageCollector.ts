import cron from 'node-cron';
import { getCpuUsage as cpuUsage } from "../services/cpu"
import CpuUsage from '../models/cpu'; // Adjust the import path as necessary
import { getMachineStats } from '../services/machine';

export default async function start() {
  try {
    cron.schedule('* * * * * *', async () => {
      const [usage, machineStats] = await Promise.all([cpuUsage(), getMachineStats()]);
      const newUsageEntry = new CpuUsage({ usage, timestamp: new Date(), metadata: {
        machineStats,
      } });
      await newUsageEntry.save();
    });
  } catch (error) {
    console.log(error);
  }
}