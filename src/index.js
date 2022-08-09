import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import PicturesAPIService from "./pictures-api";

const refs = {
  form: document.querySelector('.search-form'),
  photoGallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
input: document.querySelector('input[name="searchQuery"]'),
}

refs.form.addEventListener('submit', onSearchBtnClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

const picturesApiService = new PicturesAPIService();
refs.loadMoreBtn.setAttribute('disabled', true);
let currentHits = 0;

function markUpPictures(images) {
  return images.map(({webformatURL, largeImageURL, tags, likes,views,comments,downloads}) => {
    return `
        <div class="photo-card">
  <a class="gallery__item" href="${largeImageURL}">
  <img class="gallery__image" src="${webformatURL}" alt="${tags}" width= "360" height ="220" />
  </a>
   <div class="info">
   <p class="info-item">
    <b>Likes :<span class ="info-b"> ${likes}</span></b>
    </p>
     <p class="info-item">
     <b>Views :<span class ="info-b"> ${views}</span></b>
     </p>
     <p class="info-item">
     <b>Comments:<span class ="info-b"> ${comments}</span></b>
     </p>
     <p class="info-item">
       <b>Downloads :<span class ="info-b">${downloads}</span></b>
       </p>
   </div>
</div>`;
    })
        .join('');
}

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

function onSearchBtnClick(e) {
  e.preventDefault();
  clearImageContainer();
  refs.loadMoreBtn.removeAttribute('disabled');
  picturesApiService.name = e.currentTarget.searchQuery.value;

  if (picturesApiService.name === '') {
    return Notiflix.Notify.warning('Insert something if you dare ;)');
  }

  picturesApiService.resetPage();
  picturesApiService.fetchPictures()
    .then(images => {
      currentHits = picturesApiService.hits.length;
      if (picturesApiService.totalHits > 0) {
        Notiflix.Notify.success(`We found ${picturesApiService.totalHits} for you!`);
        refs.photoGallery.insertAdjacentHTML('beforeend', markUpPictures(images));
        lightbox.refresh();

        const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      }

      if (picturesApiService.totalHits === 0) {
        clearImageContainer();
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
      }

    })
    .catch(error => Notiflix.Notify.error('There is some error'));
}

function onLoadMoreBtnClick(e) {
  picturesApiService.fetchPictures().then(images => {
    refs.photoGallery.insertAdjacentHTML('beforeend', markUpPictures(images));
    lightbox.refresh();
  })
    .catch(error => Notiflix.Notify.failure('Oops, something went wrong'));

  currentHits += picturesApiService.hits.length;
  if (currentHits === picturesApiService.totalHits) {
      Notiflix.Notify.info('You have reached the end of the results');
      refs.loadMoreBtn.setAttribute('disabled', true);
    }
}

function clearImageContainer() {
refs.photoGallery.innerHTML = '';
}



