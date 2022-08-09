
export function fetchPhotos(name) {
  return fetch(`https://pixabay.com/api/?key=29099820-015ce301a6c1b4fc2f744a348&q=${name}&image_type=photo&per_page=40&page=1`)
    .then(response => response.json())
    .then(console.log);
}