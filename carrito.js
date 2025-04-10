// carrito.js
class CarritoManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    addToCartHandler(e) {
        const menuItem = e.target.closest('.menu-item');
        const product = {
            id: this.createID(menuItem.querySelector('h3').textContent),
            name: menuItem.querySelector('h3').textContent.split(' (')[0],
            price: this.parsePrice(menuItem.querySelector('.item-price')),
            details: Array.from(menuItem.querySelectorAll('li')).map(li => li.textContent)
        };
        
        this.addToCart(product);
        this.updateCartDisplay();
    }

    init() {
        this.updateCartDisplay();
        this.setupEventListeners();
        this.setupNavigation();
    }

    parsePrice(priceElement) {
        const priceText = priceElement.textContent;
        return parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }

    formatPrice(amount) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(amount);
    }

    createID(text) {
        return text.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    setupEventListeners() {
        // Eventos para agregar productos (si existen en la página)
        if (document.querySelectorAll('.add-to-cart').length > 0) {
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => this.addToCartHandler(e));
            });
        }

        // Evento para finalizar compra
        const finishButton = document.querySelector('.cart-popup button');
        if (finishButton) {
            finishButton.addEventListener('click', () => this.finishPurchase());
        }
    }

    setupNavigation() {
        // Smooth scroll para anclas
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    addToCartHandler(e) {
        const menuItem = e.target.closest('.menu-item');
        const product = {
            id: menuItem.querySelector('h3').textContent.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            name: menuItem.querySelector('h3').textContent.split(' (')[0],
            price: parseFloat(menuItem.querySelector('.item-price').textContent.replace(/,/g, '').replace('$', '')),
            details: Array.from(menuItem.querySelectorAll('li')).map(li => li.textContent)
        };
        
        this.addToCart(product);
        this.updateCartDisplay();
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        existingItem ? existingItem.quantity++ : this.cart.push({...product, quantity: 1});
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        const cartItemsList = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total strong');

        if (cartCount) cartCount.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartItemsList && cartTotal) {
            cartItemsList.innerHTML = this.cart.map(item => `
                <li class="cart-item">
                    <div>
                        <strong>${item.name}</strong>
                        <small>${item.details[0]}</small>
                    </div>
                    <div>
                        <span>${item.quantity}x $${item.price.toLocaleString('es-MX')}</span>
                        <button class="remove-item" data-id="${item.id}">×</button>
                    </div>
                </li>
            `).join('');

            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `Total: $${total.toLocaleString('es-MX')}`;

            // Eventos para eliminar items
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    this.cart = this.cart.filter(item => item.id !== e.target.dataset.id);
                    localStorage.setItem('cart', JSON.stringify(this.cart));
                    this.updateCartDisplay();
                });
            });
        }
    }

   
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('finalizar-pedido.html')) {
        window.carrito = new CarritoManager();
    }
});