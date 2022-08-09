import Notiflix from "notiflix";
export default class PicturesAPIService{
  constructor() {
    this.name = '';
    this.page = 1;
    this.totalHits = 0;
    this.hits = 0;
  }
  fetchPictures() {
    const url = `https://pixabay.com/api/?key=29099820-015ce301a6c1b4fc2f744a348&q=${this.name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

return fetch(url)
    .then(response => response.json())
  .then(({hits, totalHits})=> {
    this.page += 1;
    this.totalHits = totalHits;
    this.hits = hits;
    return hits;
  });
  }

  resetPage() {
    this.page = 1;
  }

  get pictureName() {
    return this.name;
  }

  set pictureName(newName) {
    this.name = newName;
  }
}