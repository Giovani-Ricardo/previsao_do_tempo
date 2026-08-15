const API_BASE_URL = 'http://localhost:3000';

const cidadeInput = document.getElementById('cidade');
const btnBuscar = document.getElementById('btnBuscar');
const resultado = document.getElementById('resultado');
const nomeCidadeEl = document.getElementById('nomeCidade');
const iconeClimaEl = document.getElementById('iconeClima');
const descricaoEl = document.getElementById('descricao');
const temperaturaEl = document.getElementById('temperatura');

btnBuscar.addEventListener('click', buscarClima);
cidadeInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        buscarClima();
    }
});

async function buscarClima() {
    const cidade = cidadeInput.value.trim();

    if (!cidade) {
        return;
    }

    try {
        const dados = await consultarClima(cidade);
        exibirResultado(dados);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function consultarClima(cidade) {
    const response = await fetch(`${API_BASE_URL}/clima?city=${encodeURIComponent(cidade)}`);
    const dados = await response.json();

    if (!response.ok) {
        throw new Error(dados.error || 'Cidade não encontrada.');
    }

    return dados;
}

function exibirResultado(dados) {
    nomeCidadeEl.textContent = dados.name;
    iconeClimaEl.src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}@2x.png`;
    iconeClimaEl.alt = dados.weather[0].description;
    descricaoEl.textContent = dados.weather[0].description;
    temperaturaEl.textContent = Math.round(dados.main.temp);
    resultado.classList.remove('d-none');
}
