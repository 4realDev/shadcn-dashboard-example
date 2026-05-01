import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

type DashboardSummaryCardData = {
  title: string;
  footerTitle: string;
  footerDescription: string;
  value: string;
  badge: string;
  icon: React.ReactNode;
};

export const dashboardSummaryCardsMockData: DashboardSummaryCardData[] = [
  {
    title: "Total Revenue",
    value: "$1,250.00",
    footerTitle: "Visitors for the last 6 months",
    footerDescription: "Trending up this month",
    badge: "+12.5%",
    icon: <IconTrendingUp />,
  },
  {
    title: "New Customers",
    value: "1,234",
    footerTitle: "Acquisition needs attention",
    footerDescription: "Down 20% this period",
    badge: "-20%",
    icon: <IconTrendingDown />,
  },
  {
    title: "Active Accounts",
    value: "45,678",
    footerTitle: "Engagement exceed targets",
    footerDescription: "Strong user retention",
    badge: "+12.5%",
    icon: <IconTrendingUp />,
  },
  {
    title: "Growth Rate",
    value: "4.5%",
    footerTitle: "Meets growth projections",
    footerDescription: "Steady performance increase",
    badge: "+4.5%",
    icon: <IconTrendingUp />,
  },
];
