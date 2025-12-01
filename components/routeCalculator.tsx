"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { MapPin, Route, Clock, DollarSign, Navigation, Car, Crosshair, Cloud, Thermometer, Droplets, Wind, AlertTriangle, CheckCircle, Eye, X } from "lucide-react";
import { getCurrentUser } from "../lib/auth";
import { apiService } from "../lib/api";
import { locationDatabase, getRushHourFactor, getRushHourStatus } from "../lib/mapUtils";
import { weatherApi } from "../lib/weatherApi";
import { trafficApi } from "../lib/trafficApi";
interface Location {
  coords: [number, number];
  name: string;
}
interface RouteInfo {
  distance: number;
  duration: number;
  price: number;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  trafficLevel: string;
  trafficMultiplier: number;
  rushHourFee?: number;
  weatherImpact?: string;
  weatherFactor?: number;
}
declare global {
  interface Window {
    mapboxgl: any;
  }
}
interface RouteCalculatorProps {
  modelPrice?: any;
}
export default function RouteCalculator({ modelPrice }: RouteCalculatorProps = {}) {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentSelection, setCurrentSelection] = useState<'pickup' | 'dropoff' | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('hanoi');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [rushHourStatus, setRushHourStatus] = useState<string>('');
  const [trafficIncidents, setTrafficIncidents] = useState<any[]>([]);
  const [showTrafficDetails, setShowTrafficDetails] = useState(false);
  const [trafficIncidentsWithLocation, setTrafficIncidentsWithLocation] = useState<any[]>([]);
  const [totalCongestionKm, setTotalCongestionKm] = useState<number>(0);
  const [pickupLocationInfo, setPickupLocationInfo] = useState<any>(null);
  const [dropoffLocationInfo, setDropoffLocationInfo] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const pickupMarker = useRef<any>(null);
  const dropoffMarker = useRef<any>(null);
  const mapboxAccessToken = 'pk.eyJ1Ijoic3ViaGFtcHJlZXQiLCJhIjoiY2toY2IwejF1MDdodzJxbWRuZHAweDV6aiJ9.Ys8MP5kVTk5P9V2TDvnuDg';
  const tomtomApiKey = 'bQrbmvGHDhZA0DUXLOFxLRnYNNrbqgEq';
  useEffect(() => {
    setRushHourStatus(getRushHourStatus());
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mapboxgl) {
      initializeMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.onload = () => {
        const link = document.createElement('link');
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        initializeMap();
      };
      document.head.appendChild(script);
    }
  }, []);
  const initializeMap = () => {
    if (!mapRef.current || mapInstance.current) return;
    window.mapboxgl.accessToken = mapboxAccessToken;
    mapInstance.current = new window.mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [105.8342, 21.0285],
      zoom: 12
    });
    mapInstance.current.addControl(new window.mapboxgl.NavigationControl());
    mapInstance.current.addControl(new window.mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
    mapInstance.current.on('click', async (e: any) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      const locationInfo = await trafficApi.reverseGeocode(coords[1], coords[0]);
      const name = locationInfo?.data?.fullAddress || 'Vị Trí Đã Chọn';
      if (currentSelection === 'pickup') {
        setPickupLocation({ coords, name });
        setPickupLocationInfo(locationInfo?.data);
        setCurrentSelection(null);
      } else if (currentSelection === 'dropoff') {
        setDropoffLocation({ coords, name });
        setDropoffLocationInfo(locationInfo?.data);
        setCurrentSelection(null);
      } else {
        setPickupLocation({ coords, name });
        setPickupLocationInfo(locationInfo?.data);
        setCurrentSelection(null);
      }
    });
  };
  const searchLocation = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${tomtomApiKey}&countrySet=VN&limit=5`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      }
    } catch (error) {
    }
  };
  const selectLocation = async (result: any) => {
    const coords: [number, number] = [result.position.lon, result.position.lat];
    const name = result.poi?.name || result.address?.freeformAddress || 'Vị Trí Đã Chọn';
    const locationInfo = await trafficApi.reverseGeocode(result.position.lat, result.position.lon);
    if (currentSelection === 'pickup') {
      setPickupLocation({ coords, name });
      setPickupLocationInfo(locationInfo?.data);
    } else if (currentSelection === 'dropoff') {
      setDropoffLocation({ coords, name });
      setDropoffLocationInfo(locationInfo?.data);
    }
    setCurrentSelection(null);
    setSearchQuery("");
    setSearchResults([]);
  };
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình Duyệt Không Hỗ Trợ Định Vị GPS');
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
      const locationInfo = await trafficApi.reverseGeocode(coords[1], coords[0]);
      const name = locationInfo?.data?.fullAddress || 'Vị Trí Hiện Tại Của Bạn';
      if (currentSelection === 'pickup') {
        setPickupLocation({ coords, name });
        setPickupLocationInfo(locationInfo?.data);
      } else if (currentSelection === 'dropoff') {
        setDropoffLocation({ coords, name });
        setDropoffLocationInfo(locationInfo?.data);
      } else {
        setPickupLocation({ coords, name });
        setPickupLocationInfo(locationInfo?.data);
      }
      setCurrentSelection(null);
      setSearchQuery("");
      setSearchResults([]);
      setIsGettingLocation(false);
      if (mapInstance.current) {
        mapInstance.current.flyTo({
          center: coords,
          zoom: 15,
          duration: 1000
        });
      }
    }, (error) => {
      let message = 'Không Thể Lấy Vị Trí Hiện Tại';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Bạn Cần Cấp Quyền Truy Cập Vị Trí Để Sử Dụng Tính Năng Này';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Vị Trí Hiện Tại Không Khả Dụng';
          break;
        case error.TIMEOUT:
          message = 'Hết Thời Gian Chờ Lấy Vị Trí';
          break;
      }
      alert(message);
      setIsGettingLocation(false);
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    });
  };
  const updateMarkers = () => {
    if (!mapInstance.current) return;
    if (pickupMarker.current) {
      pickupMarker.current.remove();
    }
    if (dropoffMarker.current) {
      dropoffMarker.current.remove();
    }
    if (pickupLocation) {
      pickupMarker.current = new window.mapboxgl.Marker({ color: '#10b981' })
        .setLngLat(pickupLocation.coords)
        .setPopup(new window.mapboxgl.Popup().setHTML(`<div class="p-2"><h3 class="font-bold text-green-600">Điểm Đón</h3><p>${pickupLocation.name}</p></div>`))
        .addTo(mapInstance.current);
    }
    if (dropoffLocation) {
      dropoffMarker.current = new window.mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(dropoffLocation.coords)
        .setPopup(new window.mapboxgl.Popup().setHTML(`<div class="p-2"><h3 class="font-bold text-red-600">Điểm Đến</h3><p>${dropoffLocation.name}</p></div>`))
        .addTo(mapInstance.current);
    }
  };
  const getTrafficLevel = async (coords: [number, number]) => {
    try {
      const flowData = await trafficApi.getTrafficFlow(coords[1], coords[0]);
      if (flowData?.data) {
        return trafficApi.calculateTrafficLevel(flowData.data);
      }
    } catch (error) {
    }
    const levels = [
      { level: 'Thông Thoáng', multiplier: 1.0 },
      { level: 'Hơi Chậm', multiplier: 1.1 },
      { level: 'Chậm', multiplier: 1.2 },
      { level: 'Rất Chậm', multiplier: 1.3 },
      { level: 'Tắc Đường', multiplier: 1.5 }
    ];
    return levels[Math.floor(Math.random() * levels.length)];
  };
  const getWeatherData = async (coords: [number, number]) => {
    try {
      const response = await weatherApi.getCurrentWeather(coords[1], coords[0]);
      if (response.data) {
        setWeatherData(response.data);
        return weatherApi.getWeatherImpact(response.data);
      }
    } catch (error) {
    }
    return { factor: 0, impact: 'Bình Thường' };
  };
  const calculateRoute = async () => {
    if (!pickupLocation || !dropoffLocation) return;
    setIsCalculating(true);
    try {
      const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLocation.coords[0]},${pickupLocation.coords[1]};${dropoffLocation.coords[0]},${dropoffLocation.coords[1]}?access_token=${mapboxAccessToken}&geometries=geojson&overview=full`);
      if (response.ok) {
        const data = await response.json();
        const route = data.routes[0];
        const distance = Math.round((route.distance / 1000) * 10) / 10;
        const duration = Math.round((route.duration / 60) * 10) / 10;
        const openingFare = modelPrice?.openingFare || 15000;
        const rateFirst20Km = modelPrice?.rateFirst20Km || 12000;
        const rateOver20Km = modelPrice?.rateOver20Km || 10000;
        const trafficAddPerKm = modelPrice?.trafficAddPerKm || 0;
        const rainAddPerTrip = modelPrice?.rainAddPerTrip || 0;
        const perMinuteRate = 500;
        let distanceFare = 0;
        if (distance <= 20) {
          distanceFare = Math.round(distance * rateFirst20Km);
        } else {
          distanceFare = Math.round(20 * rateFirst20Km + (distance - 20) * rateOver20Km);
        }
        const timeFare = Math.round(duration * perMinuteRate);
        const trafficInfo = await getTrafficLevel(pickupLocation.coords);
        const trafficMultiplier = trafficInfo.multiplier;
        const trafficFee = Math.round(trafficAddPerKm * distance * (trafficMultiplier - 1));
        const weatherImpact = await getWeatherData(pickupLocation.coords);
        const weatherSurcharge = Math.round((openingFare + distanceFare + timeFare) * weatherImpact.factor);
        const rushHourFactor = getRushHourFactor();
        const rushHourFee = Math.round((openingFare + distanceFare + timeFare) * rushHourFactor);
        const subtotal = openingFare + distanceFare + timeFare + trafficFee + rainAddPerTrip + weatherSurcharge + rushHourFee;
        const total = Math.round(subtotal);
        const finalBaseFare = Math.round(openingFare);
        const finalDistanceFare = Math.round(distanceFare);
        const finalTimeFare = Math.round(timeFare);
        const finalTotal = Math.round(total);
        const newRouteInfo = {
          distance,
          duration,
          price: finalTotal,
          baseFare: finalBaseFare,
          distanceFare: finalDistanceFare,
          timeFare: finalTimeFare,
          trafficLevel: trafficInfo.level,
          trafficMultiplier,
          rushHourFee: Math.round(rushHourFee),
          weatherImpact: weatherImpact.impact,
          weatherFactor: weatherImpact.factor
        };
        setRouteInfo(newRouteInfo);
        displayRoute(route.geometry);
        if (trafficIncidents.length > 0) {
          const highSeverityCount = trafficIncidents.filter((i: any) => i.severity >= 3).length;
          const mediumSeverityCount = trafficIncidents.filter((i: any) => i.severity === 2).length;
          const estimatedKm = (highSeverityCount * 0.8) + (mediumSeverityCount * 0.3);
          setTotalCongestionKm(Math.min(estimatedKm, distance));
        }
      }
    } catch (error) {
    } finally {
      setIsCalculating(false);
    }
  };
  const displayRoute = (geometry: any) => {
    if (!mapInstance.current) return;
    if (mapInstance.current.getSource('route')) {
      mapInstance.current.removeLayer('route');
      mapInstance.current.removeSource('route');
    }
    mapInstance.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: geometry
      }
    });
    mapInstance.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 4
      }
    });
    const coordinates = geometry.coordinates;
    const bounds = coordinates.reduce((bounds: any, coord: any) => {
      return bounds.extend(coord);
    }, new window.mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
    mapInstance.current.fitBounds(bounds, { padding: 50 });
    addTrafficLayer();
  };
  const addTrafficLayer = async () => {
    if (!mapInstance.current || !tomtomApiKey) return;
    try {
      let bounds = { south: 21.0285, north: 21.1, west: 105.8342, east: 105.9 };
      if (pickupLocation && dropoffLocation) {
        const lat1 = pickupLocation.coords[1];
        const lng1 = pickupLocation.coords[0];
        const lat2 = dropoffLocation.coords[1];
        const lng2 = dropoffLocation.coords[0];
        bounds = {
          south: Math.min(lat1, lat2) - 0.05,
          north: Math.max(lat1, lat2) + 0.05,
          west: Math.min(lng1, lng2) - 0.05,
          east: Math.max(lng1, lng2) + 0.05
        };
      }
      const response = await trafficApi.getTrafficIncidents(bounds);
      const incidents = response.data || [];
      setTrafficIncidents(incidents);
      if (incidents.length > 0) {
        displayTrafficIncidents(incidents);
        const incidentsWithLocation = await Promise.all(
          incidents.map(async (incident: any) => {
            const locationInfo = await trafficApi.reverseGeocode(
              incident.point.lat,
              incident.point.lon
            );
            return {
              ...incident,
              locationInfo: locationInfo?.data
            };
          })
        );
        setTrafficIncidentsWithLocation(incidentsWithLocation);
        const highSeverityCount = incidents.filter((i: any) => i.severity >= 3).length;
        const mediumSeverityCount = incidents.filter((i: any) => i.severity === 2).length;
        const estimatedKm = (highSeverityCount * 0.8) + (mediumSeverityCount * 0.3);
        const currentRouteInfo = routeInfo;
        if (currentRouteInfo && currentRouteInfo.distance > 0) {
          setTotalCongestionKm(Math.min(estimatedKm, currentRouteInfo.distance));
        } else {
          setTotalCongestionKm(estimatedKm);
        }
      } else {
        setTrafficIncidentsWithLocation([]);
        setTotalCongestionKm(0);
      }
    } catch (error) {
    }
  };
  const displayTrafficIncidents = (incidents: any[]) => {
    if (!mapInstance.current) return;
    if (mapInstance.current.getSource('trafficIncidents')) {
      mapInstance.current.removeLayer('trafficIncidents');
      mapInstance.current.removeSource('trafficIncidents');
    }
    const trafficFeatures = incidents.map(incident => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [incident.point.lon, incident.point.lat]
      },
      properties: {
        id: incident.id,
        type: incident.type,
        severity: incident.severity,
        description: incident.description,
        startTime: incident.startTime,
        endTime: incident.endTime
      }
    }));
    mapInstance.current.addSource('trafficIncidents', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: trafficFeatures
      }
    });
    mapInstance.current.addLayer({
      id: 'trafficIncidents',
      type: 'circle',
      source: 'trafficIncidents',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'severity'],
          1, 6,
          2, 8,
          3, 12,
          4, 16
        ],
        'circle-color': [
          'case',
          ['==', ['get', 'severity'], 1], '#10b981',
          ['==', ['get', 'severity'], 2], '#f59e0b',
          ['==', ['get', 'severity'], 3], '#f97316',
          ['==', ['get', 'severity'], 4], '#ef4444',
          '#6b7280'
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.8
      }
    });
    mapInstance.current.on('click', 'trafficIncidents', async (e: any) => {
      const feature = e.features[0];
      const coordinates = feature.geometry.coordinates.slice();
      const severity = feature.properties.severity;
      const description = feature.properties.description;
      const type = feature.properties.type;
      const locationInfo = await trafficApi.reverseGeocode(
        coordinates[1],
        coordinates[0]
      );
      let locationHtml = '';
      if (locationInfo?.data) {
        locationHtml = `
<div class="mt-2 pt-2 border-t border-gray-300">
<p class="text-xs text-gray-600 mb-1"><strong>Vị Trí:</strong></p>
${locationInfo.data.district ? `<p class="text-xs text-gray-600">Phường/Xã: ${locationInfo.data.district}</p>` : ''}
${locationInfo.data.province ? `<p class="text-xs text-gray-600">Tỉnh/Tp: ${locationInfo.data.province}</p>` : ''}
</div>
`;
      }
      new window.mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
<div class="p-3 max-w-xs">
<h3 class="font-bold text-red-600 mb-2">Sự Cố Giao Thông</h3>
<p class="text-sm mb-2"><strong>Loại:</strong> ${type}</p>
<p class="text-sm mb-2"><strong>Mức Độ:</strong> ${trafficApi.getSeverityText(severity)}</p>
<p class="text-sm mb-2"><strong>Mô Tả:</strong> ${description}</p>
${locationHtml}
</div>
`)
        .addTo(mapInstance.current);
    });
    mapInstance.current.on('mouseenter', 'trafficIncidents', () => {
      mapInstance.current.getCanvas().style.cursor = 'pointer';
    });
    mapInstance.current.on('mouseleave', 'trafficIncidents', () => {
      mapInstance.current.getCanvas().style.cursor = '';
    });
  };
  const toggleTrafficLayer = () => {
    if (!mapInstance.current) return;
    if (showTraffic) {
      if (mapInstance.current.getSource('trafficIncidents')) {
        mapInstance.current.removeLayer('trafficIncidents');
        mapInstance.current.removeSource('trafficIncidents');
      }
      setShowTraffic(false);
    } else {
      addTrafficLayer();
      setShowTraffic(true);
    }
  };
  useEffect(() => {
    updateMarkers();
  }, [pickupLocation, dropoffLocation]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocation(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-background/50 dark:to-background/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tìm Lộ Trình & Tính Giá Taxi
          </h2>
          <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
            Chọn Điểm Đón Và Điểm Đến Để Xem Lộ Trình Tối Ưu Và Giá Tiền Dự Kiến
          </p>
          {modelPrice && (
            <div className="mt-6 max-w-4xl mx-auto">
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Car className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                      Thông Tin Bảng Giá
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                    <div className="text-center">
                      <span className="text-gray-600 dark:text-gray-400">Mẫu Xe:</span>
                      <div className="mt-1">
                        <Badge className="bg-green-600 text-white">
                          {(modelPrice.model?.brand ? `${modelPrice.model.brand} - ` : '') + (modelPrice.model?.modelName || 'N/A')}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-gray-600 dark:text-gray-400">Công Ty:</span>
                      <div className="mt-1">
                        <Badge className="bg-blue-600 text-white">
                          {modelPrice.model?.company?.name || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {modelPrice.model?.imageUrl && (
                    <div className="mt-2 mb-1 flex justify-center">
                      <img
                        src={String(modelPrice.model.imageUrl).startsWith('http')
                          ? modelPrice.model.imageUrl
                          : apiService.getFileUrl(`uploads/models/${modelPrice.model.imageUrl}`)}
                        alt={`${modelPrice.model?.brand || ''} ${modelPrice.model?.modelName || ''}`.trim()}
                        className="h-24 md:h-28 w-auto object-contain rounded"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Cước Mở Cửa:</span>
                      <div className="font-semibold text-green-700 dark:text-green-300">
                        {modelPrice.openingFare?.toLocaleString('vi-VN')} Vnđ
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Giá 20km Đầu:</span>
                      <div className="font-semibold text-green-700 dark:text-green-300">
                        {modelPrice.rateFirst20Km?.toLocaleString('vi-VN')} Vnđ/km
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Giá Trên 20km:</span>
                      <div className="font-semibold text-green-700 dark:text-green-300">
                        {modelPrice.rateOver20Km?.toLocaleString('vi-VN')} Vnđ/km
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Phí Kẹt Xe:</span>
                      <div className="font-semibold text-green-700 dark:text-green-300">
                        {modelPrice.trafficAddPerKm?.toLocaleString('vi-VN')} Vnđ/km
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div className="mt-4 mb-6 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Chọn Thành Phố:</span>
            {Object.keys(locationDatabase).filter(key => key !== 'all').map((cityKey) => (
              <Button
                key={cityKey}
                variant={selectedCity === cityKey ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCity(cityKey);
                  const city = locationDatabase[cityKey];
                  if (mapInstance.current && city) {
                    mapInstance.current.flyTo({
                      center: city.center,
                      zoom: city.zoom,
                      duration: 1000
                    });
                  }
                }}
              >
                {locationDatabase[cityKey].name}
              </Button>
            ))}
          </div>
          {locationDatabase[selectedCity]?.places && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Địa Điểm Phổ Biến Tại {locationDatabase[selectedCity].name}:
              </p>
              <div className="flex flex-wrap gap-2">
                {locationDatabase[selectedCity].places?.slice(0, 8).map((place, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      if (!currentSelection) {
                        setCurrentSelection('pickup');
                      }
                      const coords: [number, number] = place.coords;
                      const locationInfo = await trafficApi.reverseGeocode(coords[1], coords[0]);
                      if (currentSelection === 'pickup') {
                        setPickupLocation({ coords, name: place.name });
                        setPickupLocationInfo(locationInfo?.data);
                        setCurrentSelection(null);
                      } else if (currentSelection === 'dropoff') {
                        setDropoffLocation({ coords, name: place.name });
                        setDropoffLocationInfo(locationInfo?.data);
                        setCurrentSelection(null);
                      } else {
                        setPickupLocation({ coords, name: place.name });
                        setPickupLocationInfo(locationInfo?.data);
                      }
                      if (mapInstance.current) {
                        mapInstance.current.flyTo({
                          center: coords,
                          zoom: 15,
                          duration: 1000
                        });
                      }
                    }}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    {place.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Chọn Địa Điểm
              </CardTitle>
              <CardDescription>
                Nhập Địa Chỉ Hoặc Click Trên Bản Đồ Để Chọn Điểm Đón Và Điểm Đến
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Điểm Đón
                </label>
                <div className="relative">
                  <Input
                    placeholder="Nhập Địa Chỉ Điểm Đón..."
                    value={currentSelection === 'pickup' ? searchQuery : (pickupLocation?.name || '')}
                    onChange={(e) => {
                      if (currentSelection === 'pickup') {
                        setSearchQuery(e.target.value);
                      }
                    }}
                    onFocus={() => setCurrentSelection('pickup')}
                    className="pl-10 pr-20"
                  />
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1 h-8 w-8 p-0 hover:bg-primary/10"
                    onClick={() => {
                      setCurrentSelection('pickup');
                      getCurrentLocation();
                    }}
                    disabled={isGettingLocation}
                    title="Lấy Vị Trí Hiện Tại"
                  >
                    {isGettingLocation ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    ) : (
                      <Crosshair className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                </div>
                {pickupLocation && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-green-700 dark:text-green-300">
                          {pickupLocation.name}
                        </div>
                        {pickupLocationInfo && (
                          <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                            {pickupLocationInfo.district && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span><strong>Phường/Xã:</strong> {pickupLocationInfo.district}</span>
                              </div>
                            )}
                            {pickupLocationInfo.province && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span><strong>Tỉnh/Tp:</strong> {pickupLocationInfo.province}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setPickupLocation(null);
                          setPickupLocationInfo(null);
                        }}
                        className="text-red-500 hover:text-red-700 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Điểm Đến
                </label>
                <div className="relative">
                  <Input
                    placeholder="Nhập Địa Chỉ Điểm Đến..."
                    value={currentSelection === 'dropoff' ? searchQuery : (dropoffLocation?.name || '')}
                    onChange={(e) => {
                      if (currentSelection === 'dropoff') {
                        setSearchQuery(e.target.value);
                      }
                    }}
                    onFocus={() => setCurrentSelection('dropoff')}
                    className="pl-10 pr-20"
                  />
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1 h-8 w-8 p-0 hover:bg-primary/10"
                    onClick={() => {
                      setCurrentSelection('dropoff');
                      getCurrentLocation();
                    }}
                    disabled={isGettingLocation}
                    title="Lấy Vị Trí Hiện Tại"
                  >
                    {isGettingLocation ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    ) : (
                      <Crosshair className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                </div>
                {dropoffLocation && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-red-700 dark:text-red-300">
                          {dropoffLocation.name}
                        </div>
                        {dropoffLocationInfo && (
                          <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                            {dropoffLocationInfo.district && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span><strong>Phường/Xã:</strong> {dropoffLocationInfo.district}</span>
                              </div>
                            )}
                            {dropoffLocationInfo.province && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span><strong>Tỉnh/Tp:</strong> {dropoffLocationInfo.province}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setDropoffLocation(null);
                          setDropoffLocationInfo(null);
                        }}
                        className="text-red-500 hover:text-red-700 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto border rounded-lg bg-white dark:bg-gray-800">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0"
                      onClick={() => selectLocation(result)}
                    >
                      <div className="font-medium text-sm">
                        {result.poi?.name || result.address?.freeformAddress}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.address?.freeformAddress}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button
                onClick={calculateRoute}
                disabled={!pickupLocation || !dropoffLocation || isCalculating}
                className="w-full"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang Tính Toán...
                  </>
                ) : (
                  <>
                    <Route className="h-4 w-4 mr-2" />
                    Tính Lộ Trình & Giá
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-primary" />
                Bản Đồ
              </CardTitle>
              <CardDescription>
                Click Trên Bản Đồ Để Chọn Vị Trí Hoặc Sử Dụng Tìm Kiếm Ở Trên
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div
                  ref={mapRef}
                  className="w-full h-96 rounded-lg border border-gray-200 dark:border-gray-700"
                  style={{ minHeight: '384px' }}
                />
                <Button
                  type="button"
                  size="sm"
                  className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-600"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  title="Lấy Vị Trí Hiện Tại"
                >
                  {isGettingLocation ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  ) : (
                    <Crosshair className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className={`absolute top-4 right-16 shadow-lg border ${showTraffic ? 'bg-red-500 text-white border-red-600 hover:bg-red-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'}`}
                  onClick={toggleTrafficLayer}
                  title={showTraffic ? 'Ẩn Tình Trạng Giao Thông' : 'Hiện Tình Trạng Giao Thông'}
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {routeInfo && (
          <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Thông Tin Chuyến Đi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <Route className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {routeInfo.distance.toFixed(1)} Km
                  </div>
                  <div className="text-sm text-gray-500">Khoảng Cách</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {routeInfo.duration.toFixed(1)} Phút
                  </div>
                  <div className="text-sm text-gray-500">Thời Gian Dự Kiến</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <Navigation className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    {routeInfo.trafficLevel}
                  </div>
                  <div className="text-sm text-gray-500">Tình Trạng Giao Thông</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {routeInfo.price.toLocaleString()} Vnđ
                  </div>
                  <div className="text-sm text-gray-500">Giá Ước Tính</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Chi Tiết Giá Tiền
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phí Cơ Bản:</span>
                    <span className="text-sm font-medium">{routeInfo.baseFare.toLocaleString()} Vnđ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phí Theo Km ({routeInfo.distance.toFixed(1)} Km):</span>
                    <span className="text-sm font-medium">{routeInfo.distanceFare.toLocaleString()} Vnđ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phí Theo Thời Gian ({routeInfo.duration.toFixed(1)} Phút):</span>
                    <span className="text-sm font-medium">{routeInfo.timeFare.toLocaleString()} Vnđ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tình Trạng Giao Thông ({routeInfo.trafficLevel}):</span>
                    <span className="text-sm font-medium">X{routeInfo.trafficMultiplier}</span>
                  </div>
                  {routeInfo.rushHourFee !== undefined && routeInfo.rushHourFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Phụ Phí Giờ Cao Điểm:</span>
                      <span className="text-sm font-medium text-orange-600">{routeInfo.rushHourFee.toLocaleString()} Vnđ</span>
                    </div>
                  )}
                  {routeInfo.weatherImpact && routeInfo.weatherFactor !== undefined && routeInfo.weatherFactor > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Phụ Phí Thời Tiết ({routeInfo.weatherImpact}):</span>
                      <span className="text-sm font-medium text-blue-600">+{(routeInfo.weatherFactor * 100).toFixed(0)}%</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Tổng Cộng:</span>
                    <span className="font-bold text-lg text-primary">{routeInfo.price.toLocaleString()} Vnđ</span>
                  </div>
                </div>
              </div>
              <Card className="mt-6 p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Thông Tin Tắc Đường & Sự Cố Giao Thông
                  </CardTitle>
                  <CardDescription>
                    {trafficIncidents.length > 0 ? `Phát Hiện ${trafficIncidents.length} Sự Cố Giao Thông Trên Tuyến Đường` : 'Không Có Sự Cố Giao Thông Trên Tuyến Đường'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {trafficIncidents.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                          <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-red-600">
                            {totalCongestionKm > 0 ? totalCongestionKm.toFixed(1) : '0.0'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Km Bị Tắc</div>
                          {routeInfo && (
                            <div className="text-xs text-gray-500 mt-1">
                              ~{((totalCongestionKm / routeInfo.distance) * 100).toFixed(0)}% Tuyến Đường
                            </div>
                          )}
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-600">
                            {trafficIncidents.length}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sự Cố Giao Thông</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-purple-600">
                            {routeInfo ? Math.round((totalCongestionKm / routeInfo.distance) * routeInfo.duration) : 0}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Phút Bị Chậm</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-red-600 mx-auto mb-1" />
                          <div className="text-xl font-bold text-red-600">
                            {trafficIncidents.filter((i: any) => i.severity === 4).length}
                          </div>
                          <div className="text-xs text-gray-500">Rất Cao</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                          <div className="text-xl font-bold text-orange-600">
                            {trafficIncidents.filter((i: any) => i.severity === 3).length}
                          </div>
                          <div className="text-xs text-gray-500">Cao</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                          <div className="text-xl font-bold text-yellow-600">
                            {trafficIncidents.filter((i: any) => i.severity === 2).length}
                          </div>
                          <div className="text-xs text-gray-500">Trung Bình</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                          <div className="text-xl font-bold text-green-600">
                            {trafficIncidents.filter((i: any) => i.severity === 1).length}
                          </div>
                          <div className="text-xs text-gray-500">Thấp</div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" onClick={() => setShowTrafficDetails(!showTrafficDetails)}>
                        <Eye className="h-4 w-4 mr-2" />
                        {showTrafficDetails ? 'Ẩn' : 'Xem'} Chi Tiết Các Sự Cố
                      </Button>
                      {showTrafficDetails && (
                        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                          {(trafficIncidentsWithLocation.length > 0 ? trafficIncidentsWithLocation : trafficIncidents).slice(0, 10).map((incident: any, index: number) => (
                            <div key={incident.id || index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4" style={{ borderLeftColor: incident.severity === 4 ? '#ef4444' : incident.severity === 3 ? '#f97316' : incident.severity === 2 ? '#f59e0b' : '#10b981' }}>
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                                    {incident.type || 'Sự Cố Giao Thông'}
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {incident.description || 'Không Có Mô Tả'}
                                  </div>
                                  {incident.locationInfo && (
                                    <div className="mt-2 p-2 bg-white dark:bg-gray-700 rounded text-xs">
                                      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                        <MapPin className="h-3 w-3" />
                                        <span className="font-medium">Vị Trí:</span>
                                      </div>
                                      <div className="mt-1 text-gray-700 dark:text-gray-300">
                                        {incident.locationInfo.district && (
                                          <span className="mr-2">
                                            <strong>Phường/Xã:</strong> {incident.locationInfo.district}
                                          </span>
                                        )}
                                        {incident.locationInfo.province && (
                                          <span>
                                            <strong>Tỉnh/Tp:</strong> {incident.locationInfo.province}
                                          </span>
                                        )}
                                      </div>
                                      {incident.locationInfo.fullAddress && (
                                        <div className="mt-1 text-gray-500 dark:text-gray-400 italic">
                                          {incident.locationInfo.fullAddress}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className={incident.severity === 4 ? 'border-red-500 text-red-600' : incident.severity === 3 ? 'border-orange-500 text-orange-600' : incident.severity === 2 ? 'border-yellow-500 text-yellow-600' : 'border-green-500 text-green-600'}>
                                      {trafficApi.getSeverityText(incident.severity)}
                                    </Badge>
                                    {incident.startTime && (
                                      <span className="text-xs text-gray-500">
                                        {new Date(incident.startTime).toLocaleTimeString('vi-VN')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {trafficIncidents.length > 10 && (
                            <div className="text-center text-sm text-gray-500 pt-2">
                              ... Và {trafficIncidents.length - 10} Sự Cố Khác
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500 opacity-50" />
                      <div>Không Có Sự Cố Giao Thông Trên Tuyến Đường Này</div>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="mt-6 p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-blue-600" />
                    Thông Tin Thời Tiết Chi Tiết
                  </CardTitle>
                  <CardDescription>
                    Thời Tiết Tại Điểm Đón Và Tác Động Đến Giá Cước
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {weatherData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <Thermometer className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-600">
                            {weatherData.current?.tempC}°C
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Nhiệt Độ</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <Droplets className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-600">
                            {weatherData.current?.humidity}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Độ Ẩm</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <Wind className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-600">
                            {weatherData.current?.windKph} Km/H
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Tốc Độ Gió</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <Eye className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-600">
                            {weatherData.current?.visKm || 10} Km
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Tầm Nhìn</div>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                              {weatherData.current?.condition?.text}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {weatherData.location?.name}, {weatherData.location?.region}
                            </div>
                          </div>
                          {weatherData.current?.condition?.icon && (
                            <img src={`https:${weatherData.current.condition.icon}`} alt={weatherData.current.condition.text} className="h-16 w-16" />
                          )}
                        </div>
                        {routeInfo.weatherImpact && (
                          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Tác Động Đến Giá:
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-blue-600">
                                  {routeInfo.weatherImpact}
                                </span>
                                {routeInfo.weatherFactor && routeInfo.weatherFactor > 0 && (
                                  <Badge className="bg-blue-500 text-white">
                                    +{(routeInfo.weatherFactor * 100).toFixed(0)}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <div>Đang Tải Thông Tin Thời Tiết...</div>
                    </div>
                  )}
                </CardContent>
              </Card>
              <div className="mt-6">
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-6 text-lg"
                  size="lg"
                  onClick={async () => {
                    try {
                      const currentUser = getCurrentUser();
                      if (!currentUser) {
                        alert('Bạn Cần Đăng Nhập Để Đặt Xe!');
                        return;
                      }
                      if (!pickupLocation || !dropoffLocation || !routeInfo || !modelPrice) {
                        alert('Vui Lòng Tính Giá Trước Khi Đặt Xe!');
                        return;
                      }
                      const priceRefId = modelPrice.modelPriceId;
                      if (!priceRefId) {
                        alert('Không Tìm Thấy Thông Tin Bảng Giá!');
                        return;
                      }
                      const companyId = modelPrice.model?.companyId;
                      if (!companyId) {
                        alert('Không Tìm Thấy Thông Tin Công Ty!');
                        return;
                      }
                      const customerAccountId = parseInt(currentUser.id);
                      if (!customerAccountId || isNaN(customerAccountId)) {
                        alert('Không Tìm Thấy Id Tài Khoản Khách Hàng!');
                        return;
                      }
                      const orderData = {
                        companyId: companyId,
                        customerAccountId: customerAccountId,
                        pickupAddress: pickupLocation.name,
                        dropoffAddress: dropoffLocation.name,
                        fromProvinceId: modelPrice.provinceId,
                        toProvinceId: modelPrice.provinceId,
                        modelId: modelPrice.modelId,
                        priceRefId: priceRefId,
                        totalKm: routeInfo.distance,
                        innerCityKm: routeInfo.distance,
                        intercityKm: 0,
                        baseFare: routeInfo.baseFare,
                        intercityUnitPrice: modelPrice.intercityRatePerKm || 0,
                        intercityFee: 0,
                        totalAmount: routeInfo.price
                      };
                      await apiService.post('/drivingorders', orderData);
                      alert('Đặt Xe Thành Công! Đơn Hàng Đã Được Tạo.');
                      window.location.reload();
                    } catch (error: any) {
                      alert(`Lỗi: ${error.message || 'Không Thể Đặt Xe'}`);
                    }
                  }}
                >
                  <Car className="h-5 w-5 mr-2" />
                  Đặt Xe Ngay
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}