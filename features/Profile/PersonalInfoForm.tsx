// features/Profile/PersonalInfoForm.tsx
"use client";

import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/globalHooks";
import {
  selectPersonalInfo,
  selectIsAccountSaving,
  selectAccountError,
  setPersonalInfo,
  setAccountSaving,
  setAccountError,
} from "@/features/Profile/accountSlice";
import { updateUser } from "@/features/Auth/authSlice";
import CustomSelect from "@/features/Profile/CustomSelect";
import Image from "next/image";

const COUNTRIES = [
  "Pakistan",
  "United States",
  "United Kingdom",
  "India",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "United Arab Emirates",
  "Saudi Arabia",
  "Bangladesh",
  "Turkey",
  "Brazil",
  "Japan",
  "China",
  "Indonesia",
  "Nigeria",
  "Egypt",
  "South Africa",
  "Italy",
  "Spain",
  "Netherlands",
  "Sweden",
  "Norway",
  "Mexico",
  "Philippines",
  "Malaysia",
  "Singapore",
]; // placeholder list — swap for your real country dataset

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

function getAvatarColor(seed: string) {
  const colors = [
    "bg-purple-600",
    "bg-blue-600",
    "bg-pink-600",
    "bg-emerald-600",
    "bg-orange-600",
    "bg-red-600",
  ];
  const sum = seed.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return colors[sum % colors.length];
}

// Splits an ISO date ("2006-08-01") into separate day/month/year strings
// for the three-field layout; returns empty strings if null/unset.
function splitIsoDate(iso: string | null) {
  if (!iso) return { day: "", month: "", year: "" };
  const [year, month, day] = iso.split("-");
  return { day: String(Number(day)), month: String(Number(month) - 1), year };
}

function joinIsoDate(day: string, month: string, year: string): string | null {
  if (!day || !month || !year) return null;
  const mm = String(Number(month) + 1).padStart(2, "0");
  const dd = String(Number(day)).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export default function PersonalInfoForm() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const personalInfo = useAppSelector(selectPersonalInfo);
  const isSaving = useAppSelector(selectIsAccountSaving);
  const error = useAppSelector(selectAccountError);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [draft, setDraft] = useState({
    username: user?.username ?? "",
    image: user?.image ?? "",
    ...personalInfo,
  });

  const initialDate = splitIsoDate(personalInfo.dateOfBirth);
  const [date, setDate] = useState(initialDate.day);
  const [month, setMonth] = useState(initialDate.month);
  const [year, setYear] = useState(initialDate.year);

  const isDirty =
    draft.username !== user?.username ||
    draft.image !== (user?.image ?? "") ||
    draft.gender !== personalInfo.gender ||
    draft.country !== personalInfo.country ||
    joinIsoDate(date, month, year) !== personalInfo.dateOfBirth;

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setDraft((prev) => ({ ...prev, image: objectUrl }));
  }

  async function handleSave() {
    dispatch(setAccountSaving(true));
    dispatch(setAccountError(null));

    // ─── MOCK: replace with real API calls once backend exists ───
    // await fetch("/api/account", { method: "PATCH", body: JSON.stringify({...}) })
    await new Promise((resolve) => setTimeout(resolve, 400));
    // ──────────────────────────────────────────────────────────

    dispatch(
      updateUser({ username: draft.username, image: draft.image || undefined }),
    );
    dispatch(
      setPersonalInfo({
        gender: draft.gender,
        country: draft.country,
        dateOfBirth: joinIsoDate(date, month, year),
      }),
    );
    dispatch(setAccountSaving(false));
  }

  function handleCancel() {
    setDraft({
      username: user?.username ?? "",
      image: user?.image ?? "",
      ...personalInfo,
    });
    const reset = splitIsoDate(personalInfo.dateOfBirth);
    setDate(reset.day);
    setMonth(reset.month);
    setYear(reset.year);
  }

  return (
    <div className="flex gap-8 flex-wrap">
      {/* ── Cover image ── */}
      <div className="flex flex-col items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative w-32 h-32 rounded-full overflow-hidden group"
        >
          {draft.image ? (
            <Image
              src={draft.image}
              alt={draft.username}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center text-4xl font-bold text-white ${getAvatarColor(draft.username || "?")}`}
            >
              {draft.username.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImagePick}
          className="hidden"
        />
        <span className="text-xs text-white/50">Change photo</span>
      </div>

      {/* ── Fields ── */}
      <div className="flex flex-col gap-6 flex-1 min-w-70 max-w-md">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-white/80">
            Username
          </label>
          <input
            type="text"
            value={draft.username}
            onChange={(e) => setDraft({ ...draft, username: e.target.value })}
            className="bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-white/40 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-white/80">Gender</label>
          <CustomSelect
            value={draft.gender ?? ""}
            onChange={(v) => setDraft({ ...draft, gender: v })}
            options={GENDER_OPTIONS}
            placeholder="Select gender"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-white/80">
            Date of birth
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Date"
              value={date}
              maxLength={2}
              onChange={(e) => setDate(e.target.value.replace(/\D/g, ""))}
              className="w-16 bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:border-white/40"
            />
            <CustomSelect
              value={month}
              onChange={setMonth}
              options={MONTHS.map((m, i) => ({ value: String(i), label: m }))}
              placeholder="Month"
              className="flex-1"
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Year"
              value={year}
              maxLength={4}
              onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))}
              className="w-20 bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:border-white/40"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-white/80">
            Country or region
          </label>
          <CustomSelect
            value={draft.country ?? ""}
            onChange={(v) => setDraft({ ...draft, country: v })}
            options={COUNTRIES.map((c) => ({ value: c, label: c }))}
            placeholder="Select country"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="px-6 py-2 rounded-full bg-white text-black text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save profile"}
          </button>
          {isDirty && (
            <button
              onClick={handleCancel}
              className="px-6 py-2 rounded-full border border-white/30 text-sm font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
