import axios from "axios";
const apiKey = "38632886-c853eefcb5943d1a53be12591";
const perPage = 40;


export async function searchImages(searchQuery, currentPage) {
    const apiUrl = "https://pixabay.com/api/";
  const params = new URLSearchParams({
  key: apiKey,
  q: searchQuery,
  image_type: "photo",
  orientation: "horizontal",
    safesearch: true,
  per_page: perPage,
    page: currentPage,
});
     try {
       const response = await axios.get(apiUrl, { params });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching images');
  }
}