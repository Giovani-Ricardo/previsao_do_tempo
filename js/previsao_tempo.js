const API_BASE_URL = 'http://localhost:3000';

const cidadeInput = document.getElementById('cidade');
const btnBuscar = document.getElementById('btnBuscar');

btnBuscar.addEventListener('click', buscarClima);


async function buscarClima() {

    const cidade = cidadeInput.value.trim();

    if (!cidade) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/clima?city=${encodeURIComponent(cidade)}`
        );

        if (!response.ok) {
            throw new Error('Cidade não encontrada.');
        }

        const data = await response.json();

        console.log(data);

        icone = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}