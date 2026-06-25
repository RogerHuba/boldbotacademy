import type { ValidationSpec } from "./types";

export const VALIDATIONS: ValidationSpec[] = [
  {
    day: "day_1_setup",
    title: "Day 1 Setup — Validation",
    slots: [
      { key: "vps_setup", label: "VPS connected", hint: "Screenshot of your VPS desktop showing the BoldBot taskbar." },
      { key: "nt_setup", label: "NinjaTrader connected", hint: "NinjaTrader window with Connections panel showing green status." },
      { key: "workspace_setup", label: "Workspace configured", hint: "Chart Trader visible, BoldBot template applied, Max Profit Trigger set." },
    ],
  },
  {
    day: "day_2",
    title: "Day 2 — Operations Validation",
    slots: [
      { key: "vps_connected", label: "VPS connected", hint: "Active RDP session." },
      { key: "nt_connected", label: "NT connected", hint: "Green connection indicator visible." },
      { key: "chart", label: "Chart loaded", hint: "Your trading chart with BoldBot template." },
      { key: "correct_account", label: "Correct account selected", hint: "Chart Trader header shows the right account." },
      { key: "correct_contract", label: "Correct contract", hint: "Symbol must be a micro contract (MES, MNQ, MGC, etc)." },
      { key: "bot_enabled", label: "Bot enabled", hint: "Strategies tab shows BoxSeats running." },
      { key: "max_profit_trigger", label: "Max Profit Trigger", hint: "The Max Profit Trigger panel set and visible." },
    ],
  },
];

export function getValidation(day: string) {
  return VALIDATIONS.find((v) => v.day === day);
}
