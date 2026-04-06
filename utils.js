function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

function clearSuggestions(list) {
  list.innerHTML = "";
  list.classList.add("hidden");
}

function suggestionsRendering(songs, list, songMap) {
  if (!songs || songs.length === 0) {
    const noResultsP = document.createElement("p");
    noResultsP.style.padding = "0 0.5rem";
    noResultsP.textContent = "No song or artist were found";
    list.innerHTML = "";
    list.appendChild(noResultsP);
    return;
  }

  list.innerHTML = "";
  list.classList.remove("hidden");

  songs.forEach((song) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} by ${song.artist.name}`;

    songMap.set(li, song);
    list.appendChild(li);
  });
}

export { debounce, clearSuggestions, suggestionsRendering };
