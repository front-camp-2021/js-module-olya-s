export default class FiltersList {
  element;
  subElements = {};

  constructor({
    title = '',
    list = []
  } = {}) {
    this.title = title;
    this.list = list;

    this.render();
    this.getSubElements();
    this.update();
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
      <div>
        <input type="checkbox" id="filter-${item.value}" ${item.checked ? "checked" : ""}>
        <label for="filter-${item.value}">${item.title}</label>
      </div>
      <span class="filters__count"></span>
    </li>`).join('');
  }
}
