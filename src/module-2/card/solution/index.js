export default class Card {
  element;

  constructor({
    id = '',
    images = [],
    title = '',
    rating = 0,
    price = 0,
    category = '',
    brand = ''
  } = {}) {
    this.id = id;
    this.images = images;
    this.title = title;
    this.rating = rating;
    this.price = price;
    this.category = category;
    this.brand = brand;

    this.render();
  }

  getTemplate() {
    return `<div class="card__image">
        <img src="${this.images[0]}" alt="product image" />
      </div>
      <div class="card__body">
        <div>
          <span class="card__rate">${this.rating}
            <img src="images/star.svg" alt="star icon" />
          </span>
          <span class="card__price">$${this.price}</span>
        </div>
        <h4 class="card__title">${this.brand}</h4>
        <p class="card__text">${this.title}</p>
      </div>
      <div class="card__footer">
        <button class="card__button card__button_wishlist">
          <img src="images/heart.svg" alt="heart icon" />
          Wishlist
        </button>
        <button class="card__button card__button_cart">
          <img src="images/shopping-bag.svg" alt="cart icon" />
          Add to cart
        </button>
      </div>`
  }

  render() {
    const card = document.createElement('div');
    card.className = "catalog__item card";
    card.innerHTML = this.getTemplate();
    this.element = card.firstElementChild;
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
}
