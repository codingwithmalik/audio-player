"use client";

import { useAppDispatch, useAppSelector } from "@/globalHooks";
import {
  selectPlaybackSettings,
  setPlaybackToggle,
  setCrossfadeSeconds,
  setEqualizerEnabled,
  setEqualizerBand,
  resetEqualizer,
} from "@/features/Profile/settingsSlice";
import ToggleRow from "@/features/Profile/ToggleRow";

const BAND_LABELS = ["60Hz", "150Hz", "400Hz", "1KHz", "2.4KHz", "15KHz"];

export default function PlaybackSettingsPage() {
  const dispatch = useAppDispatch();
  const playback = useAppSelector(selectPlaybackSettings);

  return (
    <div className="p-6 max-w-lg">

      <div className="mb-6">
        <p className="text-sm font-medium mb-2">
          Crossfade — {playback.crossfadeSeconds}s
        </p>
        <input
          type="range"
          min={0}
          max={12}
          step={1}
          value={playback.crossfadeSeconds}
          onChange={(e) =>
            dispatch(setCrossfadeSeconds(Number(e.target.value)))
          }
          className="w-full accent-purple-500"
        />
      </div>

      <ToggleRow
        label="Gapless playback"
        checked={playback.gaplessPlayback}
        onChange={(v) =>
          dispatch(setPlaybackToggle({ key: "gaplessPlayback", value: v }))
        }
      />
      <ToggleRow
        label="Automix"
        description="Allow seamless transitions between songs on selected playlists."
        checked={playback.automix}
        onChange={(v) =>
          dispatch(setPlaybackToggle({ key: "automix", value: v }))
        }
      />
      <ToggleRow
        label="Enable audio normalization"
        checked={playback.audioNormalization}
        onChange={(v) =>
          dispatch(setPlaybackToggle({ key: "audioNormalization", value: v }))
        }
      />
      <ToggleRow
        label="Mono audio"
        description="Makes the left and right speakers play the same audio."
        checked={playback.monoAudio}
        onChange={(v) =>
          dispatch(setPlaybackToggle({ key: "monoAudio", value: v }))
        }
      />
      <ToggleRow
        label="Autoplay similar content"
        description="Enjoy nonstop listening. We'll play something similar when your audio ends."
        checked={playback.autoplaySimilar}
        onChange={(v) =>
          dispatch(setPlaybackToggle({ key: "autoplaySimilar", value: v }))
        }
      />

      <div className="mt-6">
        <ToggleRow
          label="Equalizer"
          checked={playback.equalizer.enabled}
          onChange={(v) => dispatch(setEqualizerEnabled(v))}
        />

        {playback.equalizer.enabled && (
          <div className="mt-4 p-4 rounded-md bg-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/60 capitalize">
                Preset: {playback.equalizer.preset}
              </span>
              <button
                onClick={() => dispatch(resetEqualizer())}
                className="text-xs text-white/60 hover:text-white underline"
              >
                Reset
              </button>
            </div>
            <div className="flex justify-between items-end h-40 gap-2">
              {playback.equalizer.bands.map((value, index) => (
                <EqualizerBand
                  key={index}
                  label={BAND_LABELS[index] ?? `Band ${index + 1}`}
                  value={value}
                  onChange={(v) =>
                    dispatch(setEqualizerBand({ index, value: v }))
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Vertical drag slider for one EQ band, -12dB to +12dB.
// Uses Pointer Capture directly since useSliderDrag's exact signature
// wasn't available — swap this for your real hook if it fits this shape.
function EqualizerBand({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const TRACK_HEIGHT = 120; // px, matches h-40 minus label space roughly

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const track = e.currentTarget;
    track.setPointerCapture(e.pointerId);

    function updateFromClientY(clientY: number) {
      const rect = track.getBoundingClientRect();
      const relativeY = clientY - rect.top;
      const clamped = Math.max(0, Math.min(TRACK_HEIGHT, relativeY));
      // Inverted: top of track = +12, bottom = -12
      const newValue = Math.round(12 - (clamped / TRACK_HEIGHT) * 24);
      onChange(newValue);
    }

    updateFromClientY(e.clientY);

    function handlePointerMove(moveEvent: PointerEvent) {
      updateFromClientY(moveEvent.clientY);
    }
    function handlePointerUp() {
      track.removeEventListener("pointermove", handlePointerMove);
      track.removeEventListener("pointerup", handlePointerUp);
    }

    track.addEventListener("pointermove", handlePointerMove);
    track.addEventListener("pointerup", handlePointerUp);
  }

  const handlePositionPercent = ((12 - value) / 24) * 100; // 0% at top (+12), 100% at bottom (-12)

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div
        onPointerDown={handlePointerDown}
        className="relative w-1.5 bg-white/10 rounded-full cursor-pointer"
        style={{ height: TRACK_HEIGHT }}
      >
        <div
          className="absolute w-4 h-4 rounded-full bg-purple-500 -left-1.5 shadow"
          style={{ top: `calc(${handlePositionPercent}% - 8px)` }}
        />
      </div>
      <span className="text-[10px] text-white/50">{label}</span>
    </div>
  );
}
