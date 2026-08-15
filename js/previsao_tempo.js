const API_BASE_URL = 'http://localhost:3000';
const STORAGE_KEY = 'cidadesSalvas';
const MUNICIPIOS_URL = 'data/municipios-brasil.json';

const cidadeInput = document.getElementById('cidade');
const listaMunicipiosEl = document.getElementById('listaMunicipios');
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

carregarMunicipios();
renderizarListaCidades();

async function carregarMunicipios() {
    try {
        const response = await fetch(MUNICIPIOS_URL);
        const municipios = await response.json();

        const fragmento = document.createDocumentFragment();
        municipios.forEach(([nome, uf]) => {
            const option = document.createElement('option');
            option.value = `${nome} - ${uf}`;
            fragmento.appendChild(option);
        });
        listaMunicipiosEl.appendChild(fragmento);
    } catch (error) {
        console.error('Não foi possível carregar a lista de municípios.', error);
    }
}

function extrairNomeCidade(valor) {
    const separadorIndex = valor.lastIndexOf(' - ');
    return separadorIndex === -1 ? valor : valor.slice(0, separadorIndex);
}

async function buscarClima() {
    const valorDigitado = cidadeInput.value.trim();

    if (!valorDigitado) {
        return;
    }

    const cidade = extrairNomeCidade(valorDigitado);

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
    const response = await fetch(`${API_BASE_URL}/clima?city=${encodeURIComponent(`${cidade},BR`)}`);
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
    resumos.forEach(({ cidade, dados }, idx) => {
        listaCidadesEl.appendChild(criarItemCidade(cidade, dados, idx));
    });
}

function extrairDiaSemana(dtTxt) {
    const data = new Date(dtTxt.replace(' ', 'T'));
    return data.toLocaleDateString('pt-BR', { weekday: 'short' });
}

function criarItemCarregando(cidade) {
    const item = document.createElement('li');
    item.className = 'list-group-item text-muted';
    item.textContent = `${cidade} — carregando...`;
    return item;
}

function criarItemCidade(cidade, dados, idx) {
    const item = document.createElement('li');
    item.className = 'list-group-item';

    const colapsoId = `previsao-semana-${idx}`;

    const cabecalho = document.createElement('div');
    cabecalho.className = 'cabecalho-cidade d-flex justify-content-between align-items-center';
    cabecalho.setAttribute('role', 'button');
    cabecalho.setAttribute('tabindex', '0');
    cabecalho.setAttribute('data-bs-toggle', 'collapse');
    cabecalho.setAttribute('data-bs-target', `#${colapsoId}`);
    cabecalho.setAttribute('aria-expanded', 'false');
    cabecalho.setAttribute('aria-controls', colapsoId);

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

    const acoes = document.createElement('span');
    acoes.className = 'd-flex align-items-center';

    const chevron = document.createElement('span');
    chevron.className = 'chevron-collapse me-3';
    chevron.textContent = '▾';

    const btnRemover = document.createElement('button');
    btnRemover.type = 'button';
    btnRemover.className = 'btn btn-sm btn-outline-danger';
    btnRemover.textContent = 'Remover';
    btnRemover.addEventListener('click', (event) => {
        event.stopPropagation();
        removerCidade(cidade);
    });

    acoes.appendChild(chevron);
    acoes.appendChild(btnRemover);

    cabecalho.appendChild(info);
    cabecalho.appendChild(acoes);

    const colapso = document.createElement('div');
    colapso.className = 'collapse mt-3';
    colapso.id = colapsoId;

    const diasContainer = document.createElement('div');
    diasContainer.className = 'previsao-semana d-flex flex-nowrap overflow-auto pb-2';

    colapso.appendChild(diasContainer);

    let carregado = false;
    colapso.addEventListener('show.bs.collapse', () => {
        if (carregado) {
            return;
        }
        carregado = true;
        carregarPrevisaoSemana(cidade, diasContainer);
    });

    item.appendChild(cabecalho);
    item.appendChild(colapso);
    return item;
}

async function carregarPrevisaoSemana(cidade, container) {
    container.textContent = 'Carregando previsão da semana...';

    try {
        const dias = await consultarClimaSemana(cidade);
        container.textContent = '';
        dias.forEach((dia) => container.appendChild(criarCardDia(dia)));
    } catch (error) {
        container.textContent = 'Não foi possível carregar a previsão da semana.';
    }
}

function criarCardDia(dia) {
    const card = document.createElement('div');
    card.className = 'card text-center flex-shrink-0';

    const corpo = document.createElement('div');
    corpo.className = 'card-body p-2';

    const nomeDia = document.createElement('p');
    nomeDia.className = 'mb-1 fw-bold text-capitalize';
    nomeDia.textContent = extrairDiaSemana(dia.dt_txt);

    const icone = document.createElement('img');
    icone.src = `https://openweathermap.org/img/wn/${dia.weather[0].icon}.png`;
    icone.alt = dia.weather[0].description;
    icone.width = 40;
    icone.height = 40;
    icone.className = 'icone-clima-bg icone-lista mx-auto d-block';

    const temp = document.createElement('p');
    temp.className = 'mb-0 small';
    temp.textContent = `${Math.round(dia.main.temp)}°C`;

    corpo.appendChild(nomeDia);
    corpo.appendChild(icone);
    corpo.appendChild(temp);
    card.appendChild(corpo);
    return card;
}
