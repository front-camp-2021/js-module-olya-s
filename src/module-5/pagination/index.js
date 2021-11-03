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
        this.currentPage = +event.target.dataset.index;
        this.update({ currentPage: this.currentPage, totalPages: this.totalPages });
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
    this.currentPage--;
    this.update({ currentPage: this.currentPage, totalPages: this.totalPages });
  }

  goToNextPage() {
    this.currentPage++;
    this.update({ currentPage: this.currentPage, totalPages: this.totalPages });
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
        ${this.getPages({ currentPage: this.currentPage, totalPages: this.totalPages })}
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
  }

  update(data) {
    const { currentPage, totalPages } = data;
    this.totalPages = totalPages;
    if (currentPage === 1) {
      this.subElements.prevPage.innerHTML = '&lt;';
    } else {
      this.subElements.prevPage.innerHTML = `<a class="pagination__link pagination__link_arrow" href="#">&lt;</a>`
    }
    if (currentPage === totalPages) {
      this.subElements.nextPage.innerHTML = '&gt;';
    } else {
      this.subElements.nextPage.innerHTML = `<a class="pagination__link pagination__link_arrow" href="#">&gt;</a>`
    }
    this.subElements.pagesList.innerHTML = this.getPages({ currentPage, totalPages });

    this.element.dispatchEvent(new CustomEvent('page-changed', {
      detail: {
        page: currentPage
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

  getPages({ currentPage, totalPages }) {
    const pages = [];
    if (totalPages < this.viewPages) {
      for (let i = this.start; i <= totalPages; i++) {
        if (currentPage === i) {
          pages[i] = `<li class="pagination__item pagination__item_current" 
            data-element="current" data-index=${i}>${i}</li>`;
        } else {
          pages[i] = `<li class="pagination__item">
            <a class="pagination__link" href="#" data-index=${i}>${i}</a>
            </li>`;
        }
      }
      return pages.join('');
    }
    if (currentPage < this.start + 5) {
      for (let i = this.start; i < this.viewPages - 1; i++) {
        if (currentPage === i) {
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
        <a class="pagination__link" href="#" data-index=${totalPages}>${totalPages}</a>
        </li>`;
    } else if (currentPage > totalPages - 5) {
      for (let i = totalPages; i > totalPages - this.viewPages + 1; i--) {
        if (currentPage === i) {
          pages[i] = `<li class="pagination__item pagination__item_current" 
            data-element="current" data-index=${i}>${i}</li>`;
        } else {
          pages[i] = `<li class="pagination__item">
            <a class="pagination__link" href="#" data-index=${i}>${i}</a></li>`;
        }
      }
      pages[totalPages - this.viewPages + 2] = `<li class="pagination__item">
        <a class="pagination__link" href="#" data-index=${totalPages - this.viewPages + 2}>...</a>
        </li>`;
      pages[this.start] = `<li class="pagination__item">
        <a class="pagination__link" href="#" data-index=${this.start}>${this.start}</a></li>`;
    } else {
      pages[this.start] = `<li class="pagination__item">
        <a class="pagination__link" href="#" data-index=${this.start}>${this.start}</a></li>`;
      pages[currentPage - 3] = `<li class="pagination__item">
        <a class="pagination__link" href="#" data-index=${currentPage - 3}>...</a></li>`;
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        if (currentPage === i) {
          pages[i] = `<li class="pagination__item pagination__item_current" 
            data-element="current" data-index=${i}>${i}</li>`;
        } else {
          pages[i] = `<li class="pagination__item">
            <a class="pagination__link" href="#" data-index=${i}>${i}</a></li>`;
        }
      }
      pages[totalPages] = `<li class="pagination__item">
      <a class="pagination__link" href="#" data-index=${totalPages}>${totalPages}</a></li>`;
      pages[currentPage + 3] = `<li class="pagination__item">
        <a class="pagination__link" href="#" data-index=${currentPage + 3}>...</a></li>`;
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
