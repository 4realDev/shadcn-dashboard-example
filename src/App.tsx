import "./App.css";
import { ChartAreaInteractive } from "./components/ChartAreaInteractive";
import { ChartPieInteractive } from "./components/ChartPieInteractive";
import { DashboardSummaryCardGrid } from "./components/DashboardSummaryCardsGrid";
import { DeezerDashboard } from "./components/DeezerDashboard";
import { dashboardSummaryCardsMockData } from "./data/dashboard-summary-cards";
import {
  devicePieConfig,
  devicePieData,
  visitorsChartConfig,
  visitorsChartData,
  visitorsTimeRanges,
} from "./data/visitors-chart";

function App() {
  return (
    // <div>
    //   <h1 className="text-3xl font-bold underline">Hello world!</h1>{" "}
    //   <Button>Click me</Button>
    // </div>

    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DashboardSummaryCardGrid cards={dashboardSummaryCardsMockData} />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive
            title={"Total Visitors"}
            description={"Total for the last 3 months"}
            shortDescription={"Last 3 months"}
            data={visitorsChartData}
            dataKeys={["mobile", "desktop"]}
            timeRanges={visitorsTimeRanges}
            defaultTimeRange={"90d"}
            referenceDate={"2024-06-30"}
            config={visitorsChartConfig}
          />
        </div>
        <div className="px-4 lg:px-6">
          <ChartPieInteractive
            title="Visitors by Device"
            description="Breakdown for the last 3 months"
            shortDescription="Last 3 months"
            data={devicePieData}
            config={devicePieConfig}
            dataKey="value"
            nameKey="name"
            centerLabel="Visitors"
            centerValue="86.6k"
          />
        </div>
        <DeezerDashboard />
        {/* <DataTable data={data} /> */}
      </div>
    </div>
  );
}

export default App;
