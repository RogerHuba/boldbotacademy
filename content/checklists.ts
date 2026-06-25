import type { Checklist } from "./types";

export const CHECKLISTS: Checklist[] = [
  {
    key: "vps-setup",
    title: "VPS Setup Checklist",
    items: [
      { key: "credentials-saved", label: "VPS credentials saved to a password manager." },
      { key: "rdp-installed", label: "Remote Desktop app installed (Mac or Windows)." },
      { key: "connected", label: "Connected to VPS and reached the Windows desktop." },
      { key: "time-zone", label: "Set VPS time zone to America/New_York." },
      { key: "screenshot", label: "Captured a screenshot of the connected desktop." },
    ],
  },
  {
    key: "ninjatrader-setup",
    title: "NinjaTrader Setup Checklist",
    items: [
      { key: "installed", label: "NinjaTrader 8 installed on the VPS." },
      { key: "credentials", label: "Prop firm credentials entered in Connections." },
      { key: "data-feed", label: "Data feed live — ticks streaming." },
      { key: "license", label: "License or trial activated." },
      { key: "screenshot", label: "Captured a screenshot of the connected NT instance." },
    ],
  },
  {
    key: "workspace-setup",
    title: "Workspace Setup Checklist",
    items: [
      { key: "templates", label: "Imported the BoldBot template (.xml)." },
      { key: "workspaces", label: "Imported the BoldBot workspace (.xml)." },
      { key: "chart-trader", label: "Chart Trader visible and configured." },
      { key: "max-profit", label: "Max Profit Trigger set on every chart." },
      { key: "screenshot", label: "Captured a screenshot of the workspace." },
    ],
  },
  {
    key: "exit-ninjatrader",
    title: "Properly Exit NinjaTrader",
    items: [
      { key: "disable", label: "Disabled all strategies on every chart." },
      { key: "flat", label: "Confirmed flat across all accounts." },
      { key: "orders", label: "Cancelled any working orders." },
      { key: "disconnect", label: "Used File → Disconnect (don't just close the window)." },
    ],
  },
  {
    key: "morning",
    title: "Morning Checklist",
    items: [
      { key: "vps", label: "Connected to VPS." },
      { key: "nt", label: "NinjaTrader logged in, data flowing." },
      { key: "account", label: "Correct account selected." },
      { key: "contract", label: "Correct micro contract on chart." },
      { key: "max-profit", label: "Max Profit Trigger configured." },
      { key: "bot", label: "BoxSeats armed and waiting." },
    ],
  },
  {
    key: "evening",
    title: "Evening Checklist",
    items: [
      { key: "disable-bot", label: "BoxSeats disabled." },
      { key: "flat", label: "Confirmed flat across accounts." },
      { key: "orders", label: "All working orders cancelled." },
      { key: "log", label: "Trades logged in the daily spreadsheet." },
      { key: "disconnect", label: "NinjaTrader disconnected." },
    ],
  },
  {
    key: "deployment-sim",
    title: "Pre-Deployment Checklist (all items required)",
    items: [
      { key: "vps", label: "VPS connected and stable." },
      { key: "nt", label: "NinjaTrader connected and showing live data." },
      { key: "account", label: "Correct account selected." },
      { key: "contract", label: "Correct micro contract on chart." },
      { key: "bot", label: "Correct bot selected (BoxSeats Starter)." },
      { key: "micros", label: "Confirmed contracts = micros (not minis)." },
      { key: "max-profit", label: "Max Profit Trigger configured." },
      { key: "disable", label: "I know how to disable the bot in 5 seconds." },
    ],
  },
];

export function getChecklist(key: string) {
  return CHECKLISTS.find((c) => c.key === key);
}
