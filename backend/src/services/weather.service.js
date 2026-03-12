const axios = require('axios');
async function geocodeCity(city, state) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const { data } = await axios.get('https://api.openweathermap.org/geo/1.0/direct', { params: { q: `${city},${state},BR`, limit: 1, appid: apiKey } });
  if (!data || !data.length) {
    const err = new Error('Cidade não encontrada para previsão do tempo');
    err.status = 404;
    throw err;
  }
  return { lat: data[0].lat, lon: data[0].lon, name: data[0].name };
}
function sameDay(a, b) {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
}
async function getRainForecastForDate(city, state, date) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return { checkedAt: new Date(), hasRain: false, summary: 'Configure OPENWEATHER_API_KEY para habilitar a previsão.' };
  const { lat, lon, name } = await geocodeCity(city, state);
  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/forecast', { params: { lat, lon, units: 'metric', lang: 'pt_br', appid: apiKey } });
  const target = new Date(date);
  const matches = (data.list || []).filter(item => sameDay(new Date(item.dt * 1000), target));
  if (!matches.length) return { checkedAt: new Date(), hasRain: false, summary: `Sem previsão disponível para ${name} nessa data.` };
  const rainy = matches.some(item => (item.weather || []).some(w => /rain|chuva/i.test(w.main) || /chuva/i.test(w.description)));
  const descriptions = [...new Set(matches.flatMap(item => item.weather.map(w => w.description)))];
  return { checkedAt: new Date(), hasRain: rainy, summary: rainy ? `Há chance de chuva em ${name}. Condições: ${descriptions.join(', ')}.` : `Sem indicativo de chuva em ${name}. Condições: ${descriptions.join(', ')}.` };
}
module.exports = { getRainForecastForDate };
