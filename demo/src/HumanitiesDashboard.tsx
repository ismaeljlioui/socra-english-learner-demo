import type { ReactNode } from "react";
import { AnalyticsDashboard, type AnalyticsDashboardData } from "./components/block/analytics-dashboard";
import { BookIcon, MessageIcon, SettingsIcon, CheckIcon } from "./components/analytics-dashboard/icons";

const navigation = [{ page: "overview", label: "Chat studio", Icon: MessageIcon }, {page:"reviews",label:"Language observations",Icon:CheckIcon}] as const;
// The registry's sample engineering metrics, people, and assistant are never shown.
const emptyData: AnalyticsDashboardData = {
  people: [], ranges: [], kpis: {}, activity: {}, repositories: [], pullRequests: [],
};

export function HumanitiesDashboard({ page, onPageChange, controlsOpen, toggleControls, children }: {
  page: "chat"|"language"; onPageChange:(page:"chat"|"language")=>void;
  controlsOpen: boolean;
  toggleControls: () => void;
  children: ReactNode;
}) {
  return <AnalyticsDashboard
    className="humanities-dashboard"
    variant="fill"
    data={emptyData}
    brand={{ name: "Humanities Lab", logo: <BookIcon /> }}
    page={page==="chat"?"overview":"reviews"}
    onPageChange={p=>onPageChange(p==="reviews"?"language":"chat")}
    navigation={navigation}
    defaultSidebarOpen
    headerActions={<>
      <span className="dashboard-prototype">Research prototype · v0.1</span>
      <button className="dashboard-controls press" aria-label="Research controls" aria-expanded={controlsOpen} onClick={toggleControls}>
        <SettingsIcon size={15} /> <span>Research controls</span>
      </button>
    </>}
    sidebarFooter={<button className="rail-account press has-tip tip-right" data-tip="Research settings" aria-label="Research settings" onClick={toggleControls}>
      <SettingsIcon size={19} className="rail-icon" />
      <span className="rail-label rail-account-text" aria-hidden="true">
        <span className="rail-account-name">Local text demo</span>
        <span className="rail-account-mail">Educational design · provisional</span>
      </span>
    </button>}
  >{children}</AnalyticsDashboard>;
}
