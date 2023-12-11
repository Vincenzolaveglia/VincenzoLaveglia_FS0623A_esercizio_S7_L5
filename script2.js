function openProductForm() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('backOffice').style.display = 'block';  
}

function showHomePage() {
    document.getElementById('backOffice').style.display = 'none';
    document.getElementById('home').style.display = 'block';
}

const apiUrl = 'https://striveschool-api.herokuapp.com/api/product/';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc0NzA0MjJjNmEwZDAwMTg0OTVlOWYiLCJpYXQiOjE3MDIxMzA4MTksImV4cCI6MTcwMzM0MDQxOX0.xQNx3L4ztpESnled9tUjAJKtntyQdySeMDXnPXC2ZQw';

function submitForm() {
    const nameElement = document.getElementById('name');
    const descriptionElement = document.getElementById('description');
    const brandElement = document.getElementById('brand');
    const imageUrlElement = document.getElementById('imageUrl');
    const priceElement = document.getElementById('price');
    const productIdElement = document.getElementById('_id');

    // Ottieni i valori dai campi del form
    const name = nameElement.value.trim();
    const description = descriptionElement.value.trim();
    const brand = brandElement.value.trim();
    const imageUrl = imageUrlElement.value.trim();
    const price = priceElement.value.trim();
    const productId = productIdElement ? productIdElement.value.trim() : null;

    console.log('Submitting form with values:', { name, description, brand, imageUrl, price, productId });

    const product = {
        name,
        description,
        brand,
        imageUrl,
        price
    };

    const method = productId ? 'PUT' : 'POST';
    const url = productId ? `${apiUrl}${productId}` : apiUrl;

    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(product)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Errore HTTP! Stato: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Prodotto creato/modificato:', data);
            resetForm();
            
        })
        .catch(error => {
            console.error('Errore durante la richiesta API:', error.message);
        });
}

function populateForm(product) {
    document.getElementById('editName').value = product.name;
    document.getElementById('editDescription').value = product.description;
    document.getElementById('editBrand').value = product.brand;
    document.getElementById('editImageUrl').value = product.imageUrl;
    document.getElementById('editPrice').value = product.price;
}

function loadProducts() {
    const productListContainer = document.getElementById('productList');
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Errore HTTP! Stato: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            productListContainer.innerHTML = '';
            products.forEach(product => {
                const card = createProductCard(product);
                productListContainer.appendChild(card);
            });

            console.log('Prodotti:', products);
        })
        .catch(error => {
            console.error('Errore durante la richiesta API:', error.message);
        });
}

function resetForm() {
    document.getElementById('productForm').reset();
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
        <div class="card mb-4 shadow-sm h-100">
            <img src="${product.imageUrl}" class="bd-placeholder-img card-img-top" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <p class="card-text">${product.price}€</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="showMorePage('${product._id}')">Scopri di più</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="showEditPage('${product._id}')">Modifica</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    return card;
}

function editProduct(productId) {
    fetch(`${apiUrl}${productId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Errore HTTP! Stato: ${response.status}`);
        }
        return response.json();
    })
    .then(product => {
        // Popola il form con i dettagli del prodotto
        populateForm(product);
        showEditPage(productId); // Show the edit page after populating the form
    })
    .catch(error => {
        console.error('Errore durante la richiesta API:', error.message);
    });
}

function showEditPage(productId) {
    document.getElementById('home').style.display = 'none';
    document.getElementById('backOffice').style.display = 'none';
    document.getElementById('paginaModifica').style.display = 'block';
    document.getElementById('showMorePage').style.display= 'none';
    editProduct(productId);
}

window.onload = function () {
    loadProducts();
};

