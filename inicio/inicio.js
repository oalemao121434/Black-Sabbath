class BlackSabbathCosmos {
    constructor() {
        this.init();
    }

    async init() {
        await this.setupLoadingScreen();
        await this.loadProductData();
        this.renderProductCards();
        this.setupEventListeners();
        console.log('🌌 BLACK SABBATH COSMOS - Sistema Inicializado');
    }

    renderProductCards() {
        const container = document.getElementById('produtos-container');
        if (!this.productData || this.productData.length === 0) {
            container.innerHTML = '<p>Carregando produtos...</p>';
            return;
        }

        container.innerHTML = '';

        this.productData.forEach(planeta => {
            const card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('data-product-id', planeta.id);

            card.innerHTML = `
                <div class="card-content">
                    <div class="card-image-container">
                        <img src="${planeta.imagem}" alt="${planeta.nome}" loading="lazy">
                        <div class="card-image-overlay"></div>
                    </div>
                    <h3>${planeta.nome}</h3>
                    <p>${planeta.descricao}</p>
                    <span class="price">R$ ${planeta.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                    <div class="card-buttons">
                        <button class="btn" onclick="window.cosmos.addToCart(${planeta.id})">
                            <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                        </button>
                        <button class="btn-secondary" onclick="window.cosmos.addToWishList(${planeta.id})">
                            <i class="fas fa-heart"></i> Lista de Desejos
                        </button>
                        <button class="btn-secondary" onclick="window.cosmos.showDetails(${planeta.id})">
                            <i class="fas fa-eye"></i> Ver Detalhes
                        </button>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }

    async setupLoadingScreen() {
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 2000));
        document.querySelector('.loading-screen').style.opacity = '0';
        document.querySelector('.loading-screen').style.visibility = 'hidden';
    }





    addToCart(productId) {
        if (!this.productData || this.productData.length === 0) {
            this.showNotification('⏳ Carregando produtos...');
            return;
        }

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

        // Salvar no carrinho
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
        // Buscar dados do produto do JSON
        const product = this.productData.find(p => p.id === productId);
        if (!product) {
            this.showNotification('❌ Produto não encontrado!');
            return;
        }

        let cart = JSON.parse(localStorage.getItem('blackSabbathCart') || '[]');
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                nome: product.nome,
                preco: product.preco,
                imagem: product.imagem,
                quantity: 1
            });
        }

        localStorage.setItem('blackSabbathCart', JSON.stringify(cart));
        this.showNotification(`🚀 ${product.nome} adicionado ao carrinho!`);
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

    async loadProductData() {
        try {
            const response = await fetch('http://localhost:3000/planetas');
            const data = await response.json();
            this.productData = data;
            console.log('📊 Dados dos produtos carregados:', this.productData.length, 'produtos');
        } catch (error) {
            console.error('Erro ao carregar dados dos produtos:', error);
            // Fallback para dados locais se o servidor não estiver disponível
            try {
                const localResponse = await fetch('../json/db.json');
                const localData = await localResponse.json();
                this.productData = localData.planetas;
                console.log('📊 Dados locais carregados:', this.productData.length, 'produtos');
            } catch (localError) {
                console.error('Erro ao carregar dados locais:', localError);
                this.productData = [];
            }
        }
    }

    showDetails(productId) {
        if (!this.productData) {
            this.showNotification('⏳ Carregando dados dos produtos...');
            return;
        }

        const product = this.productData.find(p => p.id === productId);
        if (!product) {
            this.showNotification('❌ Produto não encontrado!');
            return;
        }

        // Criar modal usando classes CSS
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';

        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">×</button>

                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <img src="../imagens/planeta-${product.id}.jpg" alt="${product.nome}" style="
                        width: 200px;
                        height: 200px;
                        object-fit: cover;
                        border-radius: 15px;
                        border: 2px solid var(--primary);
                    ">
                    <div style="flex: 1;">
                        <h2 style="color: var(--primary); margin-bottom: 10px; font-size: 1.8rem;">${product.nome}</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 15px; line-height: 1.6;">${product.descricao}</p>
                        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                            <span style="background: var(--gradient-gold); color: var(--dark); padding: 5px 12px; border-radius: 20px; font-weight: 600;">${product.categoria}</span>
                            ${product.destaque ? '<span style="background: var(--gradient-accent); color: var(--text); padding: 5px 12px; border-radius: 20px; font-weight: 600;">⭐ Destaque</span>' : ''}
                        </div>
                        <p style="font-size: 1.5rem; color: var(--accent); font-weight: 700;">R$ ${product.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; text-align: center;">
                        <i class="fas fa-ruler-combined" style="color: var(--accent); font-size: 1.5rem; margin-bottom: 5px;"></i>
                        <div style="font-size: 0.9rem; color: var(--text-secondary);">Diâmetro</div>
                        <div style="font-weight: 600; color: var(--text);">${product.diametro_km.toLocaleString()} km</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; text-align: center;">
                        <i class="fas fa-weight-hanging" style="color: var(--accent); font-size: 1.5rem; margin-bottom: 5px;"></i>
                        <div style="font-size: 0.9rem; color: var(--text-secondary);">Massa</div>
                        <div style="font-weight: 600; color: var(--text);">${product.massa_terras} Terras</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; text-align: center;">
                        <i class="fas fa-route" style="color: var(--accent); font-size: 1.5rem; margin-bottom: 5px;"></i>
                        <div style="font-size: 0.9rem; color: var(--text-secondary);">Distância</div>
                        <div style="font-weight: 600; color: var(--text);">${product.distancia_anos_luz} anos-luz</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; text-align: center;">
                        <i class="fas fa-boxes" style="color: var(--accent); font-size: 1.5rem; margin-bottom: 5px;"></i>
                        <div style="font-size: 0.9rem; color: var(--text-secondary);">Estoque</div>
                        <div style="font-weight: 600; color: var(--text);">${product.estoque} unidades</div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="color: var(--primary); margin-bottom: 10px;">Características:</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${product.tags.map(tag => `<span style="background: var(--gradient-accent); color: var(--text); padding: 4px 10px; border-radius: 15px; font-size: 0.85rem;">${tag}</span>`).join('')}
                    </div>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="window.cosmos.addToWishList(${product.id}); this.closest('.modal-overlay').remove()" class="btn-secondary" style="display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-heart"></i> Lista de Desejos
                    </button>
                    <button onclick="window.cosmos.addToCart(${product.id}); this.closest('.modal-overlay').remove()" class="btn" style="display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-shopping-cart"></i> Comprar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Fechar modal ao clicar fora ou no botão X
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close')) {
                modal.remove();
            }
        });
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