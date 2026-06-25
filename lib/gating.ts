import "server-only";
import { redirect } from "next/navigation";
import { getStudentState, type StudentState } from "./progress";
import type { DayKey } from "@/content/types";

export async function requireStudent(): Promise<StudentState> {
  const state = await getStudentState();
  if (!state) redirect("/login");
  return state;
}

export async function requireAdmin(): Promise<StudentState> {
  const state = await requireStudent();
  if (state.role !== "admin" && state.role !== "staff") redirect("/dashboard");
  return state;
}

export async function requireUnlockedDay(day: DayKey): Promise<StudentState> {
  const state = await requireStudent();
  if (!state.unlocked[day]) redirect("/dashboard");
  return state;
}
