
import Notiflix from 'notiflix';
import axios from "axios";


const apiKey = "38632886-c853eefcb5943d1a53be12591";
const searchForm = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
const input = document.querySelector(".input");

const perPage = 40;
let currentPage = 1;


searchForm.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', loadMoreImages);

async function searchImages(searchQuery, currentPage) {
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
       console.log(response.data)
    return response.data;
  } catch (error) {
    throw new Error('Error fetching images');
  }
}
 


async function handleSearch(event) {
  event.preventDefault();
  loadMoreBtn.style.display = 'none';
      const formData = new FormData(event.target);
  const searchQuery = formData.get('searchQuery');
    if (!searchQuery) {
        return;
  };
  
  try {
        gallery.innerHTML = ''; 
    const images = await searchImages(searchQuery, currentPage = 1);
        if (images.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    gallery.innerHTML = createPhotoCard(images);
     Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
     if (images.totalHits > currentPage * perPage) {
      loadMoreBtn.style.display = "flex";
    } else {
      loadMoreBtn.style.display = "none";
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  
      } catch (error) {
            Notiflix.Notify.failure('Error fetching images');
  }
}

function createPhotoCard(images) {
  const { totalHits, hits } = images;
    return hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) =>
    `<div class="photo-card">
        <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" width = 300/>
        </a>
        <div class="info">
            <p class="info-item">
                <b>Likes:</b> ${likes}
            </p>
            <p class="info-item">
                <b>Views:</b> ${views}
            </p>
            <p class="info-item">
                <b>Comments:</b> ${comments}
            </p>
            <p class="info-item">
                <b>Downloads:</b> ${downloads}
            </p>
        </div>
    </div>`
    ).join('');
}

async function loadMoreImages() {
  currentPage += 1;
  const searchQuery = input.value;
    try {
    const images = await searchImages(searchQuery, currentPage);
      gallery.insertAdjacentHTML('beforeend', createPhotoCard(images));
    if (images.totalHits >= (currentPage - 1) * perPage + images.hits.length) {
      loadMoreBtn.style.display = "flex";
    } else {
      loadMoreBtn.style.display = "none";
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    Notiflix.Notify.failure('Error fetching images');
  }
 
 }