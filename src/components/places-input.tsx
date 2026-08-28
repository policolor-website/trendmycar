"use client";

import { useState, useEffect, useRef } from "react";

interface Prediction {
  placeId: string;
  description: string;
}

interface PlacesInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  // Optional: center + radius (in meters) to filter autocomplete results
  center?: { lat: number; lng: number } | null;
  radiusM?: number | null;
  // Optional: callback when a prediction is selected with its coordinates
  onPlaceSelect?: (place: { description: string; lat?: number; lng?: number }) => void;
  disabled?: boolean;
}

export default function PlacesInput({
  value,
  onChange,
  placeholder,
  center,
  radiusM,
  onPlaceSelect,
  disabled,
}: PlacesInputProps) {
  const [input, setInput] = useState(value);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInput(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPredictions = async (text: string) => {
    if (text.length < 2) {
      setPredictions([]);
      return;
    }
    setLoading(true);
    try {
      let url = `/api/places-autocomplete?input=${encodeURIComponent(text)}`;
      if (center && radiusM) {
        url += `&lat=${center.lat}&lng=${center.lng}&radius=${radiusM}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.predictions) {
        setPredictions(data.predictions);
        setOpen(true);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (val: string) => {
    setInput(val);
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(val), 300);
  };

  const handleSelect = (pred: Prediction) => {
    setInput(pred.description);
    onChange(pred.description);
    if (onPlaceSelect) {
      onPlaceSelect({
        description: pred.description,
        lat: (pred as any).lat,
        lng: (pred as any).lng,
      });
    }
    setPredictions([]);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => predictions.length > 0 && setOpen(true)}
        disabled={disabled}
        className="w-full bg-ink/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-stone focus:border-electric/50 focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        autoComplete="off"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <span className="w-4 h-4 border-2 border-white/20 border-t-electric rounded-full animate-spin block" />
        </div>
      )}
      {open && predictions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 glass rounded-lg overflow-hidden max-h-60 overflow-y-auto">
          {predictions.map((pred) => (
            <li key={pred.placeId}>
              <button
                type="button"
                onClick={() => handleSelect(pred)}
                className="w-full text-left px-4 py-3 text-sm text-ash hover:bg-white/5 hover:text-white transition-colors"
              >
                {pred.description}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && predictions.length === 0 && !loading && input.length >= 2 && (
        <ul className="absolute z-50 w-full mt-1 glass rounded-lg overflow-hidden">
          <li className="px-4 py-3 text-sm text-stone">
            {disabled ? "Select destination first" : "No results in allowed area"}
          </li>
        </ul>
      )}
    </div>
  );
}
