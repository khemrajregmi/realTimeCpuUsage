import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getCpuUsage } from '../services/cpuUsage';
import CpuUsageChart from '../components/CpuUsageChart';
import CpuUsageLineChart from '../components/CpuUsageLineChart';
import MemoryUsageChart, { MemoryData } from '../components/MemoryUsageChart';
import MemoryInformation from '../components/MemoryInformation';

const socket = io(import.meta.env.VITE_BASE_WS_URL as string);
interface MachineMetadata {
  memory: MemoryData;
  users: number;
  platform: string;
  type: string;
  cores: number;
  uptime: number;
}

export interface LineChartData {
  date: string;
  usage: number
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function App() {
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [metadata, setMetadata] = useState<MachineMetadata>()
  const [isLoading] = useState<boolean>(false)
  const [lineChartData, setLineChartData] = useState<LineChartData[]>([])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('cpuUsageUpdate', async(e) => {
      setCpuUsage(e.usage.usage)
      setMetadata(e.machine as MachineMetadata)
      const periodStats = await getCpuUsage()

      setLineChartData(periodStats.stats.map((stat: Record<string, unknown>) => {
        return {
          date: stat.timestamp ? dayjs(stat.timestamp as string).format('MMM DD YYYY HH:mm:ss') : 'n/a',
          usage: stat.usage
        }
      }).reverse())
    })

    return () => {
      socket.off('connect');
    };
  }, []);


  return (
    <main>
      <div className="space-y-10">
        <div className='max-w-screen-xl mx-auto p-6'>
          <h1 className='text-4xl font-bold mb-8'>Server resources monitoring</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <CpuUsageChart cpuUsage={cpuUsage} />
            <CpuUsageLineChart isLoading={isLoading} lineChartData={lineChartData} />

            {
              metadata && <>
                <MemoryUsageChart memory={metadata.memory} />
                <MemoryInformation memoryPercentage={metadata?.memory.usedMemPercentage} />
              </>
            }
            
          </div>
        </div>
      </div>
    </main>
  );
;
}

export default App;
