// import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
// import pre-build UI components from local shadcn/ui component library

import { DashboardSummaryCard } from "./DashboardSummaryCard";

export type DashboardSummaryCardData = {
  title: string;
  footerTitle: string;
  footerDescription: string;
  value: string;
  badge: string;
  icon: React.ReactNode;
};

type DashboardSummaryCardGridProps = {
  // no props for now, but could add optional props for customizing cards in the future
  cards: DashboardSummaryCardData[]; // pass in card data as prop for flexibility and reusability
};

export const DashboardSummaryCardGrid = ({ cards }: DashboardSummaryCardGridProps) => {
  return (
    // *:data-[slot=card] EXPLAINED:
    // shadcn Card component has <div data-slot="card"></div> set as attribute
    // therefore, you can access all Cards via *:data-[slot=card]:styling
    // way to style children directly from parent, without need to add class to each children
    // *:data-[slot=card]:bg-gradient-to-t
    // │  │               │
    // │  │               └── CSS property to apply
    // │  └────────────────── attribute selector (only elements where data-slot="card")
    // └───────────────────── apply to ALL direct children

    // *:data-[slot=card]:bg-gradient-to-t - applies a gradient background to each card
    // *:data-[slot=card]:from-primary/5 - gradient starts with a light primary color
    // *:data-[slot=card]:to-card - gradient ends with the card background color
    // *:data-[slot=card]:shadow-xs - adds a small shadow to each card

    // colors EXPLAINED:
    // in component: bg-card - sets card background to card color in dark mode
    // :root {
    //   --card: oklch(0.205 0 0); --> used as bg-card
    // }

    // in component: dark:bg-card - sets card background to card color in dark mode
    // in index.css:
    // .dark {
    //   --card: oklch(0.205 0 0); --> used as dark:bg-card in dark mode as well, but with different color value
    // }

    // <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card: DashboardSummaryCardData) => {
        return (
          <DashboardSummaryCard
            key={card.title}
            {...card}
          />
        );
      })}
    </div>
  );
};
