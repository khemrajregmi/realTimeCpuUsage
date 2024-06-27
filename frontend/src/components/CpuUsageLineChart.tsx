import { Card, LineChart } from "@tremor/react"
import { classNames, LineChartData } from "../app/app";

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat('us').format(number).toString()}`;

function CpuUsageLineChart({
  isLoading,
  lineChartData,
}: {
  isLoading: boolean;
  lineChartData: LineChartData[]
}) {
  return (
    <Card className={classNames("cursor-not-allowed transition-opacity col-span-3", isLoading ? 'pointer-events-none opacity-30' : '')}>
      <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        CPU Usage (%) Chart Over Time (seconds)
      </h3>

      <LineChart
        data={lineChartData}
        index="date"
        categories={['usage']}
        colors={['fuchsia']}
        valueFormatter={valueFormatter}
        showLegend={false}
        showYAxis={false}
        startEndOnly={true}
        className="mt-6 h-32"
      />
    </Card>
  )
}

export default CpuUsageLineChart