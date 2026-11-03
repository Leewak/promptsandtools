import { Apple, Banknote, Calculator, CalendarDays, CalendarPlus, Clock, Dices, Divide, Fuel, GraduationCap, Hourglass, Landmark, Percent, PiggyBank, Receipt, Ruler, Scale, Shuffle, Sigma, Tag, TrendingUp, Type, Home, Zap, Globe2, Cake, Timer, HandCoins, Weight, type LucideIcon } from "lucide-react";
import type { CalcKind } from "@/lib/tools-calc";

// Icons for the calculators and converters; spread into the main icon map in ToolIcon.tsx.
export const CALC_ICONS: Record<CalcKind, LucideIcon> = {
  "percent": Percent, "average": Sigma, "random": Shuffle, "dice": Dices, "fraction": Divide, "calculator": Calculator, "roman": Landmark, "num-words": Type,
  "loan": Banknote, "mortgage": Home, "compound": TrendingUp, "simple-interest": Receipt, "savings-goal": PiggyBank, "tip": HandCoins, "discount": Tag, "vat": Receipt, "margin": Scale,
  "fuel": Fuel, "electricity": Zap, "age": Cake, "date-diff": CalendarDays, "date-add": CalendarPlus, "timezone": Globe2, "countdown": Hourglass, "hours-decimal": Clock, "work-hours": Timer,
  "bmi": Weight, "bmr": Apple, "gpa": GraduationCap, "grade": GraduationCap, "unit": Ruler,
};
