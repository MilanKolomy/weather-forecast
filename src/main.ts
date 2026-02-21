import './styles/main.scss';


import citiesRaw from '../src/data/cz-city.list.json';
import type { City } from './types';
import { setupSearch } from './components/Search';

const citiesData = citiesRaw as City[];

const init = () => {
     const cityInput = document.querySelector<HTMLInputElement>('#city-search');
     const datalist = document.querySelector<HTMLDataListElement>('#cities-datalist');

     if (!cityInput || !datalist) return;

     setupSearch(cityInput, datalist, citiesData);
};

document.addEventListener('DOMContentLoaded', init);