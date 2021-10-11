export default class Pagination {
  element;
  subElements = {};
  start = 1;

  onClick = event => {
    if (event.target.classList.contains('pagination__link')) {
      if (event.target.parentElement.dataset.element === 'prevPage') {
        this.goToPrevPage();
      } else if (event.target.parentElement.dataset.element === 'nextPage') {
        this.goToNextPage();
      }
      if (event.target.className === 'pagination__link') {
        this.update(+event.target.dataset.index);
      }
    }
  }

  constructor({
    totalPages = 10,
    page = 1,
    currentPage = page,
    viewPages = 9
  } = {}) {
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.viewPages = viewPages;

    this.render();
    this.addEventListeners();
    this.getSubElements();
  }

  goToPrevPage() {
    this.update(this.currentPage - 1);
  }

  goToNextPage() {
    this.update(this.currentPage + 1);
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

  get template() {
    return `<div class="pagination">
        <span class="pagination__item" data-element="prevPage">
          ${this.currentPage === 1 ? `&lt;` :
        `<a class="pagination__link pagination__link_arrow" href="#">&lt;</a>`}
        </span>
        <ul class="pagination__list" data-element="pagesList">
        ${this.getPages()}
        </ul>
        <span class="pagination__item" data-element="nextPage">
          ${this.currentPage === this.totalPages ? `&gt;` :
        `<a class="pagination__link pagination__link_arrow" href="#">&gt;</a>`}
        </span>
      </div>`
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    return this.element;
  }

  update(number) {
    this.currentPage = number;
    if (this.currentPage === 1) {
      this.subElements.prevPage.innerHTML = '&lt;';
    } else {
      this.subElements.prevPage.innerHTML = `<a class="pagination__link pagination__link_arrow" href="#">&lt;</a>`
    }
    if (this.currentPage === this.totalPages) {
      this.subElements.nextPage.innerHTML = '&gt;';
    } else {
      this.subElements.nextPage.innerHTML = `<a class="pagination__link pagination__link_arrow" href="#">&gt;</a>`
    }
    this.subElements.pagesList.innerHTML = this.getPages();

    this.element.dispatchEvent(new CustomEvent('page-changed', {
      detail: {
        page: number
      }
    }));
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    const result = {};
    for (let subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    this.subElements = result;
  }

  getPages() {
    const pages = [];
    if (this.currentPage < this.start + 5) {
      for (let i = this.start; i < this.viewPages - 1; i++) {
        if (this.currentPage === i) {
          pages[i] = `<li class="pagination__item pagination__item_current" 
            data-element="current" data-index=${i}>${i}</li>`;
        } else {
          pages[i] = `<li class="pagination__item">
            <a class="pagination__link" href="#" data-index=${i}>${i}</a>
            </li>`;
        }
      }
      pages[this.start + 7] = `<li class="pagination__item">
        <a class="pagination__link" href="#" data-index=${this.start + 7}>...</a>
        </li>`;
      pages[this.viewPages] = `<li class="pagination__item">
        <a class="pagination__link" href="#" data-index=${this.totalPages}>${this.totalPages}</a>
        </li>`;
    } else if (this.currentPage > this.totalPages - 5) {
      for (let i = this.totalPages; i > this.totalPages - this.viewPages + 1; i--) {
        if (this.currentPage === i) {
          pages[i] = `<li class="pagination__item pagination__item_current" 
            data-element="current" data-index=${i}>${i}</li>`;
        } else {
          pages[i] = `<li class="pagination__item">
            <a class="pagination__link" href="#" data-index=${i}>${i}</a></li>`;
        }
      }
      pages[this.totalPages - this.viewPages + 2] = `<li class="pagination__item">
        <a class="pagination__link" href="#" data-index=${this.totalPages - this.viewPages + 2}>...</a>
        </li>`;
      pages[this.start] = `<li class="pagination__item">
        <a class="pagination__link" href="#" data-index=${this.start}>${this.start}</a></li>`;
    } else {
      pages[this.start] = `<li class="pagination__item">
        <a class="pagination__link" href="#" data-index=${this.start}>${this.start}</a></li>`;
      pages[this.currentPage - 3] = `<li class="pagination__item">
        <a class="pagination__link" href="#" data-index=${this.currentPage - 3}>...</a></li>`;
      for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
        if (this.currentPage === i) {
          pages[i] = `<li class="pagination__item pagination__item_current" 
            data-element="current" data-index=${i}>${i}</li>`;
        } else {
          pages[i] = `<li class="pagination__item">
            <a class="pagination__link" href="#" data-index=${i}>${i}</a></li>`;
        }
      }
      pages[this.totalPages] = `<li class="pagination__item">
      <a class="pagination__link" href="#" data-index=${this.totalPages}>${this.totalPages}</a></li>`;
      pages[this.currentPage + 3] = `<li class="pagination__item">
        <a class="pagination__link" href="#" data-index=${this.currentPage + 3}>...</a></li>`;
    }
    return pages.join('');
  }

  addEventListeners() {
    this.element.addEventListener('click', this.onClick);
  }

  removeEventListeners() {
    this.element.removeEventListener('click', this.onClick);
  }
}
