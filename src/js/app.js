import apiService from '../js/fecthapi'
import compiledTemplate from "../card.hbs";
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
    searchForm: document.querySelector('.search-form'),
    containerGallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
    anchor: document.querySelector('.anchor')

}

let lightbox = new SimpleLightbox('.gallery a',
    {
        captionsData: 'alt',
        captionDelay: 250,
        captionPosition: 'bottom',
    });

const newApiService = new apiService();

function onSearch (event) {
    event.preventDefault();

    newApiService.searchName = event.currentTarget.elements.searchQuery.value.trim();
    newApiService.resetPage();
    newApiService.fetchArticles().then(({ hits, totalHits }) => {

        addClassAnchor();

        if (newApiService.searchName === '') {
            Notiflix.Notify.failure('Oops... Please enter the text');
        } else if (hits.length === 0) { 
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return
        }

        Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);
        
        clearGallery();
        addArticles(hits);
        lightbox.refresh();
    })
}

function addArticles(hits) {
    refs.containerGallery.insertAdjacentHTML('beforeend', compiledTemplate(hits));
}

function clearGallery() {
    refs.containerGallery.innerHTML = '';
}

function checkTotalHits(totalHits) {
    const total = document.querySelectorAll('.photo-card').length;
    if (total >= totalHits) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
}

function lowScrollForBtnLoadMore() {
    const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 0.8,
            behavior: 'smooth',
        });
}

function addClassAnchor() {
    refs.anchor.classList.add('is-hidden');
}

function removeClassAnchor() {
    refs.anchor.classList.remove('is-hidden');
}

function handleAnchorClick() {
    refs.searchForm.scrollIntoView({block: "center", behavior: "smooth"})
}


let options = {
    threshold: 1,
}

let callback = function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting && newApiService.searchName !== '') {
            newApiService.fetchArticles().then(({ hits, totalHits }) => {
                addArticles(hits);
                lowScrollForBtnLoadMore()
                lightbox.refresh();
                removeClassAnchor();
                checkTotalHits(totalHits);
            })
        }
    })   
};

let observer = new IntersectionObserver(callback, options);

observer.observe(refs.loadMore)


refs.searchForm.addEventListener('submit', onSearch);
refs.anchor.addEventListener('click', handleAnchorClick);