const weatherApiKey = '8a4755cdd81b4bdcb9973512251210';
export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    tempC: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    windKph: number;
  };
}
export interface WeatherResponse {
  status: 'Success' | 'Error';
  message: string;
  data: WeatherData | null;
}
export const weatherApi = {
  getCurrentWeather: async (lat: number, lng: number): Promise<WeatherResponse> => {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${lat},${lng}&lang=vi&aqi=no`);
      if (response.ok) {
        const rawData = await response.json();
        const data: WeatherData = {
          location: {
            name: rawData.location.name,
            region: rawData.location.region,
            country: rawData.location.country
          },
          current: {
            tempC: rawData.current.temp_c,
            condition: {
              text: rawData.current.condition.text,
              icon: rawData.current.condition.icon
            },
            humidity: rawData.current.humidity,
            windKph: rawData.current.wind_kph
          }
        };
        return { status: 'Success', message: 'Lấy Dữ Liệu Thành Công', data };
      } else {
        return { status: 'Error', message: 'Lỗi Kết Nối Đến Máy Chủ Thời Tiết', data: null };
      }
    } catch (error) {
      return { status: 'Error', message: 'Đã Xảy Ra Lỗi Hệ Thống', data: null };
    }
  },
  getWeatherImpact: (weatherData: WeatherData | null): { factor: number; impact: string } => {
    if (!weatherData) {
      return { factor: 0, impact: 'Dữ Liệu Không Khả Dụng' };
    }
    const condition = weatherData.current.condition.text;
    const rainKeywords = ['Mưa', 'Rain', 'Drizzle', 'Shower'];
    const stormKeywords = ['Bão', 'Storm', 'Thunder', 'Sấm'];
    const fogKeywords = ['Sương Mù', 'Fog', 'Mist'];
    if (stormKeywords.some(keyword => condition.includes(keyword))) {
      return { factor: 0.15, impact: 'Bão/Sấm Chớp - Tăng Phí 15%' };
    } else if (rainKeywords.some(keyword => condition.includes(keyword))) {
      return { factor: 0.10, impact: 'Mưa - Tăng Phí 10%' };
    } else if (fogKeywords.some(keyword => condition.includes(keyword))) {
      return { factor: 0.05, impact: 'Sương Mù - Tăng Phí 5%' };
    }
    return { factor: 0, impact: 'Thời Tiết Bình Thường' };
  }
}