import { getState } from '../state';
import { viewHtml } from './view';
import { renderTempChart, destroyTempChart } from '../components/ForecastChart';

// DOM elementy
export const dom = {
     cityInput: document.querySelector<HTMLInputElement>('#city-search'),
     datalist: document.querySelector<HTMLDataListElement>('#cities-datalist'),
     cityTitle: document.querySelector<HTMLElement>('#city'),
     forecastContainer: document.querySelector<HTMLElement>('#forecast-container')
}

export const setInput = (el: HTMLInputElement | null, value: string) => {
     if (el) el.value = value;
};

export const setText = (el: HTMLElement | null, value: string) => {
     if (el) el.textContent = value;
};

export const setHtml = (el: HTMLElement | null, html: string) => {
     if (el) el.innerHTML = html;
};

// Překreslí podle aktuálního state
export const render = () => {
     const state = getState();
     const locale = navigator.language;

     // 1) Tabulka + canvas
     setHtml(dom.forecastContainer, viewHtml(state, locale));

     const canvas = document.querySelector<HTMLCanvasElement>('#temp-chart');

     if (state.forecast.length > 0 && canvas) {
          renderTempChart(canvas, state.forecast, locale);
     } else {
          destroyTempChart();
     }
};
