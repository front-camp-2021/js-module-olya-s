// import FiltersList from '../filters-list/index.js';

export default class SideBar {
  element;
  subElements;

  onClick = event => {
    if (event.target.className === 'filter-form__clear-button') {
      console.log(event.target, this.subElements.filters.children);
      // const filters = this.getFiltersGroups();
      // Object.values(filters).forEach(item => console.log(item))
      // this.update();
    }
  }

  constructor({ categoryFilter = [], brandFilter = [], Component = {} }) {
    this.categoryFilter = categoryFilter;
    this.brandFilter = brandFilter;
    this.Component = Component;

    this.render();
    this.getSubElements();
    this.getFiltersGroups();
    this.update();
    this.addEventListeners();
  }

  get template() {
    return `<form class="filter-form" method="get" action="#">
      <h2 class="filter-form__title">Filters
        <button class="filter-form__submit-button" type="submit">&lt;&lt;</button>
      </h2>
      <div class="filter-form__list-wrapper">
        <div class="filters" data-element="filters">
        </div>
      </div>
      <button class="filter-form__clear-button">Clear all filters</button>
    </form>`
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstChild;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    removeEventListener('click', this.onClick);
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  update() {
    const filters = this.getFiltersGroups();
    this.subElements.filters.replaceChildren(...Object.values(filters));
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');
    console.log(elements)
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    this.subElements = result;
    console.log(this.subElements)
  }

  getFiltersGroups() {
    let categoryFilterList = null;
    let brandFilterList = null;
    if (this.categoryFilter.length) {
      const title = this.categoryFilter[0].value.split('=')[0];
      categoryFilterList = new this.Component({
        title: title[0].toUpperCase() + title.slice(1),
        list: this.categoryFilter
      }).element;
      const hr = document.createElement('hr');
      categoryFilterList.appendChild(hr);
    }
    if (this.brandFilter.length) {
      const title = this.brandFilter[0].value.split('=')[0];
      brandFilterList = new this.Component({
        title: title[0].toUpperCase() + title.slice(1),
        list: this.brandFilter
      }).element;
    }
    const filters = { categoryFilterList, brandFilterList };
    return filters;
  }

  addEventListeners() {
    this.element.addEventListener('click', this.onClick);
  }
}
