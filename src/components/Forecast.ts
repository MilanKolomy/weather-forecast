import type { WeatherInterval } from '../types';
import { formatDate, formatTemp, formatHumidity, formatPressure } from '../services/formatter';

// Render hednoho řádku tabulky.
const createRow = (item: WeatherInterval, locale: string): string => `
    <tr class="forecast-row">
        <td class="date">${formatDate(item.dt_txt, locale)}</td>
        <td class="temp">${formatTemp(item.main.temp, locale)}</td>
        <td class="forecast-desc">
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
            ${item.weather[0].description}
        </td>
        <td>${formatHumidity(item.main.humidity, locale)}</td>
        <td>${formatPressure(item.main.pressure, locale)}</td>
    </tr>
`;

// Render tabulky na základě pole intervalů.
export const renderForecastTable = (
     data: WeatherInterval[],
     locale: string
): string => {
     if (data.length === 0) return '';

     return `
    <div class="table-wrapper">
      <table class="forecast-table">
        <thead>
          <tr> 
               <th>Den</th> 
               <th>Teplota</th> 
               <th>Předpověď</th> 
               <th>Vlhkost</th> 
               <th>Tlak</th> 
          </tr>
        </thead>
        <tbody>
          ${data.map(item => createRow(item, locale)).join('')}
        </tbody>
      </table>
    </div>
  `;
};

// Render chyby
export const renderError = (message: string): string => `
    <div class="error-message">
        <p>⚠️ ${message}</p>
    </div>
`;
