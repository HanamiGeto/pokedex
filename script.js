let currentPokemon;

const color = {
    grass: '#49D0B0',
    fire: '#FC6C6D',
    water: '#91CAFA',
    electric: '#FFD76F',
    normal: '#B4B4A6',
    bug: '#B2D369',
    poison: '#B56DA7',
    ground: '#DABE6A',
    fairy: '#F0A8F0',
    fighting: '#C26D5E',
    psychic: '#F96CA4',
    rock: '#C5B67C',
    ghost: '#7C7CC5',
    ice: '#AABB22',
    dragon: '#8275E0'
};




async function loadPokemon() {
    for (let i = 1; i < 2; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        document.getElementById('pokemon-list-container').innerHTML += createPokemonCard(i);
        renderPokemonInfo(i);
        changeBackgroundColor(i);
        renderDetailedPokemonInfo();
    }
}


function renderPokemonInfo(i) {
    document.getElementById(`pokemon-name${i}`).innerHTML = capitalizeFirstLetter(currentPokemon['name']);
    document.getElementById(`pokemon-img${i}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`first-type${i}`).innerHTML = capitalizeFirstLetter(currentPokemon['types'][0]['type']['name']);
    if (currentPokemon['types'].length === 2) { // looks if the pokemon has two types
        document.getElementById(`second-type${i}`).innerHTML = capitalizeFirstLetter(currentPokemon['types'][1]['type']['name']);
    } else {
        document.getElementById(`second-type${i}`).classList.add('d-none'); // if pokemon has only one type, second span is getting display none
    }
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function createPokemonCard(i) {
    return `
    <div class="pokemon-card" id="pokemon-card${i}" onclick="openPokemonInfo(${i})">
            <div class="name">
                <h5 class="card-title" id="pokemon-name${i}">Card title</h5>
                <span class="attribute" id="first-type${i}">Grass</span>
                <span class="attribute" id="second-type${i}"></span>
            </div>
            <div class="pokemon-img">
                <img class="" id="pokemon-img${i}">
            </div>
        </div>
    `;
}


function changeBackgroundColor(i) {
    let type = currentPokemon['types'][0]['type']['name'];
    document.getElementById(`pokemon-card${i}`).style.backgroundColor = color[type];
}


function openPokemonInfo(i) {

}


function renderDetailedPokemonInfo() {
    document.getElementById(`pokemon-name-detail1`).innerHTML = capitalizeFirstLetter(currentPokemon['name']);
    document.getElementById(`pokemon-img-detail1`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`pokemon-img-detail2`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`pokemon-img-detail3`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`pokemon-img-detail4`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`pokemon-img-detail5`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];

}