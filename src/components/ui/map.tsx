"use client"

import * as React from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { cn } from "@/lib/utils"

// Light and dark theme tile URLs (CARTO free tiles)
const LIGHT_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
const DARK_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"

interface MapContextValue {
  map: maplibregl.Map | null
}

const MapContext = React.createContext<MapContextValue>({ map: null })

export function useMap() {
  const context = React.useContext(MapContext)
  if (!context) {
    throw new Error("useMap must be used within a Map component")
  }
  return context.map
}

interface MapProps {
  center?: [number, number]
  zoom?: number
  pitch?: number
  bearing?: number
  minZoom?: number
  maxZoom?: number
  interactive?: boolean
  theme?: "light" | "dark" | "auto"
  onMapLoad?: (map: maplibregl.Map) => void
  onMapMove?: (map: maplibregl.Map) => void
  onMapMoveEnd?: (map: maplibregl.Map) => void
  className?: string
  children?: React.ReactNode
}

const Map = React.forwardRef<HTMLDivElement, MapProps>(
  (
    {
      center = [0, 0],
      zoom = 1,
      pitch = 0,
      bearing = 0,
      minZoom,
      maxZoom,
      interactive = true,
      theme = "light",
      onMapLoad,
      onMapMove,
      onMapMoveEnd,
      className,
      children,
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const mapRef = React.useRef<maplibregl.Map | null>(null)
    const [map, setMap] = React.useState<maplibregl.Map | null>(null)

    // Determine style based on theme
    const style = theme === "dark" ? DARK_STYLE : LIGHT_STYLE

    React.useEffect(() => {
      if (!containerRef.current || mapRef.current) return

      const mapInstance = new maplibregl.Map({
        container: containerRef.current,
        style,
        center,
        zoom,
        pitch,
        bearing,
        minZoom,
        maxZoom,
        interactive,
        attributionControl: false,
      })

      mapInstance.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        "bottom-right"
      )

      mapInstance.on("load", () => {
        setMap(mapInstance)
        onMapLoad?.(mapInstance)
      })

      mapInstance.on("move", () => {
        onMapMove?.(mapInstance)
      })

      mapInstance.on("moveend", () => {
        onMapMoveEnd?.(mapInstance)
      })

      mapRef.current = mapInstance

      return () => {
        mapInstance.remove()
        mapRef.current = null
        setMap(null)
      }
    }, [])

    // Update style when theme changes
    React.useEffect(() => {
      if (mapRef.current) {
        mapRef.current.setStyle(style)
      }
    }, [style])

    return (
      <MapContext.Provider value={{ map }}>
        <div
          ref={(node) => {
            containerRef.current = node
            if (typeof ref === "function") ref(node)
            else if (ref) ref.current = node
          }}
          className={cn("relative w-full h-full min-h-[200px]", className)}
        >
          {map && children}
        </div>
      </MapContext.Provider>
    )
  }
)
Map.displayName = "Map"

// MapControls component
interface MapControlsProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  showZoom?: boolean
  showCompass?: boolean
  showFullscreen?: boolean
}

function MapControls({
  position = "top-right",
  showZoom = true,
  showCompass = true,
  showFullscreen = false,
}: MapControlsProps) {
  const map = useMap()

  React.useEffect(() => {
    if (!map) return

    const controls: maplibregl.IControl[] = []

    if (showZoom || showCompass) {
      const navControl = new maplibregl.NavigationControl({
        showZoom,
        showCompass,
        visualizePitch: true,
      })
      map.addControl(navControl, position)
      controls.push(navControl)
    }

    if (showFullscreen) {
      const fullscreenControl = new maplibregl.FullscreenControl()
      map.addControl(fullscreenControl, position)
      controls.push(fullscreenControl)
    }

    return () => {
      controls.forEach((control) => {
        if (map.hasControl(control)) {
          map.removeControl(control)
        }
      })
    }
  }, [map, position, showZoom, showCompass, showFullscreen])

  return null
}

// MapMarker component
interface MapMarkerProps {
  longitude: number
  latitude: number
  children?: React.ReactNode
  onClick?: () => void
}

