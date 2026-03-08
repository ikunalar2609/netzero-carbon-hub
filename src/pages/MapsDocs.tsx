import { useState } from "react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  BookOpen,
  Flame,
  AlertTriangle,
  Thermometer,
  BarChart3,
  Globe,
  Map,
  TrendingUp,
  Info,
  Database,
  Satellite,
  ChevronRight,
} from "lucide-react";
import farmlyLogo from "@/assets/farmly-carbon-logo.png";

const sections = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "wildfire", label: "Wildfire Activity Map", icon: Flame },
  { id: "deforestation", label: "Deforestation Hotspots", icon: AlertTriangle },
  { id: "anomaly-chart", label: "Temperature Anomaly Chart", icon: Thermometer },
  { id: "daily-anomaly", label: "Daily Anomaly by Year", icon: TrendingUp },
  { id: "daily-temp", label: "Daily Global Mean Temp", icon: Globe },
  { id: "absolute-chart", label: "Absolute Temperature", icon: BarChart3 },
  { id: "heatmap-anomaly", label: "Anomaly Heatmap", icon: Map },
  { id: "heatmap-absolute", label: "Absolute Temp Heatmap", icon: Map },
  { id: "annual-projections", label: "Annual Projections", icon: TrendingUp },
  { id: "continental", label: "Continental Statistics", icon: Globe },
  { id: "data-sources", label: "Data Sources", icon: Database },
];

const DocSection = ({
  id, title, children, image,
}: {
  id: string; title: string; children: React.ReactNode; image?: string;
}) => (
  <section id={id} className="scroll-mt-20">
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span className="w-1 h-6 bg-[#4F46E5] rounded-full" />
      {title}
    </h2>
    {image && (
      <div className="mb-5 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <img src={image} alt={title} className="w-full object-cover" />
      </div>
    )}
    <div className="text-[14px] text-gray-700 leading-relaxed space-y-3">
      {children}
    </div>
  </section>
);

