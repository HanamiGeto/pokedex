let currentPokemon;
let currentSearchPokemon;
let allPokemon = [];
let searchPokemon = [];
let pokemonSpecies;
let allPokemonSpecies = [];
let pokemonEvolution;
let allPokemonEvolutions = [];
let start = 0;
let updatePokemon = 25;
let liked;
let allLiked = [];
let currentPkmn;

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
    ice: '#98D8D8',
    dragon: '#8275E0',
    flying: '#99A8FF',
    dark: '#8B6E5F',
    steel: '#B6B6C5'
};


window.onscroll = function (ev) { // if window is scrolled to the end, 25 more Pokemons will load up
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        loadMorePokemon();
        loadPokemon();
    }
};


function init() {
    loadPokemon();
    loadAllPokemon();
    loadPokemonSpecies();
}


async function loadPokemon() { // fetching the first 25 pokemons and is pushing them into the array (lazy-loading)
    for (let i = start + 1; i < updatePokemon + 1; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        allPokemon.push(currentPokemon);
    }
    setTimeout(showPokemons, 500);
}


async function loadAllPokemon() { // fetching all pokemons in the background 
    for (let i = 1; i < 906; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentSearchPokemon = await response.json();
        searchPokemon.push(currentSearchPokemon);
    }
}


