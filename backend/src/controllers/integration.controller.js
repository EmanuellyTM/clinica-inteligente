const { getAddressByCep } = require('../services/cep.service');
const { getRainForecastForDate } = require('../services/weather.service');
async function addressByCep(req, res) { res.json(await getAddressByCep(req.params.cep)); }
async function rainForecast(req, res) {
  const { city, state, date } = req.query;
  res.json(await getRainForecastForDate(city, state, date));
}
module.exports = { addressByCep, rainForecast };
