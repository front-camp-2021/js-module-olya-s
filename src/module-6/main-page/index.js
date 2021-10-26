import Pagination from '../../module-5/pagination/index.js';
import SideBar from '../../module-4/side-bar/index.js';
import CardsList from '../../module-3/cards-list-v1/index.js';
import Search from '../search/index.js';
import { request } from './request/index.js';
import { prepareFilters } from './prepare-filters/index.js';
import Card from '../../module-2/card/index.js';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5500';

export default class Page {
  element;
  subElements = {};
  components = {};
  filters = new URLSearchParams();

  constructor({
    products = [],
    totalPages = 100,
    pageLimit = 10
  } = {}) {
    this.products = products;
    this.filteredProducts = [];
    this.totalPages = totalPages;
    this.pageLimit = pageLimit;
    this.filters.set('_page', '1');
    this.filters.set('_limit', this.pageLimit);

    this.render();
    this.getSubElements();
    this.initializeComponents();
    this.addEventListeners();
    this.updateComponents();
  }

  get template() {
    return `<div>
        <header class="header">
          <nav>
            <a href="index.html" class="header__logo-link">
              <img class="header__image" src="../../images/logo.svg" alt="shop logo">
              <h1 class="header__title">Online Store</h1>
            </a>
          </nav>
        </header>

        <main class="main-container" data-element="main">
          <ul class="breadcrumbs" id="bread">
            <li class="breadcrumbs__item"><a href="index.html"><img src="../../images/home.svg" alt="Home"></a></li>
            <li class="breadcrumbs__item"><a href="#">eCommerce</a></li>
            <li class="breadcrumbs__item breadcrumbs__item_current">Electronics</li>
          </ul>

          <!-- SideBar -->

          <section data-element="section">
            <h2 class="visually-hidden">Products catalog</h2>

            <!-- Search -->
            <!-- CardList -->

          </section>
          
          <!-- Pagination -->

        </main>
      </div>`
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
    this.subElements = {};
    for (let component of Object.values(this.components)) {
      component.destroy();
    }
    this.components = {};
  }

  initializeComponents() {
    const sidebar = new SideBar();
    const search = new Search();
    const cardslist = new CardsList({ data: [], Component: Card });
    const pagination = new Pagination();
    this.components = {
      sidebar,
      search,
      cardslist,
      pagination
    }
  }

  updateComponents() {
    this.getData().then(res => {
      const { productData, categoryFilter, brandFilter } = res;
      const { sidebar, search, cardslist, pagination } = this.components;
      this.products = productData;
      this.totalPages = Math.ceil(productData.length / this.pageLimit);
      sidebar.update(categoryFilter, brandFilter);
      this.updateCardsList(productData);
      pagination.update({ currentPage: 1, totalPages: this.totalPages });
      this.subElements.main.insertBefore(sidebar.element, this.subElements.section);
      this.subElements.section.appendChild(search.element);
      this.subElements.section.appendChild(cardslist.element);
      this.subElements.main.appendChild(pagination.element);
      this.components = { sidebar, search, cardslist, pagination };
    })
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');
    for (let subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    this.subElements = result;
  }

  async getData() {
    const productData = (await request(new URL('products', BACKEND_URL)))[0];
    const categoryData = (await request(new URL('categories', BACKEND_URL)))[0];
    const brandData = (await request(new URL('brands', BACKEND_URL)))[0];
    const categoryFilter = prepareFilters(categoryData, 'category');
    const brandFilter = prepareFilters(brandData, 'brand');

    return {
      productData, categoryFilter, brandFilter
    }
  }

  addEventListeners() {
    this.element.addEventListener('search-filter', event => {
      const search = event.detail.search;
      let products = this.filteredProducts.length ? this.filteredProducts : this.products;
      products = this.products.filter(prod => prod.title.includes(search));
      this.filteredProducts.push(...products);
      this.updateCardsList(this.filteredProducts);
      this.updatePagination(this.filteredProducts);
    });
    this.components.sidebar.element.addEventListener('add-filter', event => {
      const param = event.detail.split('=')[0];
      const title = event.detail.split('=')[1];
      const products = this.products.filter(prod => prod[param] === title);
      this.filteredProducts.push(...products);
      this.updateCardsList(this.filteredProducts);
      this.updatePagination(this.filteredProducts);
    });
    this.components.sidebar.element.addEventListener('remove-filter', event => {
      const param = event.detail.split('=')[0];
      const title = event.detail.split('=')[1];
      this.filteredProducts = this.filteredProducts.filter(prod => prod[param] !== title);
      const products = this.filteredProducts.length ? this.filteredProducts : this.products;
      this.updateCardsList(products);
      this.updatePagination(products);
    });
    this.components.sidebar.element.addEventListener('clear-filters', event => {
      this.filters.set('_page', '1');
      this.filteredProducts = {};
      this.updateComponents();
      this.filters = new URLSearchParams();
      this.filters.set("_page", "1");
      this.filters.set("_limit", this.pageLimit);
      this.components.search.clear();
    });
    this.components.pagination.element.addEventListener('page-changed', event => {
      this.filters.set('_page', event.detail.page);
      const products = this.filteredProducts.length ? this.filteredProducts : this.products;
      this.updateCardsList(products);
    });
  }

  updateCardsList(productData) {
    const start = parseInt(this.filters.get('_page')) - 1;
    this.components.cardslist.update(productData.slice(start, start + this.pageLimit));
  }

  updatePagination(products) {
    this.totalPages = Math.ceil(products.length / this.pageLimit);
    this.components.pagination.update({ currentPage: 1, totalPages: this.totalPages });
  }
}
