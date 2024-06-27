import { Card, ProgressCircle } from "@tremor/react"

function MemoryInformation({ memoryPercentage }: { memoryPercentage: number}) {
  return (
    <Card className="mx-auto col-span-2">
      <p className="text-center mb-4 font-mono text-sm text-slate-500">
        Memory (RAM) Monitoring
      </p>
      <div className="flex flex-col items-center gap-4">
        <ProgressCircle value={memoryPercentage} size="xl">
          <div>
            <span className="text-3xl font-bold text-slate-700">{memoryPercentage}%</span>
          </div>
        </ProgressCircle>
        <div className='text-center'>
          <p className="text-tremor-default text-tremor-content">
            Memory Usage Usage
          </p>
        </div>
      </div>
    </Card>
  )
}

export default MemoryInformation