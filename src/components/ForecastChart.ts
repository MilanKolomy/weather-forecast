import { Chart } from 'chart.js/auto';
import type { WeatherInterval } from '../types';
import { formatDate } from '../services/formatter';

let chart: Chart | null = null;

// Odstraní graf
export const destroyTempChart = () => {
     if (chart) {
          chart.destroy();
          chart = null;
     }
};

// Zobrazí grafu
export const renderTempChart = (
     canvas: HTMLCanvasElement,
     data: WeatherInterval[],
     locale: string
) => {
     destroyTempChart();

     const labels = data.map((d) => formatDate(d.dt_txt, locale));
     const temps = data.map((d) => Math.round(d.main.temp));

     chart = new Chart(canvas, {
          type: 'line',
          data: {
               labels,
               datasets: [
                    {
                         label: 'Teplota',
                         data: temps,
                         tension: 0.35,
                         pointRadius: 4,
                         borderWidth: 2,
                         fill: false,
                    },
               ],
          },
          options: {
               responsive: true,
               maintainAspectRatio: false,
               plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
               },
               scales: {
                    y: {
                         ticks: { callback: (v) => `${v} °C` },
                    },
               },
          },
     });
};