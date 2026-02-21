// Typ pro město ze src/data/cz-city.list.json
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