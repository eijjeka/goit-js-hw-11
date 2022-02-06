import axios from "axios/dist/axios.min.js";

const API_KEY = '25546226-16034f7c6795ec18e54b1dcda';
const BASE_URL = 'https://pixabay.com/api/';

export default class apiService {
    constructor() {
        this.name = '';
        this.API_KEY = API_KEY;
        this.BASE_URL = BASE_URL;
        this.page = 1;
    }

    async fetchArticles() {
        try {
            const response = await axios.get(`${this.BASE_URL}?key=${this.API_KEY}&q=${this.name}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`);
            const articles = await response.data;
            this.incrementPage();
            return articles
        } catch (error) {
            console.error(error);
        }
    }

    incrementPage() {
         this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get searchName () {
        return this.name;
    }

    set searchName (newName) {
       this.name = newName;
    }
}