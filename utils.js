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
    const noResultsP = document.createElement("li");
    noResultsP.style.padding = "0.7rem 0.5rem";
    noResultsP.textContent = "No song or artist were found";
    noResultsP.setAttribute("aria-disabled", "true");
    list.innerHTML = "";
    list.appendChild(noResultsP);
    list.classList.remove("hidden");
    return;
  }

  list.innerHTML = "";
  list.classList.remove("hidden");

  songs.forEach((song) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} by ${song.artist.name}`;
    li.dataset.suggestion = "true";
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", "false");

    songMap.set(li, song);
    list.appendChild(li);
  });
}

export { debounce, clearSuggestions, suggestionsRendering };
