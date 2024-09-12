console.log('customer-script.js is running');

// Дані про клієнтів
window.customers = Array.from({ length: 300 }, (_, i) => ({
    name: `Customer ${i + 1}`,
    company: ['Microsoft', 'Google', 'Facebook', 'Yahoo', 'Tesla'][Math.floor(Math.random() * 5)],
    phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 10000)}`,
    email: `customer${i + 1}@example.com`,
    country: ['United States', 'Brazil', 'India', 'Australia', 'Japan'][Math.floor(Math.random() * 5)],
    status: Math.random() > 0.5 ? 'Active' : 'Inactive'
}));

// Глобальні змінні
window.filteredCustomers = [...customers];
window.currentPage = 1; 
window.rowsPerPage = 8; 


function updateCustomersInfo() {
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, filteredCustomers.length);
    const totalEntries = filteredCustomers.length;

    const customersInfo = document.querySelector('.customers__info');
    if (customersInfo) {
        customersInfo.textContent = `Showing data ${start} to ${end} of ${totalEntries} entries`;
    } else {
        console.error('.customers__info not found!');
    }
}

// Відображення клієнтів на поточній сторінці
export function displayCustomers(page) {
    console.log('Displaying customers for page:', page);
    const tbody = document.querySelector('.customers__tbody');
    if (!tbody) {
        console.error('.customers__tbody not found!');
        return;
    }

    tbody.innerHTML = ''; 

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const customersToShow = filteredCustomers.slice(start, end);

    if (customersToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No customers found</td></tr>';
        return;
    }

    customersToShow.forEach(customer => {
        const row = `
            <tr class="customers__tbody-row">
                <td class="customers__tbody-cell">${customer.name}</td>
                <td class="customers__tbody-cell">${customer.company}</td>
                <td class="customers__tbody-cell">${customer.phone}</td>
                <td class="customers__tbody-cell">${customer.email}</td>
                <td class="customers__tbody-cell">${customer.country}</td>
                <td class="customers__tbody-cell"><div class="customers__status customers__status--${customer.status.toLowerCase()}">${customer.status}</div></td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });

    const elements = document.querySelectorAll('.customers__tbody-row');
    elements.forEach((el, index) => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = 1;
            el.style.transform = 'translateY(0)';
        }, index * 150);
    });
    updateCustomersInfo();
}

// Оновлення пагінації
export function updatePagination() {
    const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
    const paginationPages = document.querySelector('.pagination__pages');
    if (!paginationPages) {
        console.error('.pagination__pages not found!');
        return;
    }

    paginationPages.innerHTML = ''; 


    document.querySelector('.pagination__prev').disabled = currentPage === 1;

  
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);


    if (currentPage > 3) {
        paginationPages.insertAdjacentHTML('beforeend', `<button class="pagination__page" data-page="1">1</button>`);
        if (currentPage > 4) {
            paginationPages.insertAdjacentHTML('beforeend', `<button class="pagination__dots">...</button>`);
        }
    }


    for (let i = startPage; i <= endPage; i++) {
        paginationPages.insertAdjacentHTML('beforeend', `
            <button class="pagination__page ${i === currentPage ? 'pagination__page--active' : ''}" data-page="${i}">
                ${i}
            </button>
        `);
    }


    if (endPage < totalPages - 1) {
        paginationPages.insertAdjacentHTML('beforeend', `<button class="pagination__dots">...</button>`);
    }
    if (endPage < totalPages) {
        paginationPages.insertAdjacentHTML('beforeend', `<button class="pagination__page" data-page="${totalPages}">${totalPages}</button>`);
    }


    document.querySelector('.pagination__next').disabled = currentPage === totalPages;


    document.querySelectorAll('.pagination__page').forEach(pageButton => {
        pageButton.addEventListener('click', (e) => {
            const page = Number(e.target.getAttribute('data-page'));
            currentPage = page;
            displayCustomers(currentPage);
            updatePagination();
        });
    });
}

export function searchCustomers(query) {
    console.log('Search query:', query);
    query = query.toLowerCase();
    filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(query)
    );
    currentPage = 1;
    displayCustomers(currentPage);
    updatePagination();
    updateCustomersInfo();
}


// document.getElementById('burger-menu').addEventListener('click', function () {
//     const sidebar = document.getElementById('sidebar');
//     sidebar.classList.toggle('dashboard__sidebar--visible');
// });

// document.querySelectorAll('.nav__link').forEach(item => {
//     item.addEventListener('click', function () {
//         const sidebar = document.getElementById('sidebar');
//         if (sidebar.classList.contains('dashboard__sidebar--visible')) {
//             sidebar.classList.remove('dashboard__sidebar--visible');
//         }
//     });
// });