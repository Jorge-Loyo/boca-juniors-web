// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Configuración y Carga de Productos desde la API
    // ----------------------------------------------------
    const productListDiv = document.getElementById('product-list');
    // Datos simulados de productos de Boca Juniors
    const bocaProducts = [
        {
            id: 'boca-camisetas-local-2025',
            name: 'Camiseta Local 2025',
            price: 75000.00,
            image: 'img/camiseta_local.png', // Tu imagen local
            description: 'La nueva camiseta oficial de Boca Juniors para la temporada 2025. ¡No te quedes sin ella y muestra tu pasión Xeneize!'
        },
        {
            id: 'boca-camiseta-alternativa',
            name: 'Camiseta Alternativa',
            price: 70000.00,
            image: 'img/camiseta_alternativa.png', // Tu imagen local
            description: 'Diseño exclusivo de la camiseta alternativa de Boca Juniors para los verdaderos hinchas que buscan un estilo único.'
        },
        {
            id: 'boca-gorra-oficial',
            name: 'Gorra Oficial CABJ',
            price: 15000.00,
            image: 'img/gorra.png', // Tu imagen local
            description: 'Gorra oficial del Club Atlético Boca Juniors. Ideal para protegerte del sol y llevar el escudo más grande con orgullo.'
        },
        {
            id: 'boca-vaso-termico',
            name: 'Vaso Térmico CABJ',
            price: 8500.00,
            image: 'img/Vaso_termico.png', 
            description: 'Mantén tus bebidas frías o calientes con este exclusivo vaso térmico con el escudo de Boca Juniors.'
        },
        {
            id: 'boca-bufanda',
            name: 'Bufanda La Bombonera',
            price: 12000.00,
            image: 'img/bufanda.png', 
            description: 'Clásica bufanda de Boca Juniors, perfecta para alentar en la cancha o mostrar tu apoyo en cualquier lugar.'
        },
        {
            id: 'boca-llavero',
            name: 'Llavero Escudo',
            price: 2500.00,
            image: 'img/llavero.png', 
            description: 'Pequeño pero significativo llavero con el escudo de Boca Juniors. Lleva tu pasión a todas partes.'
        }
    ];

    // Función para renderizar los productos (ahora desde los datos de Boca)
    function renderProducts() {
        productListDiv.innerHTML = ''; // Limpiar productos existentes

        if (bocaProducts.length === 0) {
            productListDiv.innerHTML = `
                <div class="col-12 text-center text-muted">
                    <p>No hay productos de Boca Juniors disponibles para mostrar en este momento.</p>
                </div>
            `;
            return;
        }

        bocaProducts.forEach(product => {
            const price = parseFloat(product.price).toFixed(2); // Asegura el formato de precio

            const productCard = `
                <div class="col">
                    <div class="card h-100 shadow-sm border border-warning">
                        <img src="${product.image}" class="card-img-top p-3 rounded" alt="Imagen de ${product.name}" style="object-fit: contain; height: 200px;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-primary">${product.name}</h5>
                            <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                            <p class="card-text fw-bold fs-4 text-warning mt-auto">$${price}</p>
                            <button class="btn btn-primary add-to-cart-btn"
                                data-product-id="${product.id}"
                                data-product-name="${product.name}"
                                data-product-price="${product.price}"
                                data-product-image="${product.image}"
                                aria-label="Añadir ${product.name} al carrito">
                                Añadir al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productListDiv.innerHTML += productCard;
        });

        // Añadir event listeners después de que los productos se hayan renderizado
        addAddToCartListeners();
    }

    function addAddToCartListeners() {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.productId;
                const productName = event.target.dataset.productName;
                const productPrice = parseFloat(event.target.dataset.productPrice);
                const productImage = event.target.dataset.productImage;
                addToCart({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                });
            });
        });
    }

    // Iniciar la carga de productos
    renderProducts();

    // ----------------------------------------------------
    // 2. Carrito de Compras Dinámico con localStorage
    // ----------------------------------------------------
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
        // Ocultar/mostrar el mensaje de carrito vacío
        if (emptyCartMessage) {
            if (totalItems === 0) {
                emptyCartMessage.style.display = 'block';
            } else {
                emptyCartMessage.style.display = 'none';
            }
        }
    }

    function addToCart(product) {
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart(); // Asegura que el modal del carrito se actualice si está abierto
        // Opcional: Mostrar una pequeña notificación al usuario (ej. toast de Bootstrap)
        alert(`${product.name} ha sido añadido al carrito.`);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }

    function updateCartItemQuantity(productId, newQuantity) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                renderCart();
            }
        }
    }

    function renderCart() {
        if (!cartItemsContainer || !cartTotalSpan) return; // Asegúrate de que los elementos existan

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const cartItemHtml = `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain; margin-right: 10px;">
                        <div class="flex-grow-1">
                            <h6 class="my-0">${item.name}</h6>
                            <small class="text-muted">$${item.price.toFixed(2)} c/u</small>
                        </div>
                        <div class="d-flex align-items-center">
                            <input type="number" class="form-control form-control-sm w-auto mx-2 text-center cart-quantity-input"
                                data-product-id="${item.id}" value="${item.quantity}" min="1" aria-label="Cantidad de ${item.name}">
                            <span class="text-primary fw-bold me-2">$${itemTotal.toFixed(2)}</span>
                            <button class="btn btn-sm btn-danger remove-from-cart-btn" data-product-id="${item.id}" aria-label="Eliminar ${item.name} del carrito">
                                <i class="bi bi-x-lg"></i> X
                            </button>
                        </div>
                    </li>
                `;
                cartItemsContainer.innerHTML += cartItemHtml;
            });

            // Añadir event listeners para los cambios de cantidad y eliminación
            cartItemsContainer.querySelectorAll('.cart-quantity-input').forEach(input => {
                input.addEventListener('change', (event) => {
                    const productId = event.target.dataset.productId;
                    const newQuantity = parseInt(event.target.value);
                    updateCartItemQuantity(productId, newQuantity);
                });
            });

            cartItemsContainer.querySelectorAll('.remove-from-cart-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const productId = event.target.dataset.productId;
                    removeFromCart(productId);
                });
            });
        }

        cartTotalSpan.textContent = total.toFixed(2);
    }

    // Inicializar el contador del carrito al cargar la página
    updateCartCount();

    // Event listener para abrir el modal del carrito
    const cartModalElement = document.getElementById('cartModal');
    if (cartModalElement) {
        cartModalElement.addEventListener('show.bs.modal', renderCart); // Renderiza el carrito cuando el modal se abre
    }

    // ----------------------------------------------------
    // 3. Validación de Formulario de Contacto (con Bootstrap Validation)
    // ----------------------------------------------------
    const contactForm = document.querySelector('#contacto form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            // Prevenir el envío por defecto si el formulario no es válido
            if (!contactForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // Si el formulario es válido, puedes añadir tu lógica de envío aquí (ej. Formspree)
                alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
            }
            // Añadir las clases de Bootstrap para mostrar validación visual
            contactForm.classList.add('was-validated');
        }, false);
    }

   
});