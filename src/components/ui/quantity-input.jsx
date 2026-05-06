"use client";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

const QuantityInput = ({
  className,
  disabled = false,
  max = null,
  min = 1,
  onChange,
  quantity,
  step = 1,
}) => {
  const handleDecrease = () => {
    if (quantity - step >= min) {
      onChange(quantity - step);
    }
  };

  const handleIncrease = () => {
    if (max === null || quantity + step <= max) {
      onChange(quantity + step);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(value, min), max || Infinity);
      onChange(clampedValue);
    }
  };

  const handleInputBlur = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < min) {
      onChange(min);
    } else if (max !== null && value > max) {
      onChange(max);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        min={min}
        max={max}
        disabled={disabled}
        className="flex h-9 w-16 rounded-md border border-input bg-background px-2 py-1 text-center text-sm font-medium [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || (max !== null && quantity >= max)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantityInput;
export { QuantityInput };