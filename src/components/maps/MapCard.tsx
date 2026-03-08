import React, { useRef, useState, useEffect } from "react";

interface MapCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  badge?: string;
  badgeColor?: string;
  legend: React.ReactNode;
  source: string;
  children: React.ReactNode;
  overlay?: React.ReactNode;
}

/**
 * Lazy-rendered map card: only mounts map children when the card
 * scrolls into the viewport (IntersectionObserver), cutting initial
 * render cost from 4 MapLibre instances to 0-2.
 */
const MapCard = React.memo(({
  title, subtitle, icon, accentColor, badge, badgeColor, legend, source, children, overlay,
}: MapCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accentColor}12` }}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-bold text-gray-900 tracking-tight">{title}</h3>
              {badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${badgeColor || accentColor}15`, color: badgeColor || accentColor }}>
                  {badge}
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-medium">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Map area */}
      <div className="relative flex-1 min-h-[340px]">
        {visible ? (
          <>
            {children}
            {overlay}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-2 text-gray-300">
              <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-400 animate-spin" />
              <span className="text-[10px] font-medium">Loading map…</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[9px] text-gray-500 font-medium">{legend}</div>
        <span className="text-[8px] text-gray-300 font-medium tracking-wide">{source}</span>
      </div>
    </div>
  );
});
MapCard.displayName = "MapCard";

export default MapCard;