async function loadPokemonSpecies() { // fetching all pokemon species in the background 
    for (let i = 1; i < 905; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon-species/${i}`;
        let response = await fetch(url);
        pokemonSpecies = await response.json();
        allPokemonSpecies.push(pokemonSpecies);
    }
    await loadPokemonEvolutions();
}


async function loadPokemonEvolutions() { // fetching all pokemon evolutions in the background 
    for (let i = 0; i < 468; i++) {
        let url = allPokemonSpecies[i]['evolution_chain']['url'];
        let response = await fetch(url);
        pokemonEvolution = await response.json();
        allPokemonEvolutions.push(pokemonEvolution);
    }
}


function showPokemons() {   // shows first 25 pokemons and every card gets a like button
    for (let i = start; i < updatePokemon; i++) {
        document.getElementById('pokemon-list-container').innerHTML += createPokemonCard(i);
        renderPokemonInfo(i);
        changeBackgroundColor('pokemon-card', i);
        liked = 'white';
        allLiked.push(liked);
    }
}


function loadMorePokemon() {
    if (updatePokemon >= 906) {
        updatePokemon = 906;
    } else {
        updatePokemon += 25;
        start += 25;
    }
}


function renderPokemonInfo(i) {
    changeNameAndImg(i);
    renderPokemonTypes('first-type', 'second-type', i);
}


function changeNameAndImg(i) {
    document.getElementById(`pokemon-name${i}`).innerHTML = capitalizeFirstLetter(allPokemon[i]['name']);
    document.getElementById(`pokemon-img${i}`).src = allPokemon[i]['sprites']['other']['official-artwork']['front_default'];
}


function renderPokemonTypes(id1, id2, i) {
    document.getElementById(`${id1}${i}`).innerHTML = capitalizeFirstLetter(allPokemon[i]['types'][0]['type']['name']);
    if (allPokemon[i]['types'].length === 2) { // looks if the pokemon has two types
        document.getElementById(`${id2}${i}`).innerHTML = capitalizeFirstLetter(allPokemon[i]['types'][1]['type']['name']);
    } else {
        document.getElementById(`${id2}${i}`).classList.add('d-none'); // if pokemon has only one type, second span is getting display none
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


function changeBackgroundColor(id, i) {
    let type = allPokemon[i]['types'][0]['type']['name'];
    document.getElementById(`${id}${i}`).style.backgroundColor = color[type];
}


function openPokemonInfo(i) {
    document.body.style.overflowY = 'hidden';
    document.getElementById('pokemon-info-container').classList.remove('d-none');
    showPokemonInfoCard(i);
    currentPkmn = i;
    showArrowsToGoThroughPokemons();
}


function showPokemonInfoCard(i) {
    document.getElementById('pokemon-info-container').innerHTML = createPokemonInfoContainer(i, allLiked[i]);
    changeBackgroundColor('pokedex', i);
    renderDetailedPokemonInfo(i);
}


function closePokemonInfo() {
    document.getElementById('pokemon-info-container').classList.add('d-none');
    document.body.style.overflowY = 'scroll';
}


function renderDetailedPokemonInfo(i) {
    changeNameAndImgDetailed(i);
    renderPokemonTypes('detailed-first-type', 'detailed-second-type', i);
    changePokemonID(i);
    changeProperties(i);
    changeStats(i);
    changeFlavorText(i);
    loadEvolutions(i);
}


function changeNameAndImgDetailed(i) {
    document.getElementById(`pokemon-name-detail${i}`).innerHTML = capitalizeFirstLetter(allPokemon[i]['name']);
    document.getElementById(`pokemon-img-detail${i}`).src = allPokemon[i]['sprites']['other']['official-artwork']['front_default'];
}


function changePokemonID(i) {
    let pokemonId = i + 1;
    document.getElementById(`pokemon-number${i}`).innerHTML = String("000" + pokemonId).slice(-3);
}


function changeProperties(i) { // changes the properties of height, weight and abilities
    let height = allPokemon[i]['height'];
    let weight = allPokemon[i]['weight'];
    let abilities = allPokemon[i]['abilities'];
    document.getElementById(`height${i}`).innerHTML = (height.toFixed(1) / 10) + ' m';
    document.getElementById(`weight${i}`).innerHTML = (weight.toFixed(1) / 10) + ' kg';
    if (abilities.length === 2) {
        document.getElementById(`abilities${i}`).innerHTML = abilities[0]['ability']['name'] + ', ' + abilities[1]['ability']['name'];
    } else {
        document.getElementById(`abilities${i}`).innerHTML = abilities[0]['ability']['name'];
    }
}


function changeFlavorText(i) { //flavor text is a brief description of the pokemon
    let flavorText = allPokemonSpecies[i]['flavor_text_entries'][3]['flavor_text'];
    document.getElementById(`flavor-text${i}`).innerHTML = flavorText.replace('\f', '\n');
}


function changeStats(i) {
    let pokemonStats = allPokemon[i]['stats'];
    document.getElementById(`hp${i}`).innerHTML = pokemonStats[0]['base_stat'];
    document.getElementById(`atk${i}`).innerHTML = pokemonStats[1]['base_stat'];
    document.getElementById(`def${i}`).innerHTML = pokemonStats[2]['base_stat'];
    document.getElementById(`sp-atk${i}`).innerHTML = pokemonStats[3]['base_stat'];
    document.getElementById(`sp-def${i}`).innerHTML = pokemonStats[4]['base_stat'];
    document.getElementById(`speed${i}`).innerHTML = pokemonStats[5]['base_stat'];
}


function showStatsbar(i) {
    let pokemonStats = allPokemon[i]['stats'];
    document.getElementById(`hp-bar${i}`).style.width = pokemonStats[0]['base_stat'] + '%';
    document.getElementById(`atk-bar${i}`).style.width = pokemonStats[1]['base_stat'] + '%';
    document.getElementById(`def-bar${i}`).style.width = pokemonStats[2]['base_stat'] + '%';
    document.getElementById(`sp-atk-bar${i}`).style.width = pokemonStats[3]['base_stat'] + '%';
    document.getElementById(`sp-def-bar${i}`).style.width = pokemonStats[4]['base_stat'] + '%';
    document.getElementById(`speed-bar${i}`).style.width = pokemonStats[5]['base_stat'] + '%';
}


function showEvolutions(i) {
    showFirstPokemon(i);
    checkSecondEvolution(i)
    checkThirdEvolution(i);
}


function showFirstPokemon(i) {
    let firstPokemon = allPokemonEvolutions[i]['chain']['species']['name'];
    // shows first evolution
    document.getElementById(`pokemon-evo-name-first${i}`).innerHTML = capitalizeFirstLetter(findPokemon(firstPokemon)['name']);
    document.getElementById(`pokemon-evo-img-first${i}`).src = findPokemon(firstPokemon)['sprites']['other']['official-artwork']['front_default'];
}


function checkSecondEvolution(i) {
    if (evoSecond(i).length === 1) {
        let secondPokemon = allPokemonEvolutions[i]['chain']['evolves_to'][0]['species']['name'];
        // shows second evolution
        document.getElementById(`pokemon-evo-name-second${i}`).innerHTML = capitalizeFirstLetter(findPokemon(secondPokemon)['name']);
        document.getElementById(`pokemon-evo-img-second${i}`).src = findPokemon(secondPokemon)['sprites']['other']['official-artwork']['front_default'];
    } else {
        document.getElementById(`evo-headline${i}`).innerHTML = 'No evolution for this Pokemon!';
        document.getElementById(`first-evo${i}`).classList.add('d-none');
    }
}


function checkThirdEvolution(i) {
    if (evoSecond(i).length === 0) { // checks if the pokemon has a evolution or not
        document.getElementById(`last-evo${i}`).classList.add('d-none');
    } else if (evoThird(i).length === 1) { // checks if there is a third evolution
        let secondPokemon = allPokemonEvolutions[i]['chain']['evolves_to'][0]['species']['name'];
        let thirdPokemon = allPokemonEvolutions[i]['chain']['evolves_to'][0]['evolves_to'][0]['species']['name'];
        document.getElementById(`pokemon-evo-name-third${i}`).innerHTML = capitalizeFirstLetter(findPokemon(secondPokemon)['name']);
        document.getElementById(`pokemon-evo-img-third${i}`).src = findPokemon(secondPokemon)['sprites']['other']['official-artwork']['front_default'];
        // shows third evolution
        document.getElementById(`pokemon-evo-name-fourth${i}`).innerHTML = capitalizeFirstLetter(findPokemon(thirdPokemon)['name']);
        document.getElementById(`pokemon-evo-img-fourth${i}`).src = findPokemon(thirdPokemon)['sprites']['other']['official-artwork']['front_default'];
    } else {
        document.getElementById(`last-evo${i}`).classList.add('d-none');
    }
}


function loadEvolutions(i) {    
    if (allPokemonEvolutions.length === 468) {  // if all pokemon evolutions are pushed into the array, evolution button will be activated
        document.getElementById('pills-contact-tab').removeAttribute('disabled');
        showEvolutions(i);
    }
}


function findPokemon(pokemon) { // search and matching the pokemon for the evolutions
    return searchPokemon.find(e => e['name'] === pokemon);
}


function evoSecond(i) {
    return allPokemonEvolutions[i]['chain']['evolves_to'];
}


function evoThird(i) {
    return allPokemonEvolutions[i]['chain']['evolves_to'][0]['evolves_to'];
}


function like(i) {
    let likeImg = document.getElementById(`like${i}`);
    let like = allLiked[i];
    if (like == 'white') {
        likeImg.src = 'img/heart-red.png';
        allLiked[i] = 'red';
    } else {
        likeImg.src = 'img/heart-white.png';
        allLiked[i] = 'white';
    }
}


function filterPokemon() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    let pokemonList = document.getElementById('pokemon-list-container');
    pokemonList.innerHTML = '';
    for (let i = 0; i < allPokemon.length; i++) {
        let pokemon = allPokemon[i]['name'];
        if (pokemon.toLowerCase().includes(search)) {
            pokemonList.innerHTML += createPokemonCard(i);
            renderPokemonInfo(i);
            changeBackgroundColor('pokemon-card', i);
        }
    }
}


function previousPokemon() {
    openPokemonInfo(currentPkmn - 1);
}


function nextPokemon() {
    openPokemonInfo(currentPkmn + 1);
}


function showArrowsToGoThroughPokemons() {
    if (currentPkmn === 0) { // if first pokemon-info-card will be opened, it only shows right arrow
        showOnlyRightArrow();
    } else if (currentPkmn === allPokemon.length - 1) { // if last pokemon-info-card will be opened, it only shows left arrow
        showOnlyLeftArrow();
    } else {
        showAllArrows();
    }
}


function showOnlyRightArrow() {
    document.getElementById('right-arrow-placeholder').classList.add('d-none');
    document.getElementById('right-arrow').classList.remove('d-none');
}


function showOnlyLeftArrow() {
    document.getElementById('left-arrow-placeholder').classList.add('d-none');
    document.getElementById('left-arrow').classList.remove('d-none');
}


function showAllArrows() {
    document.getElementById('right-arrow-placeholder').classList.add('d-none');
    document.getElementById('right-arrow').classList.remove('d-none');
    document.getElementById('left-arrow-placeholder').classList.add('d-none');
    document.getElementById('left-arrow').classList.remove('d-none');
}


function doNotClose(event) {
    event.stopPropagation();
}


function createPokemonInfoContainer(i, liked) {
    return `
    <div class="pokemon-info-card" onclick="doNotClose(event)">
            <div id="pokedex${i}" class="pokedex">
                <div class="head-icons">
                    <img src="img/arrow-118-32.png" onclick="closePokemonInfo()">
                    <img id="like${i}" src="img/heart-${liked}.png" onclick="like(${i})">
                </div>
                <div class="head-content">
                    <h2 id="pokemon-name-detail${i}"></h2>
                    <span>#<span id="pokemon-number${i}">001</span></span>
                </div>
                <div>
                    <span class="attribute" id="detailed-first-type${i}">Grass</span>
                    <span class="attribute" id="detailed-second-type${i}">Poison</span>
                </div>
                <div class="img-with-arrows">
                    <img class="arrows d-none" id="left-arrow" src="img/arrow-89-32.png" onclick="previousPokemon()">
                    <div class="arrow-placeholder" id="left-arrow-placeholder"></div>
                    <img class="pokemon-img-detail" id="pokemon-img-detail${i}">
                    <img class="arrows d-none" id="right-arrow" src="img/arrow-25-32.png" onclick="nextPokemon()">
                    <div class="arrow-placeholder"  id="right-arrow-placeholder"></div>
                </div>
            </div>
            <div class="info-container">
                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill"
                            data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home"
                            aria-selected="true">About</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                            data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile"
                            aria-selected="false" onclick="showStatsbar(${i})">Base Stats</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-contact-tab" data-bs-toggle="pill"
                            data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact"
                            aria-selected="false" disabled>Evolution</button>
                    </li>
                </ul>
                <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="pills-home" role="tabpanel"
                        aria-labelledby="pills-home-tab" tabindex="0">
                        <div class="first-stats">
                            <p id="flavor-text${i}">A strange seed was planted on its back at birth.The plant sprouts and grows with this POKéMON.</p>
                            <div class="about-container">
                                <div class="about-properties">
                                    <span>Height</span>
                                    <span>Weight</span>
                                    <span>Abilities</span>
                                </div>
                                <div class="properties">
                                    <span id="height${i}">1</span>
                                    <span id="weight${i}">1</span>
                                    <span id="abilities${i}">Abilities</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab"
                        tabindex="0">
                        <div class="about-container">
                            <div class="about-properties">
                                <span>HP</span>
                                <span>Attack</span>
                                <span>Defense</span>
                                <span>Sp. Atk</span>
                                <span>Sp. Def</span>
                                <span>Speed</span>
                            </div>
                            <div class="properties">
                                <span id="hp${i}">45</span>
                                <span id="atk${i}">60</span>
                                <span id="def${i}">48</span>
                                <span id="sp-atk${i}">65</span>
                                <span id="sp-def${i}">65</span>
                                <span id="speed${i}">45</span>
                            </div>
                            <div class="bar">
                                <div class="progress" style="height: 4px;">
                                    <div id="hp-bar${i}" class="progress-bar bg-stats-color2" role="progressbar"
                                        aria-label="Example 1px high" style="width:" aria-valuenow="25"
                                        aria-valuemin="0" aria-valuemax="100">
                                    </div>
                                </div>

                                <div class="progress" style="height: 4px;">
                                    <div id="atk-bar${i}" class="progress-bar bg-stats-color1" role="progressbar"
                                        aria-label="Example 1px high" style="width:" aria-valuenow="25"
                                        aria-valuemin="0" aria-valuemax="100">
                                    </div>
                                </div>
                                <div class="progress" style="height: 4px;">
                                    <div id="def-bar${i}" class="progress-bar bg-stats-color2" role="progressbar"
                                        aria-label="Example 1px high" style="width:" aria-valuenow="25"
                                        aria-valuemin="0" aria-valuemax="100">
                                    </div>
                                </div>
                                <div class="progress" style="height: 4px;">
                                    <div id="sp-atk-bar${i}" class="progress-bar bg-stats-color1" role="progressbar"
                                        aria-label="Example 1px high" style="width:" aria-valuenow="25"
                                        aria-valuemin="0" aria-valuemax="100">
                                    </div>
                                </div>
                                <div class="progress" style="height: 4px;">
                                    <div id="sp-def-bar${i}" class="progress-bar bg-stats-color1" role="progressbar"
                                        aria-label="Example 1px high" style="width:" aria-valuenow="25"
                                        aria-valuemin="0" aria-valuemax="100">
                                    </div>
                                </div>
                                <div class="progress" style="height: 4px;">
                                    <div id="speed-bar${i}" class="progress-bar bg-stats-color2" role="progressbar"
                                        aria-label="Example 1px high" style="width:" aria-valuenow="25"
                                        aria-valuemin="0" aria-valuemax="100">
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab"
                        tabindex="0">
                        <div class="about-container evolution-container">
                            <span id="evo-headline${i}">Evolution Chain</span>
                            <div class="evolution" id="first-evo${i}">
                                <div class="evolution-with-name">
                                    <img id="pokemon-evo-img-first${i}">
                                    <span id="pokemon-evo-name-first${i}">asdfsdfs</span>
                                </div>
                                <img class="evo-arrow" src="img/arrow-8-32.png">
                                <div class="evolution-with-name">
                                    <img id="pokemon-evo-img-second${i}">
                                    <span id="pokemon-evo-name-second${i}">asdfsdfs</span>
                                </div>
                            </div>
                            <div class="evolution" id="last-evo${i}">
                                <div class="evolution-with-name">
                                    <img id="pokemon-evo-img-third${i}">
                                    <span id="pokemon-evo-name-third${i}">asdfsdfs</span>
                                </div>
                                <img class="evo-arrow" src="img/arrow-8-32.png">
                                <div class="evolution-with-name">
                                    <img id="pokemon-evo-img-fourth${i}">
                                    <span id="pokemon-evo-name-fourth${i}">asdfsdfs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


