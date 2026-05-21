console.log("js file loaded");

const LIMIT = 10;
let offset = 0;
let isLoading = false;
let allLoaded = false;

async function loadPokemon() {

    if (isLoading || allLoaded) return;
    isLoading = true;

    document.getElementById("spinnerContainer").style.display = "flex";
    document.getElementById("loadMoreBtn").disabled = true;

    try {
        const listRes = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${LIMIT}`);
        const listJson = await listRes.json();

        if (!listJson.results || listJson.results.length === 0) {
            allLoaded = true;
            return;
        }

        const detailPromises = listJson.results.map(p =>
            fetch(p.url).then(r => r.json())
        );
        const details = await Promise.all(detailPromises);

        const pokemonList = document.getElementById("pokemonList");

        details.forEach(pokemon => {
            const imgUrl = pokemon.sprites?.other?.['official-artwork']?.front_default
                || pokemon.sprites?.front_default
                || '';

            const stats = pokemon.stats || [];
            const hp  = stats.find(s => s.stat.name === "hp")?.base_stat    ?? "?";
            const atk = stats.find(s => s.stat.name === "attack")?.base_stat  ?? "?";
            const def = stats.find(s => s.stat.name === "defense")?.base_stat ?? "?";

            const types = (pokemon.types || [])
                .map(t => t.type.name)
                .join(" / ");

            const ability = pokemon.abilities?.[0]?.ability?.name ?? "—";

            const card = document.createElement("div");
            card.classList.add("hovereffect");

            card.innerHTML = `
                <img src="${imgUrl}" alt="${pokemon.name}">
                <div class="overlay">
                    <h2>${pokemon.name}</h2>
                    <div class="poke-stats">
                        <p>HP: ${hp}</p>
                        <p>ATK: ${atk} &nbsp; DEF: ${def}</p>
                        <p>Type: ${types}</p>
                        <p>Ability: ${ability}</p>
                    </div>
                </div>
            `;

            pokemonList.appendChild(card);
        });

        offset += LIMIT;

        if (offset >= listJson.count) {
            allLoaded = true;
            document.getElementById("loadMoreBtn").textContent = "All Pokémon Loaded!";
            document.getElementById("loadMoreBtn").disabled = true;
        }

    } catch (err) {
        console.error("Error loading Pokémon:", err);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    document.getElementById("spinnerContainer").style.display = "none";

    if (!allLoaded) {
        document.getElementById("loadMoreBtn").disabled = false;
    }

    isLoading = false;
}

loadPokemon();

document.getElementById("loadMoreBtn").addEventListener("click", function () {
    loadPokemon();
});
