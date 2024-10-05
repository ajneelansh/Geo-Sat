import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  onCoordinatesChange: (coordinates: string) => void
}

export default function Map({ onCoordinatesChange }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([0, 0], 2)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current)

      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng
        if (markerRef.current) {
          mapRef.current?.removeLayer(markerRef.current)
        }
        markerRef.current = L.marker([lat, lng]).addTo(mapRef.current!)
        onCoordinatesChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
      })
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [onCoordinatesChange])

  return <div id="map" className="h-96 w-full rounded-lg" />
}