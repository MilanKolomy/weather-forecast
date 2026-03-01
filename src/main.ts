import './styles/main.scss';
import citiesRaw from './data/cz-city.list.json';
import type { City } from './types';
import { createController } from './app/controller';

const citiesData = citiesRaw as City[];

const initApp = () => {
     createController(citiesData).init();
};

document.addEventListener('DOMContentLoaded', initApp);