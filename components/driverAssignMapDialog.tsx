"use client";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../components/ui/badge";
type LatLng = [number, number];
interface DriverAssignMapDialogProps {
  order: any | null;
  schedules: any[];
  onSelectDriver: (schedule: any) => void;
}
interface DriverMarker {
  marker: any;
  coords: LatLng;
  schedule: any;
}
export default function DriverAssignMapDialog({ order, schedules, onSelectDriver }: DriverAssignMapDialogProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const pickupMarker = useRef<any>(null);
  const dropoffMarker = useRef<any>(null);
  const driversRef = useRef<Map<number, DriverMarker>>(new Map());
  const moveTimerRef = useRef<any>(null);
  const lastPickupRef = useRef<LatLng | null>(null);
  const lastDropoffRef = useRef<LatLng | null>(null);
  const resizeObserverRef = useRef<any>(null);
  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<LatLng | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [driverList, setDriverList] = useState<Array<{ driverId: number; name: string; plate?: string; distanceKm: number | null; schedule: any }>>([]);
  const tomtomApiKey = 'bQrbmvGHDhZA0DUXLOFxLRnYNNrbqgEq';
  const mapboxAccessToken = 'pk.eyJ1Ijoic3ViaGFtcHJlZXQiLCJhIjoiY2toY2IwejF1MDdodzJxbWRuZHAweDV6aiJ9.Ys8MP5kVTk5P9V2TDvnuDg';
  useEffect(() => {
    if (!order) return;
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
        document.head.appendChild(script);
      });
    };
    const init = async () => {
      await ensureMapbox();
      await geocodeAddresses();
      initializeMap();
      setIsReady(true);
    };
    init();
    return () => {
      if (moveTimerRef.current) {
        clearInterval(moveTimerRef.current);
      }
      driversRef.current.forEach(d => {
        try { d.marker.remove(); } catch { }
      });
      driversRef.current.clear();
      try { pickupMarker.current?.remove(); } catch { }
      try { dropoffMarker.current?.remove(); } catch { }
      if (mapInstance.current) {
        try { mapInstance.current.remove(); } catch { }
        mapInstance.current = null;
      }
      try { resizeObserverRef.current?.disconnect?.(); } catch { }
    };
  }, [order?.orderId]);
  const geocodeAddresses = async () => {
    try {
      const forward = async (address?: string): Promise<LatLng | null> => {
        if (!address) return null;
        const resp = await fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(address)}.json?key=${tomtomApiKey}&countrySet=VN&limit=1`);
        if (!resp.ok) return null;
        const data = await resp.json();
        const result = data.results?.[0];
        if (result?.position) return [result.position.lon, result.position.lat];
        return null;
      };
      const [pickup, dropoff] = await Promise.all([
        forward(order?.pickupAddress),
        forward(order?.dropoffAddress)
      ]);
      setPickupCoords(pickup);
      setDropoffCoords(dropoff);
      if (pickup) lastPickupRef.current = pickup;
      if (dropoff) lastDropoffRef.current = dropoff;
    } catch (e) {
    }
  };
  const initializeMap = () => {
    if (!mapRef.current || mapInstance.current) return;
    (window as any).mapboxgl.accessToken = mapboxAccessToken;
    const initialCenter = lastPickupRef.current || pickupCoords || [105.8342, 21.0285];
    mapInstance.current = new (window as any).mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: (lastPickupRef.current || pickupCoords) ? 13 : 11
    });
    mapInstance.current.addControl(new (window as any).mapboxgl.NavigationControl());
    mapInstance.current.on('load', () => {
      drawOrderMarkers();
      calculateRoute();
      spawnDriverMarkers();
      fitToBounds();
      try {
        mapInstance.current.resize();
        requestAnimationFrame(() => mapInstance.current && mapInstance.current.resize());
      } catch { }
    });
    try {
      if ('ResizeObserver' in window && mapRef.current) {
        resizeObserverRef.current = new (window as any).ResizeObserver(() => {
          try { mapInstance.current?.resize(); } catch { }
        });
        resizeObserverRef.current.observe(mapRef.current);
      }
    } catch { }
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
  const fitToBounds = () => {
    if (!mapInstance.current) return;
    const points: LatLng[] = [];
    if (pickupCoords) points.push(pickupCoords);
    if (dropoffCoords) points.push(dropoffCoords);
    driversRef.current.forEach(d => points.push(d.coords));
    if (points.length === 0) return;
    const bounds = points.reduce((b: any, c: any) => b.extend(c), new (window as any).mapboxgl.LngLatBounds(points[0], points[0]));
    mapInstance.current.fitBounds(bounds, { padding: 60, animate: true });
  };
  const calculateRoute = async () => {
    if (!mapInstance.current) return;
    const pick = pickupCoords || lastPickupRef.current;
    const drop = dropoffCoords || lastDropoffRef.current;
    if (!pick || !drop) return;
    const map = mapInstance.current;
    const isLoaded = typeof map.isStyleLoaded === 'function' ? map.isStyleLoaded() : true;
    if (!isLoaded) {
      map.once('load', () => calculateRoute());
      return;
    }
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pick[0]},${pick[1]};${drop[0]},${drop[1]}?access_token=${mapboxAccessToken}&geometries=geojson&overview=full`;
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
    } catch { }
  };
  const randomAround = (center: LatLng, maxMeters: number): LatLng => {
    const r = (Math.random() - 0.5) * 2;
    const theta = Math.random() * Math.PI * 2;
    const dx = r * Math.cos(theta);
    const dy = r * Math.sin(theta);
    const metersToLng = maxMeters / 111320;
    const metersToLat = maxMeters / 110540;
    return [center[0] + dx * metersToLng, center[1] + dy * metersToLat];
  };
  const haversineKm = (a: LatLng, b: LatLng): number => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const r = 6371;
    const dLat = toRad(b[1] - a[1]);
    const dLon = toRad(b[0] - a[0]);
    const lat1 = toRad(a[1]);
    const lat2 = toRad(b[1]);
    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);
    const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return r * c;
  };
  const recomputeDriverList = () => {
    const refPoint: LatLng | null = pickupCoords || dropoffCoords || null;
    const list: Array<{ driverId: number; name: string; plate?: string; distanceKm: number | null; schedule: any }> = [];
    driversRef.current.forEach((dm) => {
      const id = dm.schedule.driverAccountId as number;
      const name = dm.schedule.driver?.fullName || `TX #${id}`;
      const plate = dm.schedule.vehicle?.plateNumber;
      const distanceKm = refPoint ? parseFloat(haversineKm(refPoint, dm.coords).toFixed(2)) : null;
      list.push({ driverId: id, name, plate, distanceKm, schedule: dm.schedule });
    });
    list.sort((x, y) => {
      if (x.distanceKm == null && y.distanceKm == null) return 0;
      if (x.distanceKm == null) return 1;
      if (y.distanceKm == null) return -1;
      return x.distanceKm - y.distanceKm;
    });
    setDriverList(list);
  };
  const spawnDriverMarkers = () => {
    if (!mapInstance.current) return;
    driversRef.current.forEach(d => { try { d.marker.remove(); } catch { } });
    driversRef.current.clear();
    const center = pickupCoords || dropoffCoords || [105.8342, 21.0285];
    const schedulesToShow = schedules || [];
    const assignedDriverId = (order as any)?.driverAccountId;
    schedulesToShow.forEach((schedule: any) => {
      const driverId: number = schedule.driverAccountId;
      const name: string = schedule.driver?.fullName || `TX #${driverId}`;
      const start = randomAround(center as LatLng, 1200);
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.cursor = 'pointer';
      container.title = name;
      const img = document.createElement('img');
      img.src = '/taxi.png';
      img.alt = 'Driver';
      img.style.width = '44px';
      img.style.height = '44px';
      img.style.objectFit = 'contain';
      img.style.filter = 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))';
      const label = document.createElement('div');
      const plate = schedule.vehicle?.plateNumber || '';
      const shortName = name.length > 14 ? name.slice(0, 12) + '…' : name;
      label.textContent = plate ? `${shortName} • ${plate}` : shortName;
      label.style.marginTop = '2px';
      label.style.fontSize = '10px';
      label.style.lineHeight = '12px';
      label.style.background = 'rgba(255,255,255,0.92)';
      label.style.color = '#111827';
      label.style.padding = '2px 6px';
      label.style.borderRadius = '6px';
      label.style.border = '1px solid #e5e7eb';
      label.style.whiteSpace = 'nowrap';
      label.style.maxWidth = '140px';
      label.style.overflow = 'hidden';
      label.style.textOverflow = 'ellipsis';
      label.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
      if (assignedDriverId && driverId === assignedDriverId) {
        img.style.border = '3px solid #f59e0b';
        img.style.borderRadius = '50%';
        label.style.background = 'rgba(254, 243, 199, 0.95)';
        label.style.border = '1px solid #f59e0b';
        label.style.color = '#92400e';
        label.textContent = (plate ? `${shortName} • ${plate}` : shortName) + '  ★';
      }
      container.appendChild(img);
      container.appendChild(label);
      const marker = new (window as any).mapboxgl.Marker({ element: container, anchor: 'bottom' })
        .setLngLat(start)
        .setPopup(new (window as any).mapboxgl.Popup({ offset: 12 }).setHTML(
          `<div class="p-2">
<div class="flex items-center gap-2 mb-1">
<div class="w-2 h-2 rounded-full bg-green-500"></div>
<strong>${name}</strong>
</div>
<div class="text-xs text-gray-600">ID: ${driverId}</div>
${schedule.vehicle?.plateNumber ? `<div class="text-xs text-gray-600">Xe: ${schedule.vehicle.plateNumber}</div>` : ''}
<div class="mt-2">`
          + (schedule.startTime && schedule.endTime ? `<span class="text-xs">Ca: ${schedule.startTime} - ${schedule.endTime}</span>` : '') +
          `</div>
</div>`
        ))
        .addTo(mapInstance.current);
      container.addEventListener('click', () => onSelectDriver(schedule));
      driversRef.current.set(driverId, { marker, coords: start, schedule });
    });
    if (moveTimerRef.current) clearInterval(moveTimerRef.current);
    moveTimerRef.current = setInterval(() => {
      driversRef.current.forEach((dm, driverId) => {
        const next = randomAround(dm.coords, 60);
        dm.coords = next;
        try { dm.marker.setLngLat(next); } catch { }
      });
      recomputeDriverList();
    }, 3000);
    recomputeDriverList();
  };
  useEffect(() => {
    if (!isReady) return;
    drawOrderMarkers();
    calculateRoute();
    spawnDriverMarkers();
    fitToBounds();
  }, [isReady, pickupCoords, dropoffCoords, JSON.stringify(schedules?.map(s => s.driverAccountId))]);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800">Điểm Đón</Badge>
          <Badge className="bg-red-100 text-red-800">Điểm Đến</Badge>
          <Badge className="bg-blue-100 text-blue-800">Tài Xế Khả Dụng</Badge>
          {(order as any)?.driverAccountId && (
            <Badge className="bg-amber-100 text-amber-800 border border-amber-400">Tài Xế Đang Được Phân</Badge>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div ref={mapRef} className="w-full h-[540px] rounded-lg border border-gray-200 dark:border-gray-700" />
        </div>
        <div className="lg:col-span-1">
          <div className="h-[540px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 text-sm font-medium">Danh Sách Tài Xế (Theo Khoảng Cách)</div>
            {driverList.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">Chưa Có Tài Xế Khả Dụng</div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {driverList.map((d) => {
                  const isAssigned = (order as any)?.driverAccountId && d.driverId === (order as any).driverAccountId;
                  return (
                    <li key={d.driverId} className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${isAssigned ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`} onClick={() => onSelectDriver(d.schedule)} title={d.name + (d.plate ? ` • ${d.plate}` : '')}>
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className={`text-sm font-semibold ${isAssigned ? 'text-amber-800 dark:text-amber-300' : 'text-gray-900 dark:text-gray-100'}`}>{d.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{d.plate || '—'}</div>
                        </div>
                        <div className={`ml-3 text-sm font-medium ${isAssigned ? 'text-amber-800 dark:text-amber-300' : 'text-gray-800 dark:text-gray-200'}`}>
                          {d.distanceKm != null ? `${d.distanceKm.toFixed(2)} Km` : '—'}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}