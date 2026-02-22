// Typ pro město z lokálního city.list.json
export interface City {
     id: number;
     name: string;
     state: string;
     country: string;
     coord: {
          lon: number;
          lat: number;
     };
}

// OpenWeather - weather element
export interface WeatherCondition {
     id: number;
     main: string;
     description: string;
     icon: string;
}

// Typ pro jeden záznam předpovědi
export interface WeatherInterval {
     dt: number;
     dt_txt: string;
     main: {
          temp: number;
          temp_min: number;
          temp_max: number;
          pressure: number;
          humidity: number;
     };
     weather: WeatherCondition[];
     wind: {
          speed: number;
          deg: number;
     };
}

// Typ pro celou odpověď z REST API
export interface WeatherResponse {
     cod: string;
     message: number;
     cnt: number;
     list: WeatherInterval[];
     city: {
          id: number;
          name: string;
          coord: {
               lat: number;
               lon: number;
          };
          country: string;
          population: number;
          timezone: number;
          sunrise: number;
          sunset: number;
     };
}