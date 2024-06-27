import { Card, ProgressCircle } from "@tremor/react"

function CpuUsageChart({ cpuUsage }: { cpuUsage: number}) {
  return (
    <Card className="mx-auto w-full">
      <p className="text-center mb-4 font-mono text-sm text-slate-500">
        CPU Monitoring
      </p>
      <div className="flex flex-col items-center gap-4">
        <ProgressCircle value={cpuUsage} size="xl">
          <div>
            <span className="text-3xl font-bold text-slate-700">{cpuUsage}%</span>
          </div>
        </ProgressCircle>
        <div className='text-center'>
          <p className="text-tremor-default text-tremor-content">
            CPU Usage
          </p>
        </div>
      </div>
    </Card>
  )
}

export default CpuUsageChart