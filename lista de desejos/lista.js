class ListaDesejosCosmos {
    constructor() {
        this.wishlist = [];
        this.products = [];
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.loadWishlist();
        this.renderWishlist();
        this.setupEventListeners();
        console.log('💖 Lista de Desejos BLACK SABBATH COSMOS - Inicializada');
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

    loadWishlist() {
        const wishlistData = localStorage.getItem('blackSabbathWishList');
        this.wishlist = wishlistData ? JSON.parse(wishlistData) : [];
    }

    saveWishlist() {
        localStorage.setItem('blackSabbathWishList', JSON.stringify(this.wishlist));
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    renderWishlist() {
        const wishlistItemsList = document.getElementById('wishlist-items-list');
        const emptyWishlist = document.getElementById('empty-wishlist');
        const wishlistItems = document.getElementById('wishlist-items');

        if (this.wishlist.length === 0) {
            emptyWishlist.style.display = 'block';
            wishlistItems.style.display = 'none';
            return;
        }

        emptyWishlist.style.display = 'none';
        wishlistItems.style.display = 'block';

        wishlistItemsList.innerHTML = '';

        this.wishlist.forEach(productId => {
            const product = this.getProductById(productId);
            if (!product) return;

            const itemElement = document.createElement('div');
            itemElement.className = 'wishlist-item';
            itemElement.innerHTML = `
                <div class="wishlist-item-content">
                    <img src="${product.imagem}" alt="${product.nome}" class="wishlist-item-image">
                    <div class="wishlist-item-details">
                        <h4>${product.nome}</h4>
                        <p>${product.descricao}</p>
                        <span class="price">R$ ${product.preco.toLocaleString('pt-BR')}</span>
                    </div>
                </div>
                <div class="wishlist-item-actions">
                    <button class="btn" onclick="window.wishlist.addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                    </button>
                    <button class="remove-btn" data-id="${product.id}">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            `;
            wishlistItemsList.appendChild(itemElement);
        });
    }

    addToWishlist(productId) {
        if (!this.wishlist.includes(productId)) {
            this.wishlist.push(productId);
            this.saveWishlist();
            this.renderWishlist();
            this.showNotification('Produto adicionado à lista de desejos!');
        } else {
            this.showNotification('Produto já está na lista de desejos!');
        }
    }

    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(id => id !== productId);
        this.saveWishlist();
        this.renderWishlist();
        this.showNotification('Produto removido da lista de desejos!');
    }

    addToCart(productId) {
        // Simular adição ao carrinho
        this.showNotification(`🚀 Produto ${productId} adicionado ao carrinho!`);

        // Aqui você pode integrar com a lógica do carrinho existente
        const product = this.getProductById(productId);
        if (product) {
            let cart = JSON.parse(localStorage.getItem('blackSabbathCart') || '[]');
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    nome: product.nome,
                    preco: product.preco,
                    quantity: 1
                });
            }

            localStorage.setItem('blackSabbathCart', JSON.stringify(cart));
        }

        // Redirecionar para a página do carrinho
        setTimeout(() => {
            window.location.href = '../carrinho/carrinho.html';
        }, 1000);
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
            if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
                const productId = parseInt(e.target.dataset.id || e.target.closest('.remove-btn').dataset.id);
                this.removeFromWishlist(productId);
            }
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.wishlist = new ListaDesejosCosmos();
});
