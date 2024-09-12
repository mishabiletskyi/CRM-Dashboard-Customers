import { displayCustomers, updatePagination, searchCustomers } from './mok-pages/customers/customer-script.js';

document.addEventListener('DOMContentLoaded', function () {
    loadPage('mok-pages/customers/customers.html');

    function loadPage(page) {
        fetch(page)
            .then(response => response.text())
            .then(data => {
                document.getElementById('content').innerHTML = data;

                if (page.includes('customers.html')) {
                    console.log('Loading customer data...');
                    displayCustomers(1);
                    updatePagination();

                    const searchInput = document.querySelector('.customers__search');
                    if (searchInput) {
                        searchInput.addEventListener('input', (e) => {
                            searchCustomers(e.target.value);
                        });
                    } else {
                        console.error('Search input not found');
                    }
                }
            })
            .catch(error => console.error('Error loading page:', error));
    }

    document.querySelectorAll('.nav__item').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();

            const activeItem = document.querySelector('.nav__item--active');
            if (activeItem) {
                activeItem.classList.remove('nav__item--active');
            }
            this.classList.add('nav__item--active');

            const page = this.querySelector('.nav__link').getAttribute('href').replace('#', '');
            loadPage(`mok-pages/${page}/${page}.html`);
        });
    });
});
