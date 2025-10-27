class BlackSabbathCosmos {
    constructor() {
        this.init();
    }

    async init() {
        await this.setupLoadingScreen();
        this.setupEventListeners();
        console.log('🌌 BLACK SABBATH COSMOS - Sistema Inicializado');
    }

    async setupLoadingScreen() {
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 2000));
        document.querySelector('.loading-screen').style.opacity = '0';
        document.querySelector('.loading-screen').style.visibility = 'hidden';
    }





    addToCart(productId) {
        // Simular adição ao carrinho
        this.showNotification(`🚀 Produto ${productId} adicionado ao carrinho!`);

        // Animação do botão
        const button = event.target;
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
        button.style.background = 'var(--success)';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.disabled = false;
        }, 2000);

        // Aqui você pode adicionar a lógica real para adicionar ao carrinho
        this.saveToCart(productId);

        // Redirecionar para a página do carrinho
        setTimeout(() => {
            window.location.href = '../carrinho/carrinho.html';
        }, 1000);
    }

    addToWishList(productId) {
        // Simular adição à lista de desejos
        this.showNotification(`💖 Produto ${productId} adicionado à lista de desejos!`);

        // Animação do botão
        const button = event.target;
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-heart"></i> Adicionado!';
        button.style.background = 'var(--success)';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.disabled = false;
        }, 2000);

        // Salvar na lista de desejos
        this.saveToWishList(productId);
    }

    saveToCart(productId) {
        // Simular salvamento no localStorage - criar objeto produto básico
        const product = { id: productId, nome: `Produto ${productId}`, preco: 1000 }; // Placeholder, pode ser expandido
        let cart = JSON.parse(localStorage.getItem('blackSabbathCart') || '[]');
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        localStorage.setItem('blackSabbathCart', JSON.stringify(cart));
    }

    saveToWishList(productId) {
        let wishlist = JSON.parse(localStorage.getItem('blackSabbathWishList') || '[]');
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            localStorage.setItem('blackSabbathWishList', JSON.stringify(wishlist));
        }
    }

    showNotification(message) {
        // Criar notificação customizada
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

        // Animação de entrada
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    setupEventListeners() {
        // Scroll suave para links âncora
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.cosmos = new BlackSabbathCosmos();
});