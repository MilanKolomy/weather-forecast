// Datum
export const formatDate = (dateStr: string, locale: string): string => {
     const date = new Date(dateStr);

     return new Intl.DateTimeFormat(locale, {
          weekday: 'long',   // např. "pondělí"
          day: 'numeric',    // např. "12."
          month: 'long'      // např. "června"

     }).format(date);
};

const usesImperial = (locale = navigator.language) => locale.startsWith("en-US");

// Teplota - formátuje, zaokrouhluje.
export const formatTemp = (tempC: number, locale = navigator.language): string => {
     const imperial = usesImperial(locale);
     const value = imperial ? (tempC * 9) / 5 + 32 : tempC;

     return new Intl.NumberFormat(locale, {
          style: "unit",
          unit: imperial ? "fahrenheit" : "celsius",
          maximumFractionDigits: 1,
     }).format(value);
};

// Vlhkost
export const formatHumidity = (humidityPercent: number, locale = navigator.language): string => {
     return new Intl.NumberFormat(locale, {
          style: "percent",
          maximumFractionDigits: 0,
     }).format(humidityPercent / 100);
};

// Tlak
export const formatPressure = (pressureHpa: number, locale = navigator.language): string => {
     const formatted = new Intl.NumberFormat(locale, {
          maximumFractionDigits: 0,
     }).format(pressureHpa);

     return `${formatted} hPa`;
};
