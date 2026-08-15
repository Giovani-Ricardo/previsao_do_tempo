const API_BASE_URL = 'http://localhost:3000';
const STORAGE_KEY = 'cidadesSalvas';

const cidadeInput = document.getElementById('cidade');
const btnBuscar = document.getElementById('btnBuscar');
const resultado = document.getElementById('resultado');
const nomeCidadeEl = document.getElementById('nomeCidade');
const iconeClimaEl = document.getElementById('iconeClima');
const descricaoEl = document.getElementById('descricao');
const temperaturaEl = document.getElementById('temperatura');
const btnSalvar = document.getElementById('btnSalvar');
const listaCidadesEl = document.getElementById('listaCidades');

let cidadeAtual = null;

btnBuscar.addEventListener('click', buscarClima);
cidadeInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        buscarClima();
    }
});
btnSalvar.addEventListener('click', salvarCidadeAtual);

renderizarListaCidades();

async function buscarClima() {
    const cidade = cidadeInput.value.trim();

    if (!cidade) {
        return;
    }

    try {
        const dados = await consultarClima(cidade);
        cidadeAtual = dados.name;
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

async function consultarClimaSemana(cidade) {
    const response = await fetch(`${API_BASE_URL}/clima/semana?city=${encodeURIComponent(cidade)}`);
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

function salvarCidadeAtual() {
    if (!cidadeAtual) {
        return;
    }

    const cidades = obterCidadesSalvas();
    const jaExiste = cidades.some((cidade) => cidade.toLowerCase() === cidadeAtual.toLowerCase());

    if (jaExiste) {
        alert('Essa cidade já está na sua lista.');
        return;
    }

    cidades.push(cidadeAtual);
    salvarCidades(cidades);
    renderizarListaCidades();
}

function removerCidade(cidade) {
    const cidades = obterCidadesSalvas().filter((c) => c !== cidade);
    salvarCidades(cidades);
    renderizarListaCidades();
}

function obterCidadesSalvas() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

function salvarCidades(cidades) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cidades));
}

async function renderizarListaCidades() {
    const cidades = obterCidadesSalvas();
    listaCidadesEl.innerHTML = '';

    if (cidades.length === 0) {
        const item = document.createElement('li');
        item.className = 'list-group-item text-muted';
        item.textContent = 'Nenhuma cidade salva ainda.';
        listaCidadesEl.appendChild(item);
        return;
    }

    cidades.forEach((cidade) => {
        listaCidadesEl.appendChild(criarItemCarregando(cidade));
    });

    const resumos = await Promise.all(
        cidades.map((cidade) =>
            consultarClima(cidade)
                .then((dados) => ({ cidade, dados }))
                .catch(() => ({ cidade, dados: null }))
        )
    );

    listaCidadesEl.innerHTML = '';
    resumos.forEach(({ cidade, dados }) => {
        listaCidadesEl.appendChild(criarItemCidade(cidade, dados));
    });
}

function criarItemCarregando(cidade) {
    const item = document.createElement('li');
    item.className = 'list-group-item text-muted';
    item.textContent = `${cidade} — carregando...`;
    return item;
}

function criarItemCidade(cidade, dados) {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';

    const info = document.createElement('span');

    if (dados) {
        const icone = document.createElement('img');
        icone.src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`;
        icone.alt = dados.weather[0].description;
        icone.width = 30;
        icone.height = 30;
        icone.className = 'me-2 icone-clima-bg icone-lista';

        const texto = document.createElement('strong');
        texto.textContent = `${cidade} — ${Math.round(dados.main.temp)}°C, ${dados.weather[0].description}`;

        info.appendChild(icone);
        info.appendChild(texto);
    } else {
        info.textContent = `${cidade} — não foi possível obter a previsão`;
    }

    const btnRemover = document.createElement('button');
    btnRemover.type = 'button';
    btnRemover.className = 'btn btn-sm btn-outline-danger';
    btnRemover.textContent = 'Remover';
    btnRemover.addEventListener('click', () => removerCidade(cidade));

    item.appendChild(info);
    item.appendChild(btnRemover);
    return item;
}
