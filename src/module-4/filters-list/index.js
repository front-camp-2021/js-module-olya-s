export default class FiltersList {
  element;
  subElements = {};

  onChange = event => {
    const customEventName = event.target.checked ? 'add-filter' : 'remove-filter';
    this.element.dispatchEvent(new CustomEvent(customEventName, { detail: event.target.value }));
  }

  constructor({
    title = '',
    list = []
  } = {}) {
    this.title = title;
    this.list = list;

    this.render();
    this.getSubElements();
    this.update();
    this.addEventListeners();
  }

  get template() {
    return (
      `<fieldset>
        <legend class="filters__group">${this.title}</legend>
        <ul data-element="body"> 
        ${this.getFilterOptions()} 
        </ul>
      </fieldset>`
    )
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
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

  update() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getFilterOptions();
    this.subElements.body.replaceChildren(...wrapper.children);
  }

  reset() {
    this.list.forEach(item => delete (item.checked));
    this.update();
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

  getFilterOptions() {
    return this.list.map(item => `<li class="filters__option filters__option_checkbox">
      <div data-element="option">
        <input type="checkbox" id="filter-${item.value}" ${item.checked ? "checked" : ""} value=${item.value}>
        <label for="filter-${item.value}">${item.title}</label>
      </div>
      <span class="filters__count"></span>
    </li>`).join('');
  }

  addEventListeners() {
    this.element.addEventListener('change', this.onChange);
  }

  removeEventListeners() {
    this.element.removeEventListener('change', this.onChange);
  }
}
