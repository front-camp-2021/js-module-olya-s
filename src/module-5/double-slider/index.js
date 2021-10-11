export default class DoubleSlider {
  element;
  subElements = {};

  pointerDown = (event) => {
    if (event.target.className.includes('thumb')) {
      this.element.classList.add('range-slider_dragging');
      this.slider = event.target;
      this.outLeftX = this.subElements.sliderInner.getBoundingClientRect().left;
      this.outRightX = this.subElements.sliderInner.getBoundingClientRect().right;
      this.thumbLeftX = this.subElements.thumbLeft.getBoundingClientRect().right;
      this.thumbRightX = this.subElements.thumbRight.getBoundingClientRect().left;

      if (event.target === this.subElements.thumbLeft) {
        this.shiftX = event.pageX - this.slider.getBoundingClientRect().right;
      } else {
        this.shiftX = event.pageX - this.slider.getBoundingClientRect().left;
      }
      this.slider.style.zIndex = 1000;
      document.addEventListener('pointermove', this.pointerMove);
    }
  };

  pointerMove = (event) => {
    const progress = this.subElements.progress;
    const values = {};
    if (this.slider === this.subElements.thumbLeft) {
      let posX = event.pageX - this.shiftX;
      if (posX < this.outLeftX) {
        posX = this.outLeftX;
      } else if (posX > this.thumbRightX) {
        posX = this.thumbRightX;
      }
      this.selected.from = this.min + this.getValueInPercent(posX - this.outLeftX) * (this.max - this.min) / 100;
    }
    if (this.slider === this.subElements.thumbRight) {
      let posX = event.pageX - this.shiftX;
      if (posX < this.thumbLeftX) {
        posX = this.thumbLeftX;
      } else if (posX > this.outRightX) {
        posX = this.outRightX;
      }
      this.selected.to = this.max - this.getValueInPercent(this.outRightX - posX) * (this.max - this.min) / 100;
    }
    this.update();
  }

  pointerUp = (event) => {
    this.element.classList.remove('range-slider_dragging');
    if (this.slider) {
      document.removeEventListener('pointermove', this.pointerMove);
      document.removeEventListener('pointerdown', this.pointerDown);
    }

    const left = parseInt(this.subElements.progress.style.left.match(/\d+/));
    const right = parseInt(this.subElements.progress.style.right.match(/\d+/));
    const range = this.max - this.min;
    const from = this.min + left * range / 100;
    const to = this.max - right * range / 100;

    this.element.dispatchEvent(new CustomEvent('range-selected',
      {
        bubbles: true,
        detail: {
          filterName: this.filterName,
          value: { from, to }
        }
      })
    );
  };

  onDragStart = () => {
    return false;
  };

  constructor({
    min = 100,
    max = 200,
    formatValue = value => value,
    selected = {
      from: min,
      to: max
    },
    precision = 0,
    filterName = ''
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;
    this.precision = precision;
    this.filterName = filterName;

    this.render();
    this.getSubElements();
    this.addEventListeners();
  }

  get template() {
    const left = (this.selected.from - this.min) * 100 / (this.max - this.min);
    const right = (this.max - this.selected.to) * 100 / (this.max - this.min);
    return `<div class="range-slider" data-element="rangeSlider">
        <span data-element="from">${this.formatValue(this.selected.from)}</span>
        <div class="range-slider__inner" data-element="sliderInner">
          <span data-element="progress" class="range-slider__progress"
            style="left: ${left}%; right: ${right}%"></span>
          <span data-element="thumbLeft" class="range-slider__thumb-left"
            style="left: ${left}%"></span>
          <span data-element="thumbRight" class="range-slider__thumb-right"
            style="right: ${right}%"></span>
        </div>
        <span data-element="to">${this.formatValue(this.selected.to)}</span>
      </div >`
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    return this.element;
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
    const from = this.selected.from;
    const to = this.selected.to;
    const posFrom = from - this.min;
    const posTo = this.max - to;
    this.subElements.thumbLeft.style.left = `${posFrom}%`;
    this.subElements.progress.style.left = `${posFrom}%`;
    this.subElements.from.innerText = this.formatValue(from);
    this.subElements.thumbRight.style.right = `${posTo}%`;
    this.subElements.progress.style.right = `${posTo}%`;
    this.subElements.to.innerText = this.formatValue(to);
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

  getValueInPercent(value) {
    const sliderWidth = this.subElements.sliderInner.getBoundingClientRect().width;
    return Math.floor(value * 100 / sliderWidth);
  }

  addEventListeners() {
    this.element.addEventListener('pointerdown', this.pointerDown);
    document.addEventListener('pointerup', this.pointerUp);
    document.addEventListener('ondragstart', this.onDragStart);
  }

  removeEventListeners() {
    this.element.removeEventListener('pointerdown', this.pointerDown);
    document.removeEventListener('pointerup', this.pointerUp);
    document.removeEventListener('ondragstart', this.onDragStart);
  }
}