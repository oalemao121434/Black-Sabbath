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
        document.querySelector('.loading-screen').style.opacity = '0';
        document.querySelector('.loading-screen').style.visibility = 'hidden';
    }

    async loadProducts() {
        try {
            const response = await fetch('http://localhost:3000/planetas');
            const produtos = await response.json();

            this.products = produtos.map(produto => ({
                id: produto.id,
                nome: produto.nome,
                categoria: produto.categoria,
                descricao: produto.descricao,
                preco: produto.preco,
                moeda: produto.moeda,
                imagem: produto.imagem,
                estoque: produto.estoque,
                destaque: produto.destaque,
                tags: produto.tags
            }));

            this.renderProducts();
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            // Fallback para produtos locais se o servidor não estiver disponível
            this.loadFallbackProducts();
        }
    }

    async loadFallbackProducts() {
        try {
            const response = await fetch('../json/db.json');
            const data = await response.json();
            const produtos = data.planetos;

            this.products = produtos.map(produto => ({
                id: produto.id,
                nome: produto.nome,
                categoria: produto.categoria,
                descricao: produto.descricao,
                preco: produto.preco,
                moeda: produto.moeda,
                imagem: produto.imagem,
                estoque: produto.estoque,
                destaque: produto.destaque,
                tags: produto.tags
            }));

            this.renderProducts();
        } catch (fallbackError) {
            console.error('Erro no fallback:', fallbackError);
            this.products = this.getFallbackProducts();
            this.renderProducts();
        }
    }

    getFallbackImage() {
        const spaceImages = [
            'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ];
        return spaceImages[Math.floor(Math.random() * spaceImages.length)];
    }

    getFallbackProducts() {
        return [
            {
                id: 1,
                name: "Núcleo Estelar Avançado",
                description: "Gere energia ilimitada com este núcleo de última geração extraído de estrelas em colapso",
                price: 2499,
                image: this.getFallbackImage(),
                category: "Tecnologia Estelar"
            },
            {
                id: 2,
                name: "Cristal de Nebulosa",
                description: "Cristal formado no coração da Nebulosa de Orion, com propriedades energéticas únicas",
                price: 1799,
                image: this.getFallbackImage(),
                category: "Mineral Cósmico"
            },
            {
                id: 3,
                name: "Navegador Quântico X1",
                description: "Sistema de navegação que dobra o espaço-tempo para viagens interestelares",
                price: 3999,
                image: this.getFallbackImage(),
                category: "Tecnologia de Navegação"
            },
            {
                id: 4,
                name: "Traje Espacial Quantum",
                description: "Traje com tecnologia de teletransporte integrada e proteção contra radiação",
                price: 4599,
                image: this.getFallbackImage(),
                category: "Equipamento de Proteção"
            },
            {
                id: 5,
                name: "Gerador de Campo de Força",
                description: "Proteção contra meteoros e radiação cósmica para naves espaciais",
                price: 3299,
                image: this.getFallbackImage(),
                category: "Sistema de Defesa"
            },
            {
                id: 6,
                name: "Comunicador Subespacial",
                description: "Comunicação instantânea através de buracos de minhoca artificiais",
                price: 2899,
                image: this.getFallbackImage(),
                category: "Comunicação"
            }
        ];
    }

    renderProducts() {
        const container = document.getElementById('produtos-container');
        container.innerHTML = '';

        this.products.forEach(produto => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.setAttribute('data-product-id', produto.id);

            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <span class="price">R$ ${produto.preco.toFixed(2)}</span><br>
                <button class="btn" onclick="window.cosmos.addToCart(${produto.id})">Comprar</button>
            `;

            container.appendChild(card);
        });
    }



    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            // Aqui você pode implementar a navegação para a página do produto
            this.showNotification(`Visualizando ${product.nome}`);
            console.log('Visualizando produto:', product);
        }
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Simular adição ao carrinho
        this.showNotification(`🚀 ${product.nome} adicionado ao carrinho!`);
        
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
        this.saveToCart(product);
    }

    saveToCart(product) {
        // Simular salvamento no localStorage
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