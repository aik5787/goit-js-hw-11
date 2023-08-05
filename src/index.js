
import Notiflix from 'notiflix';
import axios from "axios";


const apiKey = "38632886-c853eefcb5943d1a53be12591";
const searchForm = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
// const loadMoreBtn = document.querySelector(".load-more");
// const input = document.querySelector(".input");


searchForm.addEventListener('submit', handleSearch);

async function searchImages(searchQuery) {
  const apiUrl = "https://pixabay.com/api/";
  const params = new URLSearchParams({
  key: apiKey,
  q: searchQuery,
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true,
});
     try {
    const response = await axios.get(apiUrl, { params });
    return response.data.hits;
  } catch (error) {
    throw new Error('Error fetching images');
  }
}
 


async function handleSearch(event) {
    event.preventDefault();
      const formData = new FormData(event.target);
  const searchQuery = formData.get('searchQuery');
    if (searchQuery === "") {
        return;
    }
      try {
    const images = await searchImages(searchQuery);
        if (images.length === 0) {
      gallery.innerHTML = ''; 
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

          gallery.innerHTML = ''; 
          createPhotoCard(images);
  
      } catch (error) {
            Notiflix.Notify.failure('Error fetching images');
  }
}

function createPhotoCard(images) {
    const markup = images.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) =>
    `<div class="photo-card">
        <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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

  gallery.innerHTML = markup;
}