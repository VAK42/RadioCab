"use client";
import { useEffect, useRef, useState } from "react";
type LatLng = [number, number];
interface DriverTripMapProps {
  order: any;
}
export default function DriverTripMap({ order }: DriverTripMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const pickupMarker = useRef<any>(null);
  const dropoffMarker = useRef<any>(null);
  const driverMarker = useRef<any>(null);
  const geolocationWatchId = useRef<number | null>(null);
  const lastPickupRef = useRef<LatLng | null>(null);
  const lastDropoffRef = useRef<LatLng | null>(null);
  const driverCoordsRef = useRef<LatLng | null>(null);
  const lastHeadingRef = useRef<number>(0);
  const driverArrowElRef = useRef<HTMLDivElement | null>(null);
  const prevDriverCoordsRef = useRef<LatLng | null>(null);
  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<LatLng | null>(null);
  const [ready, setReady] = useState(false);
  const tomtomApiKey = 'bQrbmvGHDhZA0DUXLOFxLRnYNNrbqgEq';
  const mapboxAccessToken = 'pk.eyJ1Ijoic3ViaGFtcHJlZXQiLCJhIjoiY2toY2IwejF1MDdodzJxbWRuZHAweDV6aiJ9.Ys8MP5kVTk5P9V2TDvnuDg';
  useEffect(() => {
    const ensureMapbox = async () => {
      if (typeof window !== 'undefined' && (window as any).mapboxgl) return;
      await new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
        script.onload = () => {
          const link = document.createElement('link');
          link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
          link.rel = 'stylesheet';
          document.head.appendChild(link);
          resolve();
        };
        document.body.appendChild(script);
      });
    };
    const init = async () => {
      await ensureMapbox();
      await geocodeAddresses();
      initializeMap();
      setReady(true);
      startDriverGeolocation();
    };
    init();
    return () => {
      if (geolocationWatchId.current !== null && navigator.geolocation) {
        try { navigator.geolocation.clearWatch(geolocationWatchId.current); } catch { }
      }
      try { pickupMarker.current?.remove(); } catch { }
      try { dropoffMarker.current?.remove(); } catch { }
      try { driverMarker.current?.remove(); } catch { }
      if (mapInstance.current) {
        try { mapInstance.current.remove(); } catch { }
        mapInstance.current = null;
      }
    };
  }, [order?.orderId]);
  const geocodeAddresses = async () => {
    const forward = async (address?: string): Promise<LatLng | null> => {
      if (!address) return null;
      try {
        const resp = await fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(address)}.json?key=${tomtomApiKey}&countrySet=VN&limit=1`);
        if (!resp.ok) return null;
        const data = await resp.json();
        const result = data.results?.[0];
        if (result?.position) return [result.position.lon, result.position.lat];
      } catch { }
      return null;
    };
    const [p, d] = await Promise.all([
      forward(order?.pickupAddress),
      forward(order?.dropoffAddress)
    ]);
    if (p) {
      setPickupCoords(p);
      lastPickupRef.current = p;
    }
    if (d) {
      setDropoffCoords(d);
      lastDropoffRef.current = d;
    }
  };
  const initializeMap = () => {
    if (!mapRef.current || mapInstance.current) return;
    (window as any).mapboxgl.accessToken = mapboxAccessToken;
    mapInstance.current = new (window as any).mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: pickupCoords || [105.8342, 21.0285],
      zoom: pickupCoords ? 13 : 11
    });
    mapInstance.current.addControl(new (window as any).mapboxgl.NavigationControl());
    mapInstance.current.on('load', () => {
      drawOrderMarkers();
      calculateRoute();
      calculateDriverToPickupRoute();
      fitBounds();
    });
  };
  const drawOrderMarkers = () => {
    if (!mapInstance.current) return;
    const pick = pickupCoords || lastPickupRef.current;
    const drop = dropoffCoords || lastDropoffRef.current;
    if (pick) {
      if (pickupMarker.current) {
        try { pickupMarker.current.setLngLat(pick); } catch { }
      } else {
        pickupMarker.current = new (window as any).mapboxgl.Marker({ color: '#10b981' })
          .setLngLat(pick)
          .setPopup(new (window as any).mapboxgl.Popup().setHTML(`<div class="p-2"><strong>Điểm Đón</strong><div>${order?.pickupAddress || ''}</div></div>`))
          .addTo(mapInstance.current);
      }
    }
    if (drop) {
      if (dropoffMarker.current) {
        try { dropoffMarker.current.setLngLat(drop); } catch { }
      } else {
        dropoffMarker.current = new (window as any).mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat(drop)
          .setPopup(new (window as any).mapboxgl.Popup().setHTML(`<div class="p-2"><strong>Điểm Đến</strong><div>${order?.dropoffAddress || ''}</div></div>`))
          .addTo(mapInstance.current);
      }
    }
  };
  const fitBounds = () => {
    if (!mapInstance.current) return;
    const points: LatLng[] = [];
    if (pickupCoords) points.push(pickupCoords);
    if (dropoffCoords) points.push(dropoffCoords);
    if (points.length === 0) return;
    const bounds = points.reduce((b: any, c: any) => b.extend(c), new (window as any).mapboxgl.LngLatBounds(points[0], points[0]));
    mapInstance.current.fitBounds(bounds, { padding: 60, animate: true });
  };
  function toRad(deg: number) { return (deg * Math.PI) / 180; }
  function toDeg(rad: number) { return (rad * 180) / Math.PI; }
  function computeBearing(from: LatLng, to: LatLng): number {
    const [lng1, lat1] = from;
    const [lng2, lat2] = to;
    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const deltaLambda = toRad(lng2 - lng1);
    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
    const theta = Math.atan2(y, x);
    const brng = (toDeg(theta) + 360) % 360;
    return brng;
  }
  function haversineMeters(from: LatLng, to: LatLng): number {
    const r = 6371000;
    const [lng1, lat1] = from;
    const [lng2, lat2] = to;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return r * c;
  }
  const calculateRoute = async () => {
    if (!mapInstance.current || !pickupCoords || !dropoffCoords) return;
    const map = mapInstance.current;
    const isLoaded = typeof map.isStyleLoaded === 'function' ? map.isStyleLoaded() : true;
    if (!isLoaded) {
      map.once('load', () => calculateRoute());
      return;
    }
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords[0]},${pickupCoords[1]};${dropoffCoords[0]},${dropoffCoords[1]}?access_token=${mapboxAccessToken}&geometries=geojson&overview=full`;
      const resp = await fetch(url);
      if (!resp.ok) return;
      const data = await resp.json();
      const route = data.routes?.[0];
      if (!route?.geometry) return;
      if (map.getSource('route')) {
        try {
          if (map.getLayer('route')) map.removeLayer('route');
          map.removeSource('route');
        } catch { }
      }
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route.geometry
        }
      });
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#3b82f6', 'line-width': 4 }
      });
      drawOrderMarkers();
    } catch (e) {
    }
  };
  const calculateDriverToPickupRoute = async () => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    const driver = driverCoordsRef.current;
    const pick = pickupCoords || lastPickupRef.current;
    if (!driver || !pick) return;
    const isLoaded = typeof map.isStyleLoaded === 'function' ? map.isStyleLoaded() : true;
    if (!isLoaded) {
      map.once('load', () => calculateDriverToPickupRoute());
      return;
    }
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${driver[0]},${driver[1]};${pick[0]},${pick[1]}?access_token=${mapboxAccessToken}&geometries=geojson&overview=full`;
      const resp = await fetch(url);
      if (!resp.ok) return;
      const data = await resp.json();
      const route = data.routes?.[0];
      if (!route?.geometry) return;
      if (map.getSource('route-driver')) {
        try {
          if (map.getLayer('route-driver')) map.removeLayer('route-driver');
          map.removeSource('route-driver');
        } catch { }
      }
      map.addSource('route-driver', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route.geometry
        }
      });
      map.addLayer({
        id: 'route-driver',
        type: 'line',
        source: 'route-driver',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#10b981', 'line-width': 3, 'line-opacity': 0.9 }
      });
    } catch (e) {
    }
  };
  const startDriverGeolocation = () => {
    if (!navigator.geolocation || !mapInstance.current) return;
    const icon = () => {
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      const arrowWrap = document.createElement('div');
      arrowWrap.style.width = '36px';
      arrowWrap.style.height = '36px';
      arrowWrap.style.display = 'flex';
      arrowWrap.style.alignItems = 'center';
      arrowWrap.style.justifyContent = 'center';
      arrowWrap.style.filter = 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))';
      arrowWrap.style.transformOrigin = '50% 50%';
      arrowWrap.innerHTML = `
