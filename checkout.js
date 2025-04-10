// checkout.js
class CheckoutManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.loadCart();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Selección de método de pago
        document.querySelectorAll('.payment-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectPayment(e.currentTarget));
        });

        // Confirmación de pedido
        document.querySelector('.confirm-button').addEventListener('click', (e) => this.confirmOrder(e));
    }

    loadCart() {
        const container = document.getElementById('cart-items-container');
        let total = 0;
        
        container.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <small>${item.details[0]}</small>
                </div>
                <div style="text-align: center;">
                    <span>${item.quantity}x</span>
                </div>
                <div style="text-align: right;">
                    ${this.formatPrice(item.price * item.quantity)}
                </div>
            </div>
        `).join('');
        
        total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('total-amount').textContent = this.formatPrice(total);
    }

    selectPayment(element) {
        document.querySelectorAll('.payment-card').forEach(card => {
            card.classList.remove('selected');
        });
        element.classList.add('selected');
    }

    formatPrice(amount) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(amount);
    }

    confirmOrder(e) {
        e.preventDefault();
        const form = document.getElementById('delivery-form');
        const paymentSelected = document.querySelector('.payment-card.selected');
        
        if (!form.checkValidity()) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }
        
        if (!paymentSelected) {
            alert('Por favor selecciona un método de pago');
            return;
        }
        if (document.querySelector('.payment-card.selected h4').textContent.includes('Tarjeta')) {
            if (!this.validateCardDetails()) {
                alert('Por favor verifica los datos de la tarjeta');
                return;
            }
        }

        document.getElementById('success-message').style.display = 'block';
        localStorage.removeItem('cart');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }

    selectPayment(element) {
        document.querySelectorAll('.payment-card').forEach(card => {
            card.classList.remove('selected');
        });
        element.classList.add('selected');
        
        const cardDetails = document.getElementById('card-details');
        const isCreditCard = element.querySelector('h4').textContent.includes('Tarjeta');
        
        // Mostrar/ocultar campos de tarjeta
        if (isCreditCard) {
            cardDetails.classList.add('visible');
            this.enableCardValidation(true);
        } else {
            cardDetails.classList.remove('visible');
            this.enableCardValidation(false);
        }
    }

    enableCardValidation(required) {
        const fields = document.querySelectorAll('#card-details input');
        fields.forEach(field => {
            field.required = required;
            field.disabled = !required;
            if (!required) field.value = '';
        });
    }

    validateCardDetails() {
        const number = document.getElementById('card-number').value.replace(/\s/g, '');
        const expiry = document.getElementById('card-expiry').value.split('/');
        const cvc = document.getElementById('card-cvc').value;

        // Validar número de tarjeta con algoritmo de Luhn
       // if (!this.luhnCheck(number)) return false;
        
        // Validar fecha
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        const [month, year] = expiry.map(n => parseInt(n));
        
        if (month < 1 || month > 12) return false;
        if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
        
        // Validar CVC
        return /^\d{3,4}$/.test(cvc);
    }

    luhnCheck(cardNumber) {
        let sum = 0;
        let alternate = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i), 10);
            
            if (alternate) {
                digit *= 2;
                if (digit > 9) digit = (digit % 10) + 1;
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        return (sum % 10) === 0;
    }

    
}

// Inicialización condicional solo en la página de checkout
if (window.location.pathname.includes('finalizar-pedido.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        window.checkoutManager = new CheckoutManager();
    });
}