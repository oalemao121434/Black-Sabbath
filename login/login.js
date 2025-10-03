// Configuração da API
const API_BASE_URL = 'http://localhost:5000/api/auth';

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Clear previous messages
    clearMessages();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    let isValid = true;

    // Validate email
    if (!email) {
        showError('email', 'Email é obrigatório.');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Por favor, insira um email válido.');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError('password', 'Senha é obrigatória.');
        isValid = false;
    }

    if (isValid) {
        await loginUser({ email, password, rememberMe });
    }
});

// Login user function
async function loginUser(userData) {
    const button = document.querySelector('.submit-btn');
    const originalText = button.querySelector('.btn-text').textContent;
    
    // Show loading state
    button.classList.add('loading');
    button.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userData.email,
                password: userData.password
            })
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess('Login realizado com sucesso! Redirecionando...');
            
            // Salvar token e dados do usuário
            if (data.data && data.data.token) {
                localStorage.setItem('authToken', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                
                // Se "Lembrar de mim" estiver marcado, salvar por mais tempo
                if (userData.rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
            }
            
            // Redirecionar para a página inicial após 1.5 segundos
            setTimeout(() => {
                window.location.href = '../inicio/inicio.html';
            }, 1500);
        } else {
            throw new Error(data.message || 'Erro ao realizar login');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        
        // Mensagens de erro específicas
        if (error.message.includes('Credenciais inválidas')) {
            showError('form', 'Email ou senha incorretos. Tente novamente.');
        } else if (error.message.includes('NetworkError')) {
            showError('form', 'Erro de conexão. Verifique se o servidor está rodando.');
        } else {
            showError('form', error.message || 'Erro ao realizar login. Tente novamente.');
        }
    } finally {
        // Restore button state
        button.classList.remove('loading');
        button.disabled = false;
        button.querySelector('.btn-text').textContent = originalText;
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(fieldId, message) {
    if (fieldId === 'form') {
        // Show general form error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.marginTop = '1rem';
        errorDiv.style.textAlign = 'center';
        document.querySelector('.auth-form').appendChild(errorDiv);
    } else {
        // Show field-specific error
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        
        // Add error styling to input
        field.style.borderColor = '#ff6b6b';
    }
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.querySelector('.auth-form').appendChild(successDiv);
}

function clearMessages() {
    // Remove error messages
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
    
    // Remove success messages
    const success = document.querySelector('.success-message');
    if (success) success.remove();
    
    // Reset input borders
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });
}

// Real-time validation
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', function() {
        const value = this.value.trim();
        
        if (value && this.id === 'email' && !isValidEmail(value)) {
            showError('email', 'Por favor, insira um email válido.');
        }
    });
    
    input.addEventListener('input', function() {
        // Clear error when user starts typing
        const error = this.parentNode.querySelector('.error-message');
        if (error) {
            error.remove();
            this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
    });
});

// Add some interactive effects
document.querySelectorAll('.form-group input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentNode.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentNode.style.transform = 'scale(1)';
    });
});

// Check if user was remembered
document.addEventListener('DOMContentLoaded', function() {
    const remembered = localStorage.getItem('rememberMe');
    if (remembered === 'true') {
        document.getElementById('rememberMe').checked = true;
        
        // Tentar preencher automaticamente se houver dados salvos
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            document.getElementById('email').value = user.email || '';
        }
    }
});

// Auto-focus no campo de email
document.addEventListener('DOMContentLoaded', function() {
    const emailField = document.getElementById('email');
    if (emailField && !emailField.value) {
        emailField.focus();
    }
});