function MapMarker({ longitude, latitude, children, onClick }: MapMarkerProps) {
  const map = useMap()
  const markerRef = React.useRef<maplibregl.Marker | null>(null)

  React.useEffect(() => {
    if (!map) return

    const el = document.createElement("div")
    el.className = "map-marker-container"
    
    if (onClick) {
      el.style.cursor = "pointer"
      el.addEventListener("click", onClick)
    }

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([longitude, latitude])
      .addTo(map)

    markerRef.current = marker

    // Render React children into the marker element
    if (children) {
      const root = document.createElement("div")
      el.appendChild(root)
      import("react-dom/client").then(({ createRoot }) => {
        const reactRoot = createRoot(root)
        reactRoot.render(children as React.ReactElement)
      })
    } else {
      // Default marker style
      el.innerHTML = `
        <div style="
          width: 24px;
          height: 24px;
          background: #4285F4;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
      `
    }

    return () => {
      marker.remove()
    }
  }, [map, longitude, latitude, children, onClick])

  return null
}

// MapRoute component
interface MapRouteProps {
  coordinates: [number, number][]
  color?: string
  width?: number
  opacity?: number
  dashArray?: [number, number]
  curved?: boolean
}

function MapRoute({
  coordinates,
  color = "#4285F4",
  width = 3,
  opacity = 0.8,
  dashArray,
  curved = false,
}: MapRouteProps) {
  const map = useMap()
  const sourceId = React.useId()

  React.useEffect(() => {
    if (!map || coordinates.length < 2) return

    const routeSourceId = `route-${sourceId}`
    const routeLayerId = `route-layer-${sourceId}`
    const routeBgLayerId = `route-bg-layer-${sourceId}`

    // Generate curved coordinates if needed
    let routeCoordinates: [number, number][] = []
    if (curved) {
      // For multi-point routes, generate curves between each segment
      for (let i = 0; i < coordinates.length - 1; i++) {
        const segmentPoints = generateArcPoints(coordinates[i], coordinates[i + 1], 50)
        // Avoid duplicating the last point of previous segment
        if (i > 0) segmentPoints.shift()
        routeCoordinates.push(...segmentPoints)
      }
    } else {
      routeCoordinates = coordinates
    }

    const addRoute = () => {
      try {
        // Remove existing layers and sources first
        if (map.getLayer(routeLayerId)) map.removeLayer(routeLayerId)
        if (map.getLayer(routeBgLayerId)) map.removeLayer(routeBgLayerId)
        if (map.getSource(routeSourceId)) map.removeSource(routeSourceId)

        // Add source
        map.addSource(routeSourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: routeCoordinates,
            },
          },
        })

        // Add background layer for better visibility
        map.addLayer({
          id: routeBgLayerId,
          type: "line",
          source: routeSourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": color,
            "line-width": width + 2,
            "line-opacity": opacity * 0.3,
          },
        })

        // Add main route layer
        map.addLayer({
          id: routeLayerId,
          type: "line",
          source: routeSourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": color,
            "line-width": width,
            "line-opacity": opacity,
            ...(dashArray && { "line-dasharray": dashArray }),
          },
        })
      } catch (e) {
        console.error("Error adding route:", e)
      }
    }

    // Add route when style is loaded
    const handleStyleLoad = () => addRoute()
    
    if (map.isStyleLoaded()) {
      addRoute()
    } else {
      map.on("style.load", handleStyleLoad)
    }

    return () => {
      map.off("style.load", handleStyleLoad)
      try {
        if (map.getLayer(routeLayerId)) map.removeLayer(routeLayerId)
        if (map.getLayer(routeBgLayerId)) map.removeLayer(routeBgLayerId)
        if (map.getSource(routeSourceId)) map.removeSource(routeSourceId)
      } catch (e) {
        // Map might already be removed
      }
    }
  }, [map, coordinates, color, width, opacity, dashArray, curved, sourceId])

  return null
}

// Helper function to generate arc points for curved routes
function generateArcPoints(
  start: [number, number],
  end: [number, number],
  numPoints = 100
): [number, number][] {
  const points: [number, number][] = []

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints

    // Interpolate longitude
    const lng = start[0] + (end[0] - start[0]) * t

    // Interpolate latitude
    const lat = start[1] + (end[1] - start[1]) * t

    // Add curvature - higher arc for longer distances
    const distance = Math.sqrt(
      Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)
    )
    const arcHeight = Math.min(distance * 0.15, 15) // Max 15 degrees arc
    const arcOffset = Math.sin(Math.PI * t) * arcHeight

    points.push([lng, lat + arcOffset])
  }

  return points
}

export { Map, MapControls, MapMarker, MapRoute, generateArcPoints }
