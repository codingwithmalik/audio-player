// app/profile/settings/page.tsx
"use client";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import {
  SlidersHorizontal,
  Radio,
  Library,
  HardDrive,
  Lock,
  Info,
} from "lucide-react";

import PlaybackSection from "@/features/Profile/Settings/PlaybackSection";
import AudioQualitySection from "@/features/Profile/Settings/AudioQualitySection";
import LibrarySection from "@/features/Profile/Settings/LibrarySection";
import StorageSection from "@/features/Profile/Settings/StorageSection";
import PrivacySection from "@/features/Profile/Settings/PrivacySection";
import AboutSection from "@/features/Profile/Settings/AboutSection";

const SECTIONS = [
  {
    label: "Playback",
    icon: SlidersHorizontal,
    component: PlaybackSection,
  },
  {
    label: "Audio Quality",
    icon: Radio,
    component: AudioQualitySection,
  },
  {
    label: "Your Library",
    icon: Library,
    component: LibrarySection,
  },
  {
    label: "Storage",
    icon: HardDrive,
    component: StorageSection,
  },
  {
    label: "Privacy",
    icon: Lock,
    component: PrivacySection,
  },
  {
    label: "About",
    icon: Info,
    component: AboutSection,
  },
] as const;

export default function SettingsPage() {
  return (
    <OverlayScrollbarsComponent
      options={{ scrollbars: { autoHide: "scroll" } }}
      className="h-full"
      defer
    >
      <div className="p-6 max-w-2xl flex flex-col gap-10">
        <h1 className="text-3xl font-extrabold">Settings</h1>

        {SECTIONS.map(({ label, icon: Icon, component: Section }) => (
          <section key={label}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
              <Icon className="w-5 h-5 text-white/70" />
              {label}
            </h2>
            <Section />
          </section>
        ))}
      </div>
    </OverlayScrollbarsComponent>
  );
}
