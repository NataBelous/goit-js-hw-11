import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { axios } from 'axios';
import SimpleLightbox from "simplelightbox";
import fetchImages from './js/fetchImages';
import renderImageCard from './js/renderImageCard';
import refs from './js/refs';

import "simplelightbox/dist/simple-lightbox.min.css";
import './css/styles.css';

let page;
let searchQuery;

const gallery = new SimpleLightbox('.gallery a');

const loadPage = () => {
  refs.loadMoreBtn.classList.add('is-hidden');

  fetchImages(searchQuery, page)
    .then((images) => {
      if (images.hits.length === 0 && page === 1) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
      }

      const markup = images.hits.map(image => renderImageCard(image)).join('');
      refs.galleryContainer.insertAdjacentHTML('beforeend', markup);

      gallery.refresh();

      if (images.totalHits > page * 40) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      } else {
        Notify.failure('We\'re sorry, but you\'ve reached the end of search results.');
      }

      if (page === 1) {
        Notify.info(`Hooray! We found ${images.totalHits} images.`);
      } else {
        const { height: cardHeight } = refs.galleryContainer.firstElementChild.getBoundingClientRect();
        window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
      }

      page += 1;
    })
    .catch(() => {
      Notify.failure('Oops. Try again later.');
    });
};

const onSearch = (event) => {
  event.preventDefault();

  searchQuery = event.target.searchQuery.value.trim();
  if (!searchQuery) return;

  page = 1
  refs.galleryContainer.innerHTML = '';

  loadPage();
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', loadPage);
