"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Searchable multi-select with async options.
 *
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {Array} props.value - Currently selected values (array of _id or string)
 * @param {Function} props.onChange - Called with new array
 * @param {Function} props.fetchFn - async (search) => [{ _id, name, label? }]
 * @param {string} props.placeholder - Input placeholder
 */
export function SearchableMultiSelect({ label, value = [], onChange, fetchFn, placeholder = "Search..." }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchOptions = useCallback(async (q) => {
    if (!open) return;
    setLoading(true);
    try {
      const results = await fetchFn(q);
      setOptions(results);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [open, fetchFn]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => fetchOptions(search), 0);
    return () => clearTimeout(timer);
  }, [search, open, fetchOptions]);

  const selectedSet = new Set(value.map((v) => (typeof v === "object" ? v._id || v : v).toString()));

  function toggle(option) {
    const id = option._id || option;
    const idStr = id.toString();
    if (selectedSet.has(idStr)) {
      onChange(value.filter((v) => (typeof v === "object" ? v._id || v : v).toString() !== idStr));
    } else {
      onChange([...value, option]);
    }
  }

  function remove(idStr) {
    onChange(value.filter((v) => (typeof v === "object" ? v._id || v : v).toString() !== idStr));
  }

  return (
    <div className="space-y-2" ref={wrapperRef}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <div
          className="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {value.length > 0 ? (
            value.map((v) => {
              const idStr = (typeof v === "object" ? v._id || v : v).toString();
              const name = typeof v === "object" ? v.name || v.label || idStr : idStr;
              return (
                <span key={idStr} className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-xs font-medium">
                  {name}
                  <button
                    onClick={(e) => { e.stopPropagation(); remove(idStr); }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown size={14} className="ml-auto shrink-0 text-muted-foreground" />
        </div>
        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
            <div className="p-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="h-8 text-xs"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={16} className="animate-spin text-muted-foreground" />
                </div>
              ) : options.length === 0 ? (
                <p className="px-3 py-2 text-xs text-muted-foreground">No results</p>
              ) : (
                options.map((opt) => {
                  const idStr = (opt._id || opt).toString();
                  const isSelected = selectedSet.has(idStr);
                  return (
                    <button
                      key={idStr}
                      onClick={() => toggle(opt)}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-accent text-left"
                    >
                      <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
                        {isSelected && <Check size={10} />}
                      </div>
                      <span>{opt.name || opt.label || opt}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
