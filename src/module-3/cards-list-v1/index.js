import Card from '../../module-2/card/index.js';

export default class CardsList {
  constructor(data = []) {
    this.data = data;
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

  render() {
    const ul = document.createElement('ul');
    ul.className = 'catalog';
    this.data.forEach(item => {
      const li = document.createElement('li');
      li.append((new Card(item)).element);
      ul.append(li);
    });
    this.element = ul;
    return this.element;
  }
}