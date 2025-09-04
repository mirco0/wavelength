// File to handle different clues packs
const packModal = document.getElementById("packsModal").querySelector("ul")

active = getActivePacks();

function createPackCards(){
    packs.forEach((pack) => {
        const card = document.createElement("div");
        card.classList.add("card");
        
        const title = document.createElement("h3");
        const description = document.createElement("p");
        const cards_count = document.createElement("p");
        
        if(active.includes(pack.id)){
            card.classList.toggle("selected");
        }

        title.innerText = pack.name;
        description.innerText = pack.description;
        cards_count.innerText = `${pack.clues.length} carte`
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(cards_count);
        card.onclick = () => {
            card.classList.toggle("selected");
            togglePack(pack.id);
            // toggle_cookies(id);
        }
        packModal.appendChild(card);
    });
}
createPackCards();

function getActivePacks() {
  const cookies = document.cookie.split(";").map(c => c.trim());
  for (let c of cookies) {
    if (c.startsWith("activePacks=")) {
      const cookie = decodeURIComponent(c.substring("activePacks=".length));
      return cookie ? JSON.parse(cookie) : [];
    }
  }
  return [];
}

function saveActivePacks(ids) {
    const JSONids = JSON.stringify(ids);
    const d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = `activePacks=${encodeURIComponent(JSONids)};${expires};path=/`;
}

function togglePack(id) {
    if (active.includes(id)) {
        active = active.filter(x => x !== id);
    } else {
        active.push(id);
    }
    saveActivePacks(active);
}