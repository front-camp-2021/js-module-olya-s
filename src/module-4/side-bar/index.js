import FiltersList from '../filters-list/index.js';
import DoubleSlider from '../../module-5/double-slider/index.js';

export default class SideBar {
  element;
  subElements = {};
  components = {};

  onClick = () => {
    const filters = this.components;
    Object.values(filters).forEach(item => item.reset());
    this.update(this.categoryFilter, this.brandFilter);
    this.element.dispatchEvent(new CustomEvent('clear-filters'));
  }

  constructor(categoryFilter = [], brandFilter = []) {
    this.categoryFilter = categoryFilter;
    this.brandFilter = brandFilter;

    this.render();
    this.initializeComponents();
    this.getSubElements();
    this.update(this.categoryFilter, this.brandFilter);
    this.addEventListeners();
  }

  get template() {
    return `<form class="filter-form" method="get" action="#">
      <h2 class="filter-form__title">Filters
        <button class="filter-form__submit-button" type="submit">&lt;&lt;</button>
      </h2>
      <div class="filter-form__list-wrapper">
        <div class="filters" data-element="body">
        </div>
      </div>
      <button class="filter-form__clear-button" data-element="button">Clear all filters</button>
    </form>`
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstChild;
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
    this.subElements = {};
    for (let component of Object.values(this.components)) {
      component.destroy();
    }
    this.components = {};
  }

  update(categoryFilter, brandFilter) {
    const filters = this.components;
    const filterElements = Object.values(filters).map(filter => filter && filter.element);
    this.subElements.body.innerHTML = "";
    filterElements.forEach((filter, index) => {
      if (index) {
        const hr = document.createElement('hr');
        this.subElements.body.appendChild(hr);
      }
      this.subElements.body.appendChild(filter);
    });
    this.updateFilterGroups(categoryFilter, brandFilter);
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    this.subElements = result;
  }

  initializeComponents() {
    const doubleSlider = new DoubleSlider;
    const categoryFilterList = new FiltersList();
    const brandFilterList = new FiltersList();
    this.components = {
      doubleSlider,
      categoryFilterList,
      brandFilterList
    }
  }

  updateFilterGroups(categoryFilter, brandFilter) {
    if (categoryFilter.length) {
      let title = categoryFilter[0].value.split('=')[0];
      title = title[0].toUpperCase() + title.slice(1);
      this.components.categoryFilterList.update(title, categoryFilter);
    }
    if (brandFilter.length) {
      let title = brandFilter[0].value.split('=')[0];
      title = title[0].toUpperCase() + title.slice(1);
      this.components.brandFilterList.update(title, brandFilter);
    }
  }

  addEventListeners() {
    this.subElements.button.addEventListener('click', this.onClick);
  }

  removeEventListeners() {
    this.subElements.button.removeEventListener('click', this.onClick);
  }
}
