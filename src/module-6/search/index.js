import { debounce } from '../../module-1/debounce/index.js';

export default class Search {
  element;

  debounce = callback => {
    let timeout;
    return function (argument) {
      clearTimeout(timeout);
      timeout = setTimeout(callback, 2000, argument);
    }
  }

  onInput = debounce(event => {
    this.element.dispatchEvent(new CustomEvent('search-filter', {
      bubbles: true,
      detail: {
        search: event.target.value.trim()
      }
    }))
  }, 2000);

  constructor() {
    this.value = 7618;
    this.render();
  }

  get template() {
    return `<form class="search" method="get" action="#">
        <div class="search__results">
          <p>${this.value} results found</p>
          <button class="search__button-like">
            <img src="../../images/like.svg" alt="heart icon">
          </button>
        </div>
        <label for="search-input" hidden>Search</label>
        <input class="search__input" id="search-input" type="text" placeholder="Search">
        <img class="search__image" src="../../images/search.svg" alt="search icon">
      </form>`
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.addEventListeners();
  }

  remove() {
    if (this.element) {
      this.removeEventListeners();
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }

  addEventListeners() {
    this.element.addEventListener('input', this.onInput);
  }

  removeEventListeners() {
    this.element.removeEventListener('input', this.onInput);
  }

  clear() {
    this.element['search-input'].value = '';
  }
}
