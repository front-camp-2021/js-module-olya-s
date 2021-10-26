export default class FiltersList {
  element;
  subElements = {};

  onChange = event => {
    const customEventName = event.target.checked ? 'add-filter' : 'remove-filter';
    this.element.dispatchEvent(new CustomEvent(customEventName, {
      bubbles: true,
      detail: event.target.value
    }));
  }

  constructor({
    title = '',
    list = []
  } = {}) {
    this.title = title;
    this.list = list;

    this.render();
    this.getSubElements();
    this.update(this.title, this.list);
    this.addEventListeners();
  }

  get template() {
    return (
      `<fieldset>
        <legend class="filters__group" data-element="title">${this.title}</legend>
        <ul data-element="body"> 
        ${this.getFilterOptions(this.list)}
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

  update(title, list) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getFilterOptions(list);
    this.subElements.title.innerHTML = title;
    this.subElements.body.replaceChildren(...wrapper.children);
  }

  reset() {
    this.list.forEach(item => {
      item.checked = false;
    });
    this.update(this.title, this.list);
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

  getFilterOptions(list) {
    return list.map(item => {
      return `<li class="filters__option filters__option_checkbox">
      <div data-element="option">
        <input type="checkbox" id=${item.value} value=${item.value}>
        <label for=${item.value}>${item.title}</label>
      </div>
      <span class="filters__count"></span>
    </li>`}).join('');
  }

  addEventListeners() {
    this.element.addEventListener('change', this.onChange);
  }

  removeEventListeners() {
    this.element.removeEventListener('change', this.onChange);
  }
}
