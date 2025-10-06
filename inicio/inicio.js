class BlackSabbathCosmos {
    constructor() {
        this.products = [];
        this.init();
    }

    async init() {
        await this.setupLoadingScreen();
        await this.loadProducts();
        this.setupEventListeners();
        console.log('🌌 BLACK SABBATH COSMOS - Sistema Inicializado');
    }

    async setupLoadingScreen() {
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 2000));
        document.querySelector('.loading-screen').remove();
    }



    async loadProducts() {
        try {
            // Carregar planetas do JSON Server
            const response = await fetch('http://localhost:3000/planetas');
            const produtos = await response.json();
            // Mapear para produtos
            this.products = produtos.map(p => ({
                id: p.id,
                name: p.nome,
                description: p.descricao,
                price: p.preco_usd,
                image: p.imagens[0] || ''
            }));
            this.renderProducts();
        } catch (error) {
            console.error('Erro ao carregar planetas:', error);
            // Fallback para produtos locais
            this.products = this.getFallbackProducts();
            this.renderProducts();
        }
    }

    getFallbackProducts() {
        return [
            {
                id: 1,
                name: "Núcleo Estelar Avançado",
                description: "Gere energia ilimitada com este núcleo de última geração",
                price: 2499,
                image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            },
            {
                id: 2,
                name: "Cristal de Nebulosa",
                description: "Cristal formado no coração da Nebulosa de Orion",
                price: 1799,
                image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            },
            {
                id: 3,
                name: "Navegador Quântico X1",
                description: "Sistema de navegação que dobra o espaço-tempo",
                price: 3999,
                image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            },
            {
                id: 4,
                name: "Traje Espacial Quantum",
                description: "Traje com tecnologia de teletransporte integrada",
                price: 4599,
                image: "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            }
        ];
    }

    renderProducts() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        grid.innerHTML = this.products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">₪ ${product.price.toLocaleString()}</div>
                <button class="add-to-cart" onclick="cosmos.addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Adicionar ao Carrinho
                </button>
            </div>
        `).join('');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Simular adição ao carrinho
        this.showNotification(`${product.name} adicionado ao carrinho!`);
        
        // Animação simples
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }

    showNotification(message) {
        // Notificação simples
        alert(message); // Você pode substituir por um sistema de notificação mais elaborado depois
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
    const cosmos = new BlackSabbathCosmos();
});
