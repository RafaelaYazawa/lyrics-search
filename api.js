async function getApiData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching api data: ", error);
    return null;
  }
}

export { getApiData };
