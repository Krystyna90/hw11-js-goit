import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import PicturesAPIService from "./pictures-api";
import markUpPictures from "./mark-up-pictures";


const refs = {
  form: document.querySelector('.search-form'),
  photoGallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  input: document.querySelector('input[name="searchQuery"]'),
  end: document.querySelector('.end-warning'),
}

refs.form.addEventListener('submit', onSearchBtnClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

const picturesApiService = new PicturesAPIService();
refs.loadMoreBtn.classList.add('is-hidden');
let currentHits = 0;

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

async function onSearchBtnClick(e) {
  e.preventDefault();
  clearImageContainer();
  picturesApiService.name = e.currentTarget.searchQuery.value;

  if (picturesApiService.name === '') {
    return Notiflix.Notify.warning('Insert something if you dare ;)');
  }
  picturesApiService.resetPage();
  const fetchPictures = await picturesApiService.fetchPictures();
  try {
    if (picturesApiService.totalHits > 0) {
      Notiflix.Notify.success(`We found ${picturesApiService.totalHits} for you!`);
      refs.photoGallery.insertAdjacentHTML('beforeend', markUpPictures(picturesApiService.hits));
      lightbox.refresh();
        refs.loadMoreBtn.classList.remove('is-hidden');
      currentHits = fetchPictures.length;

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
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }

    if (picturesApiService.totalHits < picturesApiService.perPage) {
      refs.loadMoreBtn.classList.add('is-hidden');
    }
  }

  catch {
    Notiflix.Notify.error('There is some error');
  }
}

async function onLoadMoreBtnClick(e) {
  const fetchPictures = await picturesApiService.fetchPictures();
  currentHits += fetchPictures.length;
 refs.photoGallery.insertAdjacentHTML('beforeend', markUpPictures(picturesApiService.hits));
  lightbox.refresh();
  console.log(currentHits, picturesApiService.totalHits);
  if (currentHits > picturesApiService.totalHits) {
    refs.end.classList.remove('is-hidden');
    refs.loadMoreBtn.classList.add('is-hidden');
  };
  }

function clearImageContainer() {
refs.photoGallery.innerHTML = '';
}