const Badge = ({ children, color = "bg-gray-100 text-gray-600" }: { children: React.ReactNode; color?: string }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${color}`}>
    {children}
  </span>
);

const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
    <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
    <div className="text-[13px] text-blue-800">{children}</div>
  </div>
);

export default function MapsDocs() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-screen flex flex-col bg-[#4F46E5]">
      {/* ═══ TOP NAV ═══ */}
      <header className="h-[56px] bg-[#4F46E5] flex items-center px-5 shrink-0 z-20">
        <Link to="/maps" className="flex items-center gap-2.5 mr-6 hover:opacity-80 transition-opacity">
          <img src={farmlyLogo} alt="FarmlyCarbon" className="h-8 w-8 rounded-lg object-contain" />
          <span className="text-[16px] font-bold tracking-tight text-white">Maps & Charts Docs</span>
        </Link>
        <span className="text-[9px] font-bold tracking-widest px-2 py-[3px] rounded-full bg-white/20 text-white/90 leading-none mr-4">
          v1.0
        </span>
        <nav className="hidden md:flex items-center gap-1 ml-2">
          <Link
            to="/maps"
            className="px-3 py-1.5 text-[11px] font-semibold tracking-wide rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            BACK TO MAPS
          </Link>
        </nav>
      </header>

      {/* ═══ BODY ═══ */}
      <div className="flex flex-1 overflow-hidden bg-[#EEF2FF] rounded-t-2xl">
        {/* Sidebar */}
        <aside className="w-[240px] bg-white border-r border-gray-200 shrink-0 hidden lg:flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-[13px] font-semibold text-gray-800">Documentation</span>
          </div>
          <ScrollArea className="flex-1">
            <div className="py-2">
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-left text-[12px] transition-colors ${
                      activeSection === s.id
                        ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold border-r-2 border-[#4F46E5]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </aside>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-12">

            {/* ── Overview ── */}
            <DocSection id="overview" title="Environmental Maps & Charts — Overview">
              <p>
                The <strong>Environmental Maps & Charts</strong> module is a comprehensive climate and environmental
                monitoring dashboard that combines real-time satellite data with historical climate analysis. It provides
                actionable insights for sustainability professionals, researchers, and policy makers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-[13px] font-bold text-gray-900 mb-1">🗺️ Interactive Maps</h4>
                  <p className="text-[12px] text-gray-500">Real-time wildfire tracking and deforestation hotspot monitoring with satellite data.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-[13px] font-bold text-gray-900 mb-1">📊 Climate Charts</h4>
                  <p className="text-[12px] text-gray-500">Temperature anomaly analysis, daily mean temperature tracking, and heatmap visualizations.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-[13px] font-bold text-gray-900 mb-1">🌡️ Heatmaps</h4>
                  <p className="text-[12px] text-gray-500">Blue-to-red diverging color scales showing warming trends from 1940 to present.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-[13px] font-bold text-gray-900 mb-1">🌍 Continental Stats</h4>
                  <p className="text-[12px] text-gray-500">Regional temperature statistics for all major continents with live data.</p>
                </div>
              </div>
              <InfoBox>
                All data is sourced from authoritative scientific institutions including NASA FIRMS, ERA5 reanalysis,
                Hansen/UMD Global Forest Change, and Open-Meteo Climate API.
              </InfoBox>
            </DocSection>

            {/* ── Wildfire Activity Map ── */}
            <DocSection id="wildfire" title="Wildfire Activity Map" image="/docs/maps-wildfire.jpg">
              <p>
                The <strong>Wildfire Activity Map</strong> displays real-time fire detections from NASA's Fire Information
                for Resource Management System (FIRMS). Data is fetched via a backend function that queries the NASA FIRMS API.
              </p>
              <h4 className="font-semibold text-gray-900 mt-4">Key Features</h4>
              <ul className="list-disc list-inside space-y-1 text-[13px]">
                <li><strong>Real-time data</strong> — Updated every 24 hours from NASA satellites</li>
                <li><strong>Multiple satellite sources</strong> — VIIRS SNPP, VIIRS NOAA-20, MODIS, Landsat</li>
                <li><strong>Fire Radiative Power (FRP)</strong> — Color-coded intensity markers</li>
                <li><strong>Regional filtering</strong> — Focus on specific continents or view globally</li>
              </ul>
              <h4 className="font-semibold text-gray-900 mt-4">Marker Color Legend</h4>
              <div className="flex gap-4 text-[12px]">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /> FRP &gt; 50 MW (High)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400" /> FRP 20–50 MW (Medium)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-400" /> FRP &lt; 20 MW (Low)</span>
              </div>
              <InfoBox>
                Fire Radiative Power (FRP) measures the rate of radiant heat output from a fire in megawatts (MW).
                Higher FRP values indicate more intense fires with greater biomass combustion.
              </InfoBox>
            </DocSection>

            {/* ── Deforestation Hotspots ── */}
            <DocSection id="deforestation" title="Deforestation Hotspots Map" image="/docs/maps-deforestation.jpg">
              <p>
                The <strong>Deforestation Hotspots</strong> map visualizes tree cover loss data from the Hansen/UMD/Google/USGS/NASA
                Global Forest Change dataset (2000–2024). Each marker represents a region experiencing significant forest loss.
              </p>
              <h4 className="font-semibold text-gray-900 mt-4">Severity Classification</h4>
              <div className="flex gap-4 text-[12px]">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-600" /> Critical (&gt;20% loss)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500" /> High (15–20% loss)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-500" /> Moderate (&lt;15% loss)</span>
              </div>
              <h4 className="font-semibold text-gray-900 mt-4">Data Attributes</h4>
              <ul className="list-disc list-inside space-y-1 text-[13px]">
                <li><strong>Loss percentage</strong> — Proportion of tree cover lost in the area</li>
                <li><strong>Loss year</strong> — Year the loss was detected (2000–2024)</li>
                <li><strong>Cause</strong> — Primary driver (agriculture, logging, fire, urbanization)</li>
                <li><strong>Region</strong> — Geographic classification (continent/sub-region)</li>
              </ul>
            </DocSection>

            {/* ── Temperature Anomaly Chart ── */}
            <DocSection id="anomaly-chart" title="Global Mean Temperature Anomaly vs Preindustrial (1850–1900)" image="/docs/maps-anomaly-chart.jpg">
              <p>
                This chart displays the <strong>monthly global mean temperature anomaly</strong> relative to the preindustrial
                baseline period (1850–1900). It is the primary indicator of global warming progress.
              </p>
              <h4 className="font-semibold text-gray-900 mt-4">Chart Elements</h4>
              <ul className="list-disc list-inside space-y-1 text-[13px]">
                <li><strong>Gray lines</strong> — Individual monthly anomaly values (high variability)</li>
                <li><strong>Red line</strong> — 12-month (365-day) rolling average, smoothing seasonal noise</li>
                <li><strong>Orange dashed line</strong> — The 1.5°C Paris Agreement threshold</li>
              </ul>
              <h4 className="font-semibold text-gray-900 mt-4">Tooltip (Climate Brink Style)</h4>
              <p>
                Hovering over the chart displays a rich, color-coded tooltip showing:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[13px]">
                <li>Current date's daily anomaly and 365-day rolling average</li>
                <li><Badge color="bg-blue-600 text-white">2025</Badge> — Full-year annual anomaly</li>
                <li><Badge color="bg-orange-500 text-white">2026 YTD</Badge> — Year-to-date anomaly</li>
                <li><Badge color="bg-red-600 text-white">2026 Prediction</Badge> — Projected annual value (±0.13°C)</li>
              </ul>
              <h4 className="font-semibold text-gray-900 mt-4">X-Axis</h4>
              <p>Years displayed at 10-year intervals: 1940, 1950, 1960, ..., 2020.</p>
              <InfoBox>
                The anomaly is calculated as the difference between the observed temperature and the 1850–1900
                preindustrial average (~13.8°C). This is the standard reference period used by IPCC and major climate agencies.
              </InfoBox>
            </DocSection>

            {/* ── Daily Anomaly by Year ── */}
            <DocSection id="daily-anomaly" title="Daily Temperature Anomalies by Year">
              <p>
                This <strong>spaghetti plot</strong> overlays monthly anomaly values for each year, with all historical years
                shown as faint gray lines and recent years highlighted in distinct colors.
              </p>
              <h4 className="font-semibold text-gray-900 mt-4">Year Color Coding</h4>
              <div className="flex gap-4 text-[12px] flex-wrap">
                <span className="flex items-center gap-1.5"><span className="w-4 h-[3px] rounded bg-blue-600" /> 2023</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-[3px] rounded bg-orange-500" /> 2024</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-[3px] rounded bg-red-600" /> 2025</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-[3px] rounded bg-purple-600" /> 2026</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-[1px] bg-gray-300" /> Historical (1940–2022)</span>
              </div>
              <p className="mt-3">
                The X-axis shows months (Jan–Dec), and the Y-axis shows anomaly values from −0.5°C to 2.0°C.
                The orange dashed 1.5°C reference line marks the Paris Agreement target.
              </p>
              <h4 className="font-semibold text-gray-900 mt-4">Tooltip</h4>
              <p>
                Only recent years (2023, 2024, 2025) are shown in the tooltip with color-coded rows for quick comparison.
              </p>
            </DocSection>

            {/* ── Daily Global Mean Temperature ── */}
            <DocSection id="daily-temp" title="Daily Global Mean Temperature" image="/docs/maps-daily-temp-chart.jpg">
              <p>
                Similar to the anomaly spaghetti plot, this chart shows <strong>absolute temperature values</strong> (°C)
                rather than anomalies. It clearly visualizes the annual seasonal cycle (cooler in Jan/Dec, warmer in Jul/Aug)
                and how recent years ride above the historical envelope.
              </p>
              <h4 className="font-semibold text-gray-900 mt-4">Key Observations</h4>
              <ul className="list-disc list-inside space-y-1 text-[13px]">
                <li>Y-axis range: 11°C to 17°C (absolute global mean surface temperature)</li>
                <li>Seasonal peak typically occurs in July–August (~16.5°C in recent years)</li>
                <li>The envelope of gray lines shows the full historical range</li>
                <li>Recent years (2023–2025) consistently track at the top or above the historical envelope</li>
              </ul>
            </DocSection>

            {/* ── Absolute Temperature (Long-term) ── */}
            <DocSection id="absolute-chart" title="Global Mean Temperature (Absolute)">
              <p>
                This long-term chart shows <strong>monthly absolute temperatures</strong> from 1940 to present with a
                12-month rolling average overlay. Unlike the anomaly chart, this shows the actual temperature in °C.
              </p>
              <h4 className="font-semibold text-gray-900 mt-4">Chart Elements</h4>
              <ul className="list-disc list-inside space-y-1 text-[13px]">
                <li><strong>Gray lines</strong> — Raw monthly absolute temperature</li>
                <li><strong>Blue line</strong> — 12-month rolling average</li>
              </ul>
              <p className="mt-2">
                X-axis labels appear at 10-year intervals. Y-axis ranges from 12°C to 16°C.
              </p>
            </DocSection>

            {/* ── Anomaly Heatmap ── */}
            <DocSection id="heatmap-anomaly" title="Temperature Anomaly Heatmap" image="/docs/maps-heatmap.jpg">
              <p>
                The <strong>Temperature Anomaly Heatmap</strong> provides a compact view of warming trends across
                all months and years simultaneously. Inspired by the <em>Climate Brink</em> dashboard style.
              </p>
              <h4 className="font-semibold text-gray-900 mt-4">How to Read</h4>
              <ul className="list-disc list-inside space-y-1 text-[13px]">
                <li><strong>Y-axis</strong> — Months (Jan at top, Dec at bottom)</li>
                <li><strong>X-axis</strong> — Years (1940 to present, labeled every decade)</li>
                <li><strong>Color scale</strong> — Blue (cold anomaly, below baseline) → White (near baseline) → Red (warm anomaly)</li>
              </ul>
              <h4 className="font-semibold text-gray-900 mt-4">Color Scale</h4>
              <div className="flex items-center gap-2 text-[12px]">
                <div className="w-32 h-4 rounded" style={{ background: "linear-gradient(to right, hsl(220,90%,30%), hsl(210,50%,85%), white, hsl(15,60%,75%), hsl(0,85%,35%))" }} />
                <span>0°C → 0.5°C → 1.0°C → 1.5°C → 2.0°C</span>
              </div>
              <InfoBox>
                Hovering over any cell reveals the exact month, year, and anomaly value. The clear shift from blue (left/earlier decades)
                to red (right/recent decades) powerfully illustrates accelerating global warming.
              </InfoBox>
            </DocSection>

            {/* ── Absolute Heatmap ── */}
            <DocSection id="heatmap-absolute" title="Daily Global Mean Temperature Heatmap">
              <p>
                This companion heatmap shows <strong>absolute monthly temperatures</strong> rather than anomalies.
                It visualizes both the seasonal cycle (warm summer months in red, cool winter months in blue) and
                the long-term warming trend (recent years uniformly redder).
              </p>
              <h4 className="font-semibold text-gray-900 mt-4">Color Scale</h4>
              <div className="flex items-center gap-2 text-[12px]">
                <div className="w-32 h-4 rounded" style={{ background: "linear-gradient(to right, hsl(215,90%,30%), hsl(210,45%,80%), white, hsl(10,70%,65%), hsl(0,95%,37%))" }} />
                <span>12°C → 13°C → 14°C → 15°C → 16°C → 17°C</span>
              </div>
            </DocSection>

            {/* ── Annual Projections ── */}
            <DocSection id="annual-projections" title="Annual Temperature Anomaly Projections" image="/docs/maps-annual-projections.jpg">
              <p>
                The <strong>Annual Projections</strong> chart shows year-by-year average temperature anomaly with
                a light blue area fill for context. It provides a cleaner view of the long-term trend without
                monthly noise.
              </p>
              <h4 className="font-semibold text-gray-900 mt-4">Chart Elements</h4>
              <ul className="list-disc list-inside space-y-1 text-[13px]">
                <li><strong>Blue area + line</strong> — Annual mean anomaly</li>
                <li><strong>Orange dashed line</strong> — 1.5°C Paris Agreement threshold</li>
              </ul>
              <p className="mt-2">
                This is useful for identifying whether the world is on track to exceed the 1.5°C warming limit
                on an annual basis (vs. individual months).
              </p>
            </DocSection>

            {/* ── Continental Statistics ── */}
            <DocSection id="continental" title="Continental Temperature Statistics">
              <p>
                The <strong>Continental Statistics</strong> table summarizes temperature data for each major region:
                Africa, Asia, Europe, North America, South America, Oceania, and Antarctica.
              </p>
              <h4 className="font-semibold text-gray-900 mt-4">Columns</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px] border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Column</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-100"><td className="px-3 py-2 font-medium">Region</td><td className="px-3 py-2 text-gray-600">Continent or major geographic area</td></tr>
                    <tr className="border-t border-gray-100"><td className="px-3 py-2 font-medium">Mean (°C)</td><td className="px-3 py-2 text-gray-600">30-day rolling mean temperature</td></tr>
                    <tr className="border-t border-gray-100"><td className="px-3 py-2 font-medium">Min (°C)</td><td className="px-3 py-2 text-gray-600">Minimum recorded in period</td></tr>
                    <tr className="border-t border-gray-100"><td className="px-3 py-2 font-medium">Max (°C)</td><td className="px-3 py-2 text-gray-600">Maximum recorded in period</td></tr>
                    <tr className="border-t border-gray-100"><td className="px-3 py-2 font-medium">Range</td><td className="px-3 py-2 text-gray-600">Difference between max and min</td></tr>
                  </tbody>
                </table>
              </div>
              <InfoBox>
                Color coding: Mean values above 20°C appear in red (hot climates), below 0°C in blue (cold climates).
                Data sourced from Open-Meteo Climate & Forecast API with 30-day rolling statistics.
              </InfoBox>
            </DocSection>

            {/* ── Data Sources ── */}
            <DocSection id="data-sources" title="Data Sources & Methodology">
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Satellite className="h-4 w-4 text-red-500" />
                    <h4 className="text-[13px] font-bold text-gray-900">NASA FIRMS</h4>
                  </div>
                  <p className="text-[12px] text-gray-600">
                    Fire Information for Resource Management System. Provides near real-time active fire data
                    from VIIRS and MODIS satellites. Data refreshed every 24 hours.
                    <br /><a href="https://firms.modaps.eosdis.nasa.gov" target="_blank" rel="noopener" className="text-blue-600 hover:underline">firms.modaps.eosdis.nasa.gov</a>
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    <h4 className="text-[13px] font-bold text-gray-900">Hansen Global Forest Change</h4>
                  </div>
                  <p className="text-[12px] text-gray-600">
                    Hansen/UMD/Google/USGS/NASA dataset mapping global tree cover extent, loss, and gain
                    at 30m resolution from 2000–2024.
                    <br /><a href="https://glad.earthengine.app/view/global-forest-change" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Global Forest Change Explorer</a>
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <h4 className="text-[13px] font-bold text-gray-900">ERA5 Reanalysis / Open-Meteo</h4>
                  </div>
                  <p className="text-[12px] text-gray-600">
                    Global temperature data based on ERA5 reanalysis by ECMWF, accessed via the Open-Meteo
                    Climate API. Provides monthly global mean 2m temperature from 1940 to present.
                    <br /><a href="https://open-meteo.com/en/docs/climate-api" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Open-Meteo Climate API</a>
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    <h4 className="text-[13px] font-bold text-gray-900">The Climate Brink</h4>
                  </div>
                  <p className="text-[12px] text-gray-600">
                    Dashboard design and tooltip patterns inspired by The Climate Brink project by Dr. Zeke Hausfather.
                    <br /><a href="https://dashboard.theclimatebrink.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline">dashboard.theclimatebrink.com</a>
                  </p>
                </div>
              </div>
            </DocSection>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 pb-12 text-center">
              <p className="text-[11px] text-gray-400">
                FarmlyCarbon Environmental Maps & Charts Documentation v1.0
              </p>
              <Link to="/maps" className="text-[12px] text-[#4F46E5] hover:underline font-semibold mt-2 inline-block">
                ← Back to Maps & Charts
              </Link>
            </div>

          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
