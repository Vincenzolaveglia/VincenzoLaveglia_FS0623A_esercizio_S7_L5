const apiUrl = 'https://striveschool-api.herokuapp.com/api/product/';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc0NzA0MjJjNmEwZDAwMTg0OTVlOWYiLCJpYXQiOjE3MDIxMzA4MTksImV4cCI6MTcwMzM0MDQxOX0.xQNx3L4ztpESnled9tUjAJKtntyQdySeMDXnPXC2ZQw';

function submitForm() {
  const nameElement = document.getElementById('name');
  const descriptionElement = document.getElementById('description');
  const brandElement = document.getElementById('brand');
  const imageUrlElement = document.getElementById('imageUrl');
  const priceElement = document.getElementById('price');

  // Verifica che tutti gli elementi siano presenti prima di accedere ai loro valori
  if (!nameElement || !descriptionElement || !brandElement || !imageUrlElement || !priceElement) {
    console.error('One or more form elements not found.');
    return;
  }

  // Utilizza il valore o una stringa vuota come fallback per evitare errori su valori nulli
  const name = nameElement.value.trim();
  const description = descriptionElement.value.trim();
  const brand = brandElement.value.trim();
  const imageUrl = imageUrlElement.value.trim();
  const price = priceElement.value.trim();


  console.log('Submitting form with values:', { name, description, brand, imageUrl, price, productId });

  const product = {
    name,
    description,
    brand,
    imageUrl,
    price
    // Aggiungi altri campi opzionali secondo le tue esigenze
  };

  // Check se si tratta di una creazione o modifica del prodotto
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
      loadProducts();
    })
    .catch(error => {
      console.error('Errore durante la richiesta API:', error.message);
    });
}


function editProduct() {
  const productId = document.getElementById('_id').value;
  if (productId) {
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
        populateForm(product);
      })
      .catch(error => {
        console.error('Errore durante la richiesta API:', error.message);
      });
  }
}

function deleteProduct() {
  const productId = document.getElementById('_id').value;
  if (productId) {
    fetch(`${apiUrl}${productId}`, {
      method: 'DELETE',
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
      .then(data => {
        console.log('Prodotto cancellato:', data);
        resetForm();
        loadProducts();
      })
      .catch(error => {
        console.error('Errore durante la richiesta API:', error.message);
      });
  }
}

function resetForm() {
  document.getElementById('name').value = '';
  document.getElementById('description').value = '';
  document.getElementById('brand').value = '';
  document.getElementById('imageUrl').value = '';
  document.getElementById('price').value = '';
  document.getElementById('_id').value = '';
}

function populateForm(product) {
  document.getElementById('name').value = product.name;
  document.getElementById('description').value = product.description;
  document.getElementById('brand').value = product.brand;
  document.getElementById('imageUrl').value = product.imageUrl;
  document.getElementById('price').value = product.price;
  document.getElementById('_id').value = product._id;
}

function showProductDetails(productId) {
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
      console.log('Dettagli prodotto:', product);
    })
    .catch(error => {
      console.error('Errore durante la richiesta API:', error.message);
    });
}

function loadProducts() {
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
      console.log('Prodotti:', products);
    })
    .catch(error => {
      console.error('Errore durante la richiesta API:', error.message);
    });
}

window.onload = function () {
  loadProducts();
};

document.getElementById('submitButton').addEventListener('click', submitForm);
document.getElementById('editButton').addEventListener('click', editProduct);
document.getElementById('deleteButton').addEventListener('click', deleteProduct);

