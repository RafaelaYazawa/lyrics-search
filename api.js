const input = document.querySelector(".search-bar");
const suggestionsList = document.querySelector(".suggestions-list");

const lyricsContainer = document.querySelector(".lyrics-container");

input.addEventListener("input", async (e) => {
  const searchTerm = input.value.trim();
  if (!searchTerm) {
    clearSuggestions();
    return;
  }

  const suggestionsUrl = `https://api.lyrics.ovh/suggest/${searchTerm}`;

  const data = await getApiData(suggestionsUrl);
  if (!data) return;
  const songs = data.data.slice(0, 10);

  suggestionsRendering(songs);
});

function clearSuggestions() {
  suggestionsList.innerHTML = "";
  suggestionsList.classList.add("hidden");
}

function suggestionsRendering(songs) {
  if (!songs || songs.length === 0) {
    clearSuggestions();
    return;
  }

  suggestionsList.innerHTML = "";
  suggestionsList.classList.remove("hidden");

  songs.forEach((song) => {
    const li = document.createElement("li");
    li.textContent = `"${song.title}" by ${song.artist.name}`;
    suggestionsList.appendChild(li);
  });
}

async function getApiData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching api data: ", error);
    return null;
  }
}
