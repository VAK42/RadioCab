const tomtomApiKey = 'bQrbmvGHDhZA0DUXLOFxLRnYNNrbqgEq';
export interface TrafficIncident {
  id: string;
  point: {
    lat: number;
    lon: number;
  };
  type: string;
  severity: number;
  description: string;
  startTime: string;
  endTime?: string;
}
export interface TrafficFlowData {
  currentSpeed: number;
  freeFlowSpeed: number;
  confidence: number;
  roadClosure: boolean;
}
export interface TrafficLevel {
  level: string;
  multiplier: number;
}
export interface TrafficResponse<T> {
  status: 'Success' | 'Error';
  message: string;
  data: T | null;
}
export const trafficApi = {
  getTrafficFlow: async (lat: number, lng: number): Promise<TrafficResponse<TrafficFlowData>> => {
    try {
      const response = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${tomtomApiKey}&point=${lat},${lng}`);
      if (response.ok) {
        const data = await response.json();
        if (data.flowSegmentData) {
          return {
            status: 'Success',
            message: 'Lấy Dữ Liệu Lưu Lượng Thành Công',
            data: {
              currentSpeed: data.flowSegmentData.currentSpeed || 0,
              freeFlowSpeed: data.flowSegmentData.freeFlowSpeed || 0,
              confidence: data.flowSegmentData.confidence || 0,
              roadClosure: data.flowSegmentData.roadClosure || false
            }
          };
        }
      }
      return { status: 'Error', message: 'Không Tìm Thấy Dữ Liệu Lưu Lượng', data: null };
    } catch (error: any) {
      return { status: 'Error', message: `Lỗi Hệ Thống: ${error.message}`, data: null };
    }
  },
  getTrafficIncidents: async (bounds: { north: number; south: number; east: number; west: number }): Promise<TrafficResponse<TrafficIncident[]>> => {
    try {
      const response = await fetch(`https://api.tomtom.com/traffic/services/4/incidentDetails/s3/${bounds.south},${bounds.west},${bounds.north},${bounds.east}/json?key=${tomtomApiKey}&projection=EPSG4326&expandCluster=true`);
      if (response.ok) {
        const data = await response.json();
        return { status: 'Success', message: 'Lấy Dữ Liệu Sự Cố Thành Công', data: data.incidents || [] };
      }
      return { status: 'Error', message: 'Không Thể Lấy Dữ Liệu Sự Cố', data: null };
    } catch (error: any) {
      return { status: 'Error', message: `Lỗi Hệ Thống: ${error.message}`, data: null };
    }
  },
  calculateTrafficLevel: (flowData: TrafficFlowData | null): TrafficLevel => {
    if (!flowData || !flowData.freeFlowSpeed || flowData.freeFlowSpeed === 0) {
      return { level: 'Không Xác Định', multiplier: 1.0 };
    }
    const ratio = flowData.currentSpeed / flowData.freeFlowSpeed;
    if (ratio >= 0.8) return { level: 'Thông Thoáng', multiplier: 1.0 };
    if (ratio >= 0.6) return { level: 'Hơi Chậm', multiplier: 1.1 };
    if (ratio >= 0.4) return { level: 'Chậm', multiplier: 1.2 };
    if (ratio >= 0.2) return { level: 'Rất Chậm', multiplier: 1.3 };
    return { level: 'Tắc Đường', multiplier: 1.5 };
  },
  getSeverityText: (severity: number): string => {
    switch (severity) {
      case 1: return 'Thấp';
      case 2: return 'Trung Bình';
      case 3: return 'Cao';
      case 4: return 'Rất Cao';
      default: return 'Không Xác Định';
    }
  },
  testApiKey: async (apiKey?: string): Promise<{ valid: boolean; message: string }> => {
    const key = apiKey || tomtomApiKey;
    try {
      const response = await fetch(`https://api.tomtom.com/search/2/search/hanoi.json?key=${key}&limit=1`);
      if (response.ok) {
        return { valid: true, message: 'API Key Hợp Lệ' };
      } else {
        return { valid: false, message: `API Trả Về Lỗi: ${response.status}` };
      }
    } catch (error: any) {
      return { valid: false, message: `Lỗi Kết Nối: ${error.message}` };
    }
  },
  reverseGeocode: async (lat: number, lon: number): Promise<TrafficResponse<{ address?: string; district?: string; city?: string; province?: string; fullAddress?: string }>> => {
    try {
      const googleApiKey = '';
      if (googleApiKey) {
        try {
          const googleResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleApiKey}&language=vi&region=VN`);
          if (googleResponse.ok) {
            const googleData = await googleResponse.json();
            if (googleData.results && googleData.results.length > 0) {
              const result = googleData.results[0];
              const addressComponents = result.address_components || [];
              let district = '';
              let province = '';
              for (const component of addressComponents) {
                const types = component.types || [];
                if (types.includes('administrative_area_level_1')) {
                  province = component.long_name || component.short_name || '';
                }
                if (types.includes('sublocality') || types.includes('sublocality_level_1') || (types.includes('political') && types.includes('sublocality'))) {
                  district = component.long_name || component.short_name || '';
                }
                if (!district && types.includes('political')) {
                  if (!types.includes('administrative_area_level_1') && !types.includes('administrative_area_level_2')) {
                    const name = component.long_name || component.short_name || '';
                    if (name.includes('Phường') || name.includes('Xã') || name.includes('Ward') || name.includes('Commune')) {
                      district = name.replace(/^(Phường|Xã|Ward|Commune)\s*/i, '').trim();
                    }
                  }
                }
              }
              if (!district && result.formatted_address) {
                const parts = result.formatted_address.split(',').map((p: string) => p.trim());
                for (const part of parts) {
                  if (part.includes('Phường') || part.includes('Xã')) {
                    district = part.replace(/^(Phường|Xã)\s*/i, '').trim();
                    break;
                  }
                }
                if (!district) {
                  for (let i = parts.length - 1; i >= 0; i--) {
                    const part = parts[i];
                    if (part === province || part.match(/^\d+$/) || part.includes('Hà Nội') || part.includes('Ho Chi Minh') || part.includes('Đà Nẵng') || part.includes('Hải Phòng') || part.includes('Cần Thơ')) {
                      continue;
                    }
                    if (part.length > 0 && part.length < 50) {
                      district = part;
                      break;
                    }
                  }
                }
              }
              if (district || province) {
                return {
                  status: 'Success',
                  message: 'Lấy Địa Chỉ Google Maps Thành Công',
                  data: {
                    address: result.formatted_address || '',
                    district: district || undefined,
                    province: province || undefined,
                    fullAddress: result.formatted_address || ''
                  }
                };
              }
            }
          }
        } catch (error) {
        }
      }
      const response = await fetch(`https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json?key=${tomtomApiKey}&countrySet=VN&language=vi-VN`);
      if (response.ok) {
        const data = await response.json();
        if (data.addresses && data.addresses.length > 0) {
          const address = data.addresses[0].address;
          let district = '';
          let province = '';
          province = address.countrySubdivisionName || address.countrySubdivision || '';
          if (address.municipalitySubdivision) {
            district = address.municipalitySubdivision;
          }
          if (!district && address.freeformAddress) {
            const parts = address.freeformAddress.split(',').map((p: string) => p.trim());
            for (const part of parts) {
              if (part.includes('Phường') || part.includes('Xã') || part.includes('P.') || part.includes('X.')) {
                district = part.replace(/^(Phường|Xã|P\.|X\.)\s*/i, '').trim();
                break;
              }
            }
            if (!district && parts.length >= 3) {
              for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (part.includes('Ngõ') || part.includes('Đường') || part.includes('Phố')) {
                  const nextPart = parts[i + 1];
                  if (nextPart && nextPart !== province && !nextPart.match(/^(Hà Nội|Hồ Chí Minh|Đà Nẵng|Hải Phòng|Cần Thơ)$/i) && !nextPart.match(/^\d+$/) && !nextPart.includes('Ngõ') && !nextPart.includes('Đường') && !nextPart.includes('Phố')) {
                    district = nextPart;
                    break;
                  }
                }
              }
            }
            if (!district) {
              for (let i = parts.length - 1; i >= 0; i--) {
                const part = parts[i];
                if (part === province || part.match(/^\d+$/) || part.includes('Hà Nội') || part.includes('Ho Chi Minh') || part.includes('Đà Nẵng') || part.includes('Hải Phòng') || part.includes('Cần Thơ')) {
                  continue;
                }
                if (part.length > 0 && part.length < 50) {
                  district = part;
                  break;
                }
              }
            }
          }
          return {
            status: 'Success',
            message: 'Lấy Địa Chỉ TomTom Thành Công',
            data: {
              address: address.streetName || address.street || '',
              district: district || undefined,
              province: province || undefined,
              fullAddress: address.freeformAddress || ''
            }
          };
        }
      }
      return { status: 'Error', message: 'Không Tìm Thấy Địa Chỉ', data: null };
    } catch (error: any) {
      return { status: 'Error', message: `Lỗi Hệ Thống: ${error.message}`, data: null };
    }
  }
}