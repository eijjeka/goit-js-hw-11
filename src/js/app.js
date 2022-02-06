import apiService from '../js/fecthapi'
import compiledTemplate from "../card.hbs";
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const refs = {
    searchForm: document.querySelector('.search-form'),
    containerGallery: document.querySelector('.gallery'),
    loadMorebtn: document.querySelector('.load-more'),
    anchor: document.querySelector('.anchor')

}
let quantityValueLoadMore = 1;

const newApiService = new apiService();

function onSearch (event) {
    event.preventDefault();
    newApiService.searchName = event.currentTarget.elements.searchQuery.value.trim();
    newApiService.resetPage();
    newApiService.fetchArticles().then(({ hits, totalHits }) => {

        quantityValueLoadMore = 1;

        addClassBtn();
        addClassAnchor();
        clearGallery();

        if (newApiService.searchName === '') {
            Notiflix.Notify.failure('Oops... Please enter the text');
            return 
        } else if (hits.length === 0) { 
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return
        }

         Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);

        addArticles(hits);
        removeClassBtn();
        removeClassAnchor();
    })
}

function onLoadMore() {
    newApiService.fetchArticles().then(({hits, totalHits}) => { 
        addArticles(hits);
        checkTotalHits(totalHits);
    });
    
}

function addArticles(hits) {

    refs.containerGallery.insertAdjacentHTML('beforeend', compiledTemplate(hits));
    let lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250, captionPosition: 'bottom', });
    lightbox.refresh();

    if (quantityValueLoadMore > 1) lowScrollForBtnLoadMore();
    quantityValueLoadMore++
}

function clearGallery() {
    refs.containerGallery.innerHTML = '';
}

function checkTotalHits(totalHits) {
    const total = document.querySelectorAll('.photo-card');
    console.log(totalHits)
    if (total.length >= totalHits) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        addClassBtn();
    }
}

function lowScrollForBtnLoadMore() {
    const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        });
}

function addClassBtn() {
    refs.loadMorebtn.classList.add('is-hidden');
}

function removeClassBtn() {
    refs.loadMorebtn.classList.remove('is-hidden');
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

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMorebtn.addEventListener('click', onLoadMore);
refs.anchor.addEventListener('click', handleAnchorClick);


