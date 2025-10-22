class CarrinhoCosmos {
    constructor() {
        this.cart = [];
        this.products = [];
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.loadCart();
        this.renderCart();
        this.setupEventListeners();
        console.log('🛒 Carrinho BLACK SABBATH COSMOS - Inicializado');
    }

    async loadProducts() {
        try {
            const response = await fetch('../json/db.json');
            const data = await response.json();
            this.products = data.planetas;
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    }

    loadCart() {
        const cartData = localStorage.getItem('blackSabbathCart');
        this.cart = cartData ? JSON.parse(cartData) : [];
    }

    saveCart() {
        localStorage.setItem('blackSabbathCart', JSON.stringify(this.cart));
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    renderCart() {
        const cartItemsList = document.getElementById('cart-items-list');
        const emptyCart = document.getElementById('empty-cart');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (this.cart.length === 0) {
            emptyCart.style.display = 'block';
            cartItems.style.display = 'none';
            return;
        }

        emptyCart.style.display = 'none';
        cartItems.style.display = 'block';

        cartItemsList.innerHTML = '';

        let total = 0;

        this.cart.forEach(item => {
            const product = this.getProductById(item.id);
            if (!product) return;

            const subtotal = product.preco * item.quantity;
            total += subtotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <img src="${product.imagem}" alt="${product.nome}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${product.nome}</h4>
                        <p>${product.descricao.substring(0, 100)}...</p>
                    </div>
                </div>
                <div class="cart-item-price">R$ ${product.preco.toLocaleString('pt-BR')}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-subtotal">R$ ${subtotal.toLocaleString('pt-BR')}</div>
                <div class="cart-item-actions">
                    <button class="remove-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsList.appendChild(itemElement);
        });

        cartTotal.textContent = total.toLocaleString('pt-BR');
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.renderCart();
            }
        }
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
        this.showNotification('Produto removido do carrinho!');
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCart();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-gold);
            color: var(--dark);
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.style.transform = 'translateX(0)', 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                const action = e.target.dataset.action;
                const productId = parseInt(e.target.dataset.id);
                const change = action === 'increase' ? 1 : -1;
                this.updateQuantity(productId, change);
            }

            if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
                const productId = parseInt(e.target.dataset.id || e.target.closest('.remove-btn').dataset.id);
                this.removeItem(productId);
            }

            if (e.target.id === 'checkout-btn') {
                this.checkout();
            }
        });
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Seu carrinho está vazio!');
            return;
        }

        // Simular checkout
        this.showNotification('🚀 Compra finalizada com sucesso! Obrigado por escolher BLACK SABBATH COSMOS.');
        this.clearCart();
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.carrinho = new CarrinhoCosmos();
});
