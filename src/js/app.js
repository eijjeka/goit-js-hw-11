import compiledTemplate from "../card.hbs";
import Notiflix from 'notiflix';
import apiService from '../js/fecthapi'
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
    searchForm: document.querySelector('.search-form'),
    containerGallery: document.querySelector('.gallery'),
    loadMorebtn: document.querySelector('.load-more'),
    anchor: document.querySelector('.anchor')
}

let lightbox =  new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250, captionPosition: 'bottom', });

const newApiService = new apiService();

function onSearch (event) {
    event.preventDefault();
    newApiService.searchName = event.currentTarget.elements.searchQuery.value.trim();
    newApiService.resetPage()
    newApiService.fetchArticles().then(articles => {
        totalArticlesFound(articles);
        addClassBtn();
        addClassAnchor();
        clearGallery();

        if (newApiService.searchName === '') {
            Notiflix.Notify.failure('Oops... Please enter the text');
            return
        } else if (articles.length === 0) { 
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return
        }
        addArticles(articles);
        removeClassBtn();
        removeClassAnchor();
    })
}

function onLoadMore() {
    newApiService.fetchArticles().then(articles => { 
        addArticles(articles);
        checkTotalHits(articles);
        console.log(articles)
    });
}

function addArticles(articles) {
    refs.containerGallery.insertAdjacentHTML('beforeend', compiledTemplate(articles));
}

function clearGallery() {
    refs.containerGallery.innerHTML = '';
}

function checkTotalHits({totalHits}) {
    const total = document.querySelectorAll('.photo-card');
    console.log(totalHits)
    if (total.length >= totalHits) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        addClassBtn();
    }
}

function totalArticlesFound({totalHits }) {
    Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);
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

