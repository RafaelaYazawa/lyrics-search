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
    li.textContent = `${song.title} by ${song.artist.name}`;
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

suggestionsList.addEventListener("click", async (e) => {
  e.preventDefault();
  const [title, artist] = e.target.textContent.split(" by");

  const lyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;

  clearSuggestions();
  lyricsContainer.innerHTML = "<p>Loading lyrics...</p>";

  const data = await getApiData(lyricsUrl);
  if (!data || !data.lyrics || data.error) {
    clearSuggestions();
    setTimeout(() => {
      lyricsContainer.innerHTML = "<p>Sorry... no lyrics match found.</p>";
    }, 1000);
    return;
  }

  console.log(data.lyrics);

  lyricsContainer.innerHTML = `<pre>${data.lyrics}</pre>`;
  suggestionsList.classList.add("hidden");
});
