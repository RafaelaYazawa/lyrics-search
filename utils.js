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
    noSongsFound(list);
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
    li.setAttribute("tabindex", "-1");

    songMap.set(li, song);
    list.appendChild(li);
  });
}

function noSongsFound(list) {
  const noResultsItem = document.createElement("li");
  noResultsItem.style.padding = "0.7rem 0.5rem";
  noResultsItem.textContent = "No song or artist were found";
  noResultsItem.setAttribute("aria-disabled", "true");
  list.innerHTML = "";
  list.appendChild(noResultsItem);
  list.classList.remove("hidden");
}

export { debounce, clearSuggestions, suggestionsRendering, noSongsFound };
