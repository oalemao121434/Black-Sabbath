class SobreNos {
    constructor() {
        this.init();
    }

    async init() {
        this.setupEventListeners();
        console.log('🌌 BLACK SABBATH COSMOS - Página Sobre Nós Inicializada');
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

        // Formulário de contato
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }

        // Animações de entrada
        this.setupScrollAnimations();
    }

    handleContactForm(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Simular envio do formulário
        this.showNotification('🚀 Mensagem enviada com sucesso! Entraremos em contato em breve.');

        // Resetar formulário
        e.target.reset();

        // Aqui você pode adicionar a lógica real para enviar o email
        console.log('Dados do formulário:', data);
    }

    showNotification(message) {
        // Criar notificação customizada
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ffcc00 0%, #ffd700 100%);
            color: #0b1a2b;
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

        // Remover após 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
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
        document.querySelectorAll('.mission-card, .team-member, .stat-card, .contact-item').forEach(el => {
            observer.observe(el);
        });
    }
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    .mission-card, .team-member, .stat-card, .contact-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }

    .mission-card.animate-in, .team-member.animate-in, .stat-card.animate-in, .contact-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.sobreNos = new SobreNos();
});
