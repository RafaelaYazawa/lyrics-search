import { debounce, clearSuggestions, suggestionsRendering } from "./utils.js";
import { getApiData } from "./api.js";

const input = document.querySelector(".search-bar");
const suggestionsList = document.querySelector(".suggestions-list");
const lyricsContainer = document.querySelector(".lyrics-container");
const songMap = new WeakMap();

async function handleSearch() {
  const searchTerm = input.value.trim();
  if (!searchTerm) {
    clearSuggestions(suggestionsList);
    return;
  }

  const suggestionsUrl = `https://api.lyrics.ovh/suggest/${searchTerm}`;

  const data = await getApiData(suggestionsUrl);
  if (!data) return;
  const songs = data.data.slice(0, 10);

  suggestionsRendering(songs, suggestionsList, songMap);
}

const debouncedSearch = debounce(handleSearch, 300);
input.addEventListener("input", debouncedSearch);

suggestionsList.addEventListener("click", async (e) => {
  e.preventDefault();
  const li = e.target.closest("li");
  if (!li) return;
  const song = songMap.get(li);
  if (!song) return;

  const lyricsUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(song.artist.name)}/${encodeURIComponent(song.title)}`;

  clearSuggestions(suggestionsList);
  lyricsContainer.innerHTML = "<p>Loading lyrics...</p>";

  const data = await getApiData(lyricsUrl);
  if (!data || !data.lyrics || data.error) {
    clearSuggestions(suggestionsList);
    lyricsContainer.innerHTML = "<p>Sorry... no lyrics match found.</p>";
    return;
  }

  console.log(data.lyrics);

  lyricsContainer.innerHTML = `<pre>${data.lyrics}</pre>`;
  suggestionsList.classList.add("hidden");
});
