export interface LocationPlace {
  name: string;
  coords: [number, number];
  type: 'airport' | 'station' | 'landmark' | 'market' | 'shopping' | 'hospital' | 'university' | 'hotel' | 'business';
}
export interface CityLocation {
  name: string;
  center: [number, number];
  zoom: number;
  places?: LocationPlace[];
}
export interface LocationDatabase {
  [key: string]: CityLocation;
}
export const locationDatabase: LocationDatabase = {
  all: {
    name: 'Tất Cả Thành Phố',
    center: [105.8342, 21.0285],
    zoom: 6
  },
  hanoi: {
    name: 'Hà Nội',
    center: [105.8342, 21.0285],
    zoom: 12,
    places: [
      { name: 'Sân Bay Nội Bài', coords: [105.8067, 21.2211], type: 'airport' },
      { name: 'Ga Hà Nội', coords: [105.8442, 21.0245], type: 'station' },
      { name: 'Hồ Gươm', coords: [105.8327, 21.0285], type: 'landmark' },
      { name: 'Chợ Đồng Xuân', coords: [105.8389, 21.0356], type: 'market' },
      { name: 'Vincom Center', coords: [105.8206, 21.0147], type: 'shopping' },
      { name: 'Bệnh Viện Bạch Mai', coords: [105.8422, 21.0011], type: 'hospital' },
      { name: 'Đại Học Bách Khoa', coords: [105.8411, 21.0044], type: 'university' },
      { name: 'Times City', coords: [105.8567, 21.0189], type: 'shopping' },
      { name: 'Royal City', coords: [105.8089, 21.0044], type: 'shopping' },
      { name: 'Lotte Center', coords: [105.8089, 21.0044], type: 'shopping' }
    ]
  },
  hcm: {
    name: 'TP. Hồ Chí Minh',
    center: [106.6297, 10.8231],
    zoom: 12,
    places: [
      { name: 'Sân Bay Tân Sơn Nhất', coords: [106.6520, 10.8188], type: 'airport' },
      { name: 'Ga Sài Gòn', coords: [106.7067, 10.7767], type: 'station' },
      { name: 'Chợ Bến Thành', coords: [106.6967, 10.7722], type: 'market' },
      { name: 'Vincom Center', coords: [106.7067, 10.7767], type: 'shopping' },
      { name: 'Bệnh Viện Chợ Rẫy', coords: [106.6967, 10.7722], type: 'hospital' },
      { name: 'Đại Học Bách Khoa', coords: [106.6967, 10.7767], type: 'university' },
      { name: 'Landmark 81', coords: [106.7200, 10.7944], type: 'landmark' },
      { name: 'Saigon Centre', coords: [106.7067, 10.7767], type: 'shopping' },
      { name: 'Diamond Plaza', coords: [106.7067, 10.7767], type: 'shopping' },
      { name: 'Crescent Mall', coords: [106.7200, 10.7944], type: 'shopping' }
    ]
  },
  danang: {
    name: 'Đà Nẵng',
    center: [108.2208, 16.0544],
    zoom: 12,
    places: [
      { name: 'Sân Bay Đà Nẵng', coords: [108.1989, 16.0439], type: 'airport' },
      { name: 'Ga Đà Nẵng', coords: [108.2208, 16.0544], type: 'station' },
      { name: 'Cầu Rồng', coords: [108.2208, 16.0544], type: 'landmark' },
      { name: 'Chợ Hàn', coords: [108.2208, 16.0544], type: 'market' },
      { name: 'Vincom Plaza', coords: [108.2208, 16.0544], type: 'shopping' },
      { name: 'Bệnh Viện Đà Nẵng', coords: [108.2208, 16.0544], type: 'hospital' },
      { name: 'Đại Học Đà Nẵng', coords: [108.2208, 16.0544], type: 'university' }
    ]
  }
};
export function getPlaceIcon(type: LocationPlace['type']): string {
  const icons: Record<LocationPlace['type'], string> = {
    airport: 'plane',
    station: 'train',
    landmark: 'monument',
    market: 'shopping-cart',
    shopping: 'store',
    hospital: 'hospital',
    university: 'graduation-cap',
    hotel: 'hotel',
    business: 'briefcase'
  };
  return icons[type] || 'map-marker-alt';
}
export function getTrafficLevel(currentSpeed: number, freeFlowSpeed: number): { level: string; multiplier: number } {
  if (!currentSpeed || !freeFlowSpeed) {
    return { level: 'Không Xác Định', multiplier: 1.0 };
  }
  const ratio = currentSpeed / freeFlowSpeed;
  if (ratio >= 0.8) return { level: 'Thông Thoáng', multiplier: 1.0 };
  if (ratio >= 0.6) return { level: 'Hơi Chậm', multiplier: 1.1 };
  if (ratio >= 0.4) return { level: 'Chậm', multiplier: 1.2 };
  if (ratio >= 0.2) return { level: 'Rất Chậm', multiplier: 1.3 };
  return { level: 'Tắc Đường', multiplier: 1.5 };
}
export function getRushHourFactor(): number {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  if (day >= 1 && day <= 5) {
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return 0.08;
    }
  }
  if (hour >= 11.5 && hour <= 13.5) {
    return 0.05;
  }
  return 0;
}
export function getRushHourStatus(): string {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  let status = 'Bình Thường';
  if (day >= 1 && day <= 5) {
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      status = 'Giờ Cao Điểm';
    } else if (hour >= 11.5 && hour <= 13.5) {
      status = 'Giờ Trưa';
    }
  }
  return status;
}