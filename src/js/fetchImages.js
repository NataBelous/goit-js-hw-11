const fetchImages = (query, page = 1) => {
  return fetch(`https://pixabay.com/api/?key=32884713-1ea7b5e89acc379c4728b8541&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
}

export default fetchImages;
