const formulario = document.getElementById("pokeForm")
var abilitiesCounter=0;
var previousId=0;
let currentCry = null;

const namify = (str) => {
    return str
        .toLowerCase()
        .replace(/-/g, ' ')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const playCry = (cries) => {
    const url = cries?.latest || cries?.legacy;
    if (!url) return;

    if (currentCry) currentCry.pause();

    currentCry = new Audio(url);
    currentCry.play().catch(() => {});
}

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const id = document.getElementById("pokeId").value;

    let isDifferentFromPrevious=false;
    if(previousId != id) isDifferentFromPrevious=true;
    if(previousId === 0 || isDifferentFromPrevious) previousId = id;

    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const poke = await data.json();

    document.getElementById("pokeName").textContent = namify(poke.name);

    document.getElementById("pokeSprite").src = poke.sprites.front_default;

    document.getElementById("pokeHeight").textContent = `Altura: ${poke.height*10} cm`;
    document.getElementById("pokeWeight").textContent = `Peso: ${poke.weight/10} kg`;

    playCry(poke.cries);

    const abilitiesContainer = window.document.getElementById('pokeAbilities');
    const abilities = poke.abilities;

    if (isDifferentFromPrevious) {
        for (const c of abilitiesContainer.children) {
            c.textContent="";
            c.id="";
        }
        for (const a of abilities) {
            const newA = window.document.createElement('p');
            newA.id = abilitiesCounter++;
            newA.textContent = namify(a.ability.name);
            abilitiesContainer.appendChild(newA);
        }
    }
})
