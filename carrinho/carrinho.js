class CarrinhoCosmos {
    constructor() {
        this.cart = [];
        this.products = [];
        this.coupon = null; // {code, discount, type: 'fixed' or 'percent'}
        this.freight = 0;
        this.taxes = 0;
        this.currency = 'BRL'; // BRL or USD
        this.exchangeRate = 5.0; // Mock rate BRL to USD
        this.shippingMethod = 'pac'; // pac, sedex, express
        this.cep = '';
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.loadSharedCart();
        this.loadCart();
        this.renderCart();
        this.setupEventListeners();
        console.log('🛒 Carrinho BLACK SABBATH COSMOS - Inicializado');
    }

    async loadProducts() {
        try {
            const response = await fetch('http://localhost:3000/planetas');
            const data = await response.json();
            this.products = data;
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    }

    loadCart() {
        const cartData = localStorage.getItem('blackSabbathCart');
        this.cart = cartData ? JSON.parse(cartData) : [];
        // Remove unavailable products
        this.cart = this.cart.filter(item => this.getProductById(item.id));
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
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartFreight = document.getElementById('cart-freight');
        const cartTaxes = document.getElementById('cart-taxes');
        const cartDiscount = document.getElementById('cart-discount');
        const cartTotal = document.getElementById('cart-total');
        const currencySymbol = document.getElementById('currency-symbol');
        const deliveryEstimate = document.getElementById('delivery-estimate');
        const estimateDays = document.getElementById('estimate-days');

        if (this.cart.length === 0) {
            emptyCart.style.display = 'block';
            cartItems.style.display = 'none';
            return;
        }

        emptyCart.style.display = 'none';
        cartItems.style.display = 'block';

        cartItemsList.innerHTML = '';

        let subtotal = 0;

        this.cart.forEach(item => {
            const itemSubtotal = item.preco * item.quantity;
            subtotal += itemSubtotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.imagem}" alt="${item.nome}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.nome}</h4>
                        <p>Produto adicionado ao carrinho</p>
                    </div>
                </div>
                <div class="cart-item-price">${this.formatCurrency(item.preco)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-subtotal">${this.formatCurrency(itemSubtotal)}</div>
                <div class="cart-item-actions">
                    <button class="remove-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsList.appendChild(itemElement);
        });

        // Calculate totals
        const discount = this.coupon ? (this.coupon.type === 'percent' ? subtotal * (this.coupon.discount / 100) : this.coupon.discount) : 0;
        const totalBeforeTax = subtotal - discount + this.freight;
        this.taxes = totalBeforeTax * 0.1; // Mock 10% tax
        const total = totalBeforeTax + this.taxes;

        // Update UI
        currencySymbol.textContent = this.currency === 'BRL' ? 'R$' : '$';
        cartSubtotal.textContent = this.formatCurrency(subtotal);
        cartFreight.textContent = this.formatCurrency(this.freight);
        cartTaxes.textContent = this.formatCurrency(this.taxes);
        cartDiscount.textContent = this.formatCurrency(discount);
        cartTotal.textContent = this.formatCurrency(total);

        // Delivery estimate
        if (this.shippingMethod) {
            const estimates = { pac: '5-10 dias', sedex: '1-3 dias', express: 'até 1 dia' };
            estimateDays.textContent = estimates[this.shippingMethod];
            deliveryEstimate.style.display = 'block';
        } else {
            deliveryEstimate.style.display = 'none';
        }
    }

    formatCurrency(amount) {
        const converted = this.currency === 'USD' ? amount / this.exchangeRate : amount;
        return `${this.currency === 'BRL' ? 'R$' : '$'} ${converted.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
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

            if (e.target.id === 'apply-coupon-btn') {
                this.applyCoupon();
            }

            if (e.target.id === 'calculate-freight-btn') {
                this.calculateFreight();
            }

            if (e.target.id === 'share-cart-btn') {
                this.shareCart();
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.id === 'shipping-method') {
                this.shippingMethod = e.target.value;
                this.renderCart();
            }

            if (e.target.id === 'currency-select') {
                this.currency = e.target.value;
                this.renderCart();
            }
        });

        // Abandoned cart alert
        window.addEventListener('beforeunload', (e) => {
            if (this.cart.length > 0) {
                e.preventDefault();
                e.returnValue = 'Você tem itens no carrinho. Tem certeza que deseja sair?';
            }
        });
    }

    addItem(productId, quantity = 1) {
        const product = this.getProductById(productId);
        if (!product) {
            this.showNotification('Produto não encontrado!');
            return;
        }
        const existing = this.cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                nome: product.nome,
                preco: product.preco,
                imagem: product.imagem,
                quantity
            });
        }
        this.saveCart();
        this.renderCart();
        this.showNotification('Produto adicionado ao carrinho!');
    }

    applyCoupon() {
        const code = document.getElementById('coupon-input').value.trim().toUpperCase();
        const message = document.getElementById('coupon-message');
        // Mock coupons
        const coupons = {
            'DESCONTO10': { discount: 10, type: 'percent' },
            'FRETEGRATIS': { discount: this.freight, type: 'fixed' }
        };
        if (coupons[code]) {
            this.coupon = { code, ...coupons[code] };
            message.textContent = 'Cupom aplicado!';
            message.style.color = 'green';
        } else {
            this.coupon = null;
            message.textContent = 'Cupom inválido!';
            message.style.color = 'red';
        }
        this.renderCart();
    }

    async calculateFreight() {
        const cep = document.getElementById('cep-input').value.replace(/\D/g, '');
        if (cep.length !== 8) {
            this.showNotification('CEP inválido!');
            return;
        }
        this.cep = cep;
        // Mock freight calculation based on CEP
        const freightCosts = { pac: 15, sedex: 25, express: 35 };
        this.freight = freightCosts[this.shippingMethod] || 15;
        document.getElementById('shipping-options').style.display = 'block';
        this.renderCart();
        this.showNotification('Frete calculado!');
    }

    shareCart() {
        const cartData = btoa(JSON.stringify(this.cart));
        const url = `${window.location.origin}${window.location.pathname}?cart=${cartData}`;
        navigator.clipboard.writeText(url).then(() => {
            this.showNotification('Link do carrinho copiado para a área de transferência!');
        });
    }

    loadSharedCart() {
        const urlParams = new URLSearchParams(window.location.search);
        const cartData = urlParams.get('cart');
        if (cartData) {
            try {
                const sharedCart = JSON.parse(atob(cartData));
                this.cart = sharedCart.filter(item => this.getProductById(item.id));
                this.saveCart();
                this.renderCart();
                this.showNotification('Carrinho compartilhado carregado!');
            } catch (e) {
                console.error('Erro ao carregar carrinho compartilhado:', e);
            }
        }
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
