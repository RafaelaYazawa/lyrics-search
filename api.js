const input = document.querySelector(".search-bar");
const suggestionsList = document.querySelector(".suggestions-list");

const lyricsContainer = document.querySelector(".lyrics-container");
const songMap = new WeakMap();

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
    const noResultsP = document.createElement("p");
    noResultsP.style.padding = "0 0.5rem";
    noResultsP.textContent = "No song or artist were found.";
    suggestionsList.innerHTML = "";
    suggestionsList.appendChild(noResultsP);
    return;
  }

  suggestionsList.innerHTML = "";
  suggestionsList.classList.remove("hidden");

  songs.forEach((song) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} by ${song.artist.name}`;

    songMap.set(li, song);
    suggestionsList.appendChild(li);
  });
}

async function getApiData(url) {
  try {
    const response = await axios.get(url, {
      timeout: 3000,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching api data: ", error);
    return null;
  }
}

suggestionsList.addEventListener("click", async (e) => {
  e.preventDefault();
  const song = songMap.get(e.target);
  if (!song) return;

  const lyricsUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(song.artist.name)}/${encodeURIComponent(song.title)}`;

  clearSuggestions();
  lyricsContainer.innerHTML = "<p>Loading lyrics...</p>";

  const data = await getApiData(lyricsUrl);
  if (!data || !data.lyrics || data.error) {
    clearSuggestions();
    lyricsContainer.innerHTML = "<p>Sorry... no lyrics match found.</p>";
    return;
  }

  console.log(data.lyrics);

  lyricsContainer.innerHTML = `<pre>${data.lyrics}</pre>`;
  suggestionsList.classList.add("hidden");
});
