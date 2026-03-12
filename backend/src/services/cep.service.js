const axios = require('axios');
async function getAddressByCep(cep) {
  const cleaned = String(cep).replace(/\D/g, '');
  const { data } = await axios.get(`https://viacep.com.br/ws/${cleaned}/json/`);
  if (data.erro) {
    const err = new Error('CEP não encontrado');
    err.status = 404;
    throw err;
  }
  return { cep: data.cep, street: data.logradouro, neighborhood: data.bairro, city: data.localidade, state: data.uf };
}
module.exports = { getAddressByCep };
