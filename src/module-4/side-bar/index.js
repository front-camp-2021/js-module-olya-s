export default class SideBar {
  element;
  subElements = {};

  onClick = event => {
    const filters = this.getFilterGroups();
    Object.values(filters).forEach(item => item.reset());
    this.update();
    this.element.dispatchEvent(new CustomEvent('clear-filters'));
  }

  constructor({ categoryFilter = [], brandFilter = [], Component = {} }) {
    this.categoryFilter = categoryFilter;
    this.brandFilter = brandFilter;
    this.Component = Component;

    this.render();
    this.getSubElements();
    this.getFilterGroups();
    this.update();
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
  }

  update() {
    const filters = this.getFilterGroups();
    const filterElements = Object.values(filters).map(filter => filter && filter.element);
    this.subElements.body.replaceChildren(...filterElements);
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

  getFilterGroups(data) {
    let categoryFilterList = null;
    let brandFilterList = null;
    if (this.categoryFilter.length) {
      const title = this.categoryFilter[0].value.split('=')[0];
      categoryFilterList = new this.Component({
        title: title[0].toUpperCase() + title.slice(1),
        list: this.categoryFilter
      });
      const hr = document.createElement('hr');
      categoryFilterList.element.appendChild(hr);
    }
    if (this.brandFilter.length) {
      const title = this.brandFilter[0].value.split('=')[0];
      brandFilterList = new this.Component({
        title: title[0].toUpperCase() + title.slice(1),
        list: this.brandFilter
      });
    }
    const filters = { categoryFilterList, brandFilterList };
    return filters;
  }

  addEventListeners() {
    this.subElements.button.addEventListener('click', this.onClick);
  }

  removeEventListeners() {
    this.subElements.button.removeEventListener('click', this.onClick);
  }
}
