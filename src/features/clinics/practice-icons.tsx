import {
  Activity,
  Bone,
  Building2,
  Eye,
  Footprints,
  HeartPulse,
  PawPrint,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
  Hand,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { Tooth } from "@/components/icons/tooth";
import type { PracticeType } from "@/features/clinics/constants";

type IconComponent = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

export const PRACTICE_ICONS: Record<PracticeType, IconComponent> = {
  dental: Tooth,
  orthodontics: Smile,
  oral_surgery: Syringe,
  veterinary: PawPrint,
  dermatology: Hand,
  med_spa: Sparkles,
  primary_care: Stethoscope,
  urgent_care: HeartPulse,
  optometry: Eye,
  podiatry: Footprints,
  physical_therapy: Activity,
  chiropractic: Bone,
  other: Building2,
};
