import type { City } from '../types';

// Převod stupňů na radiány
const toRad = (deg: number) => (deg * Math.PI) / 180;

// Výpočet vzdálenosti
const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
     const R = 6371;
     const dLat = toRad(lat2 - lat1);
     const dLon = toRad(lon2 - lon1);

     const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

     return 2 * R * Math.asin(Math.sqrt(a));
};

// najde nejbližší město z lokální databáze
export const findNearestCity = (lat: number, lon: number, cities: City[]): City | null => {
     if (!cities.length) return null;

     return cities.reduce((best, c) => {
          const bestDist = haversineKm(lat, lon, best.coord.lat, best.coord.lon);
          const d = haversineKm(lat, lon, c.coord.lat, c.coord.lon);
          return d < bestDist ? c : best;
     }, cities[0]);
};

