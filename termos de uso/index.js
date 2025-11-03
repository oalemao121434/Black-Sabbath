class TermosDeUso {
    constructor() {
        this.init();
    }

    async init() {
        this.setupEventListeners();
        console.log('📜 BLACK SABBATH COSMOS - Página Termos de Uso Inicializada');
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

        // Animações de entrada
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observar elementos que devem ter animação
        document.querySelectorAll('.terms-card, .terms-contact').forEach(el => {
            observer.observe(el);
        });
    }
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    .terms-card, .terms-contact {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }

    .terms-card.animate-in, .terms-contact.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.termosDeUso = new TermosDeUso();
});
