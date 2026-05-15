"use client";

export function DetailTrustBadges({ items }) {
  if (!items || !Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {items.map(({ icon: Icon, text }, index) => (
        <div key={index} className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-accent text-center">
          <Icon size={16} className="text-accent-foreground" />
          <span className="text-xs font-bold text-accent-foreground leading-tight">{text}</span>
        </div>
      ))}
    </div>
  );
}

export default DetailTrustBadges;
