class BlackSabbathCosmos {
    constructor() {
        this.products = [];
        this.currentSlide = 0;
        this.slidesToShow = 3;
        this.autoRotateInterval = null;
        this.init();
    }

    async init() {
        await this.setupLoadingScreen();
        await this.loadProducts();
        this.setupEventListeners();
        this.updateSlidesToShow();
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
            // Carregar planetas do JSON Server
            const response = await fetch('http://localhost:3000/planetas');
            const produtos = await response.json();
            
            // Mapear para produtos
            this.products = produtos.map(p => ({
                id: p.id,
                name: p.nome,
                description: p.descricao,
                price: p.preco_usd,
                image: p.imagens[0] || this.getFallbackImage(),
                category: p.categoria || 'Artefato Cósmico'
            }));
            
            this.renderProducts();
            this.startAutoRotate();
        } catch (error) {
            console.error('Erro ao carregar planetas:', error);
            // Fallback para produtos locais
            this.products = this.getFallbackProducts();
            this.renderProducts();
            this.startAutoRotate();
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
        const track = document.getElementById('carousel-track');
        const indicators = document.getElementById('carousel-indicators');
        
        if (!track || !indicators) return;

        // Renderizar slides
        track.innerHTML = this.products.map(product => `
            <div class="carousel-slide">
                <div class="card" onclick="cosmos.viewProduct(${product.id})">
                    <img src="${product.image}" alt="${product.name}" class="card-image">
                    <div class="card-content">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <span class="price">$ ${product.price.toLocaleString()}</span>
                        <button class="btn" onclick="event.stopPropagation(); cosmos.addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i>
                            Adquirir Artefato
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Renderizar indicadores
        indicators.innerHTML = this.products.map((_, index) => `
            <span class="indicator ${index === 0 ? 'active' : ''}" onclick="cosmos.goToSlide(${index})"></span>
        `).join('');

        this.updateCarousel();
    }

    updateSlidesToShow() {
        const width = window.innerWidth;
        if (width < 768) {
            this.slidesToShow = 1;
        } else if (width < 1024) {
            this.slidesToShow = 2;
        } else {
            this.slidesToShow = 3;
        }
        this.updateCarousel();
    }

    nextSlide() {
        const maxSlide = Math.max(0, this.products.length - this.slidesToShow);
        this.currentSlide = (this.currentSlide + 1) % (maxSlide + 1);
        this.updateCarousel();
    }

    prevSlide() {
        const maxSlide = Math.max(0, this.products.length - this.slidesToShow);
        this.currentSlide = (this.currentSlide - 1 + (maxSlide + 1)) % (maxSlide + 1);
        this.updateCarousel();
    }

    goToSlide(index) {
        const maxSlide = Math.max(0, this.products.length - this.slidesToShow);
        this.currentSlide = Math.min(index, maxSlide);
        this.updateCarousel();
    }

    updateCarousel() {
        const track = document.querySelector('.carousel-track');
        const indicators = document.querySelectorAll('.indicator');
        
        if (!track) return;

        const slideWidth = 100 / this.slidesToShow;
        const translateX = -this.currentSlide * slideWidth;
        track.style.transform = `translateX(${translateX}%)`;

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoRotate() {
        this.stopAutoRotate();
        this.autoRotateInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }

    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            // Aqui você pode implementar a navegação para a página do produto
            this.showNotification(`Visualizando ${product.name}`);
            console.log('Visualizando produto:', product);
        }
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Simular adição ao carrinho
        this.showNotification(`🚀 ${product.name} adicionado ao carrinho!`);
        
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

        // Pause auto-rotate on hover
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoRotate());
            carousel.addEventListener('mouseleave', () => this.startAutoRotate());
        }

        // Responsividade
        window.addEventListener('resize', () => {
            this.updateSlidesToShow();
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.cosmos = new BlackSabbathCosmos();
});