<svg viewBox="0 0 48 48" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
<g fill="none" fill-rule="evenodd">
<path d="M24 4 L34 28 L24 24 L14 28 Z" fill="#10b981" stroke="#065f46" stroke-width="2" stroke-linejoin="round"/>
</g>
</svg>
`;
      container.appendChild(arrowWrap);
      driverArrowElRef.current = arrowWrap;
      return container;
    };
    geolocationWatchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: LatLng = [pos.coords.longitude, pos.coords.latitude];
        const prev = driverCoordsRef.current || prevDriverCoordsRef.current;
        driverCoordsRef.current = coords;
        let heading = typeof pos.coords.heading === 'number' && !isNaN(pos.coords.heading)
          ? pos.coords.heading as number
          : undefined;
        if (heading === undefined && prev) {
          const distanceMoved = haversineMeters(prev, coords);
          if (distanceMoved > 1) {
            heading = computeBearing(prev, coords);
          }
        }
        if (heading === undefined) heading = lastHeadingRef.current || 0;
        lastHeadingRef.current = heading;
        if (!driverMarker.current) {
          driverMarker.current = new (window as any).mapboxgl.Marker({ element: icon(), anchor: 'center' })
            .setLngLat(coords)
            .addTo(mapInstance.current);
        } else {
          try { driverMarker.current.setLngLat(coords); } catch { }
        }
        if (driverArrowElRef.current) {
          try { driverArrowElRef.current.style.transform = `rotate(${heading}deg)`; } catch { }
        }
        prevDriverCoordsRef.current = coords;
        calculateDriverToPickupRoute();
      },
      (err) => {
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
  };
  useEffect(() => {
    if (!ready) return;
    drawOrderMarkers();
    calculateRoute();
    calculateDriverToPickupRoute();
    fitBounds();
  }, [ready, pickupCoords, dropoffCoords]);
  return (
    <div className="w-full h-[540px] rounded-lg border border-gray-200 dark:border-gray-700" ref={mapRef} />
  )
}