// import Card from '../../module-2/card/index.js';

export default class CardsList {
  constructor({ data = [], Component = {} }) {
    this.data = data;
    this.Component = Component;
    this.element;

    this.render();
  }

  remove() {
    if (this.element) {
      this.element.remove()
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }

  update(cardsList) {
    if (!this.element) return;
  }

  render() {
    const ul = document.createElement('ul');
    ul.className = 'catalog';
    if (!this.data.length) return;
    this.createCardsList(ul, thiis.data);
    this.element = ul;
    return this.element;
  }

  createCardsList(container, list) {
    if (!list.length) return;
    list.forEach(item => {
      const li = document.createElement('li');
      li.append((new this.Component(item)));
      container.append(li);
    });
  }
}