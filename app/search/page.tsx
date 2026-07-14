"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/globalHooks";
import { setQuery, clearQuery } from "@/features/Search/searchSlice";
import SearchBar from "@/features/Search/searchBar";
import SearchOverlay from "@/features/Search/SearchOverlay";
import BrowseGrid from "@/features/Genre/BrowseGrid";
import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

const DEBOUNCE_MS = 500;

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(setQuery(inputValue));
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, dispatch]);

  const handleClear = () => {
    setInputValue("");
    dispatch(clearQuery());
  };

  const handleCancel = () => {
    setFocused(false);
    handleClear();
    inputRef.current?.blur();
  };

  return (
    <div className="flex flex-col h-full w-full px-4 py-3 glass ">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchBar
            value={inputValue}
            onChange={(val) =>
              val === "" ? handleClear() : setInputValue(val)
            }
            onFocus={() => setFocused(true)}
            inputRef={inputRef}
          />
        </div>
        {focused && (
          <button
            onClick={handleCancel}
            className="shrink-0 text-sm font-semibold text-white px-1"
          >
            Cancel
          </button>
        )}
      </div>

      <OverlayScrollbarsComponent
        defer
        options={{
          scrollbars: {
            theme: "os-theme-light",
            autoHide: "leave",
            autoHideDelay: 0,
          },
        }}
        className="flex-1 mt-4"
      >
        {focused ? <SearchOverlay variant="page" /> : <BrowseGrid />}
      </OverlayScrollbarsComponent>
    </div>
  );
}
