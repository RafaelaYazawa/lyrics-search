import { debounce, clearSuggestions, suggestionsRendering } from "./utils.js";
import { getApiData } from "./api.js";

const input = document.querySelector(".search-bar");
const suggestionsList = document.querySelector(".suggestions-list");
const lyricsContainer = document.querySelector(".lyrics");
const songMap = new WeakMap();
const debouncedSearch = debounce(handleSearch, 300);

let currentIndex = -1;

input.addEventListener("input", debouncedSearch);
input.addEventListener("keydown", handleKeyboardNavigation);

suggestionsList.addEventListener("click", async (e) => {
  e.preventDefault();
  const li = e.target.closest("li");
  if (!li) return;
  const song = songMap.get(li);
  if (!song) return;

  const lyricsUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(song.artist.name)}/${encodeURIComponent(song.title)}`;

  clearSuggestions(suggestionsList);
  lyricsContainer.innerHTML = `
    <div class="loading">
      <span class="spinner"></span>
      <p>Loading lyrics...</p>
    </div>
  `;

  const data = await getApiData(lyricsUrl);
  if (!data || !data.lyrics || data.error) {
    clearSuggestions(suggestionsList);
    lyricsContainer.textContent = "Sorry... no lyrics match found.";
    return;
  }

  lyricsContainer.textContent = data.lyrics;
  suggestionsList.classList.add("hidden");
  input.setAttribute("aria-expanded", "false");
  currentIndex = -1;
});

function handleKeyboardNavigation(e) {
  const items = suggestionsList.querySelectorAll("[data-suggestion='true']");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    currentIndex = (currentIndex + 1) % items.length;
    updateSelection(items);
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateSelection(items);
  }
  if (e.key === "Enter") {
    if (currentIndex >= 0) {
      e.preventDefault();
      items[currentIndex].click();
    }
  }
  if (e.key === "Escape") {
    suggestionsList.classList.add("hidden");
    input.setAttribute("aria-expanded", "false");
    currentIndex = -1;
  }
}

function updateSelection(items) {
  items.forEach((item, index) => {
    const isSelected = index === currentIndex;

    item.setAttribute("aria-selected", isSelected);

    if (isSelected) {
      item.classList.add("active");
      item.scrollIntoView({ block: "center" });
    } else {
      item.classList.remove("active");
    }
  });
}

async function handleSearch() {
  const searchTerm = input.value.trim();
  if (!searchTerm) {
    clearSuggestions(suggestionsList);

    suggestionsList.classList.add("hidden");
    input.setAttribute("aria-expanded", "false");

    return;
  }

  const suggestionsUrl = `https://api.lyrics.ovh/suggest/${searchTerm}`;

  const data = await getApiData(suggestionsUrl);
  if (!data) return;
  const songs = data.data.slice(0, 10);

  suggestionsRendering(songs, suggestionsList, songMap);

  suggestionsList.classList.remove("hidden");
  input.setAttribute("aria-expanded", "true");
  currentIndex = -1;
}
