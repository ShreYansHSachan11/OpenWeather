/**
 * OpenWeatherMap API Response Types
 * These interfaces match the structure of responses from the OpenWeatherMap API
 */

/**
 * OpenWeatherMap Current Weather API Response
 */
export interface OpenWeatherCurrentResponse {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

/**
 * OpenWeatherMap 5-Day Forecast API Response
 */
export interface OpenWeatherForecastResponse {
  city: {
    name: string;
  };
  list: Array<{
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}

/**
 * Generic API Error Response
 */
export interface APIError {
  message: string;
  code?: string | number;
  status?: number;
}
