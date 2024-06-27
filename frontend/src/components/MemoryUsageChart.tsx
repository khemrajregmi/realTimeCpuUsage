import { Card, List, ListItem } from "@tremor/react"

export interface MemoryData {
  totalMemMb: number;
  usedMemMb: number;
  freeMemMb: number;
  usedMemPercentage: number;
  freeMemPercentage: number;
}

function MemoryUsageChart({ memory }: { memory: MemoryData}) {
  return (
    <Card className="mx-auto col-span-2">
      <p className="text-center mb-4 font-mono text-sm text-slate-500">
        RAM information
      </p>
      <div className="flex flex-col items-start gap-4">
        <List>
          <ListItem>
            <span>Total Memory</span>
            <span>{memory.totalMemMb} MB</span>
          </ListItem>
          <ListItem>
            <span>Used Memory</span>
            <span>{memory.usedMemMb} MB</span>
          </ListItem>
          <ListItem>
            <span>Free Memory</span>
            <span>{memory.freeMemMb} MB</span>
          </ListItem>
        </List>
      </div>
    </Card>
  )
}

export default MemoryUsageChart