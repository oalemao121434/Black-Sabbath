// Configuração da API
const API_BASE_URL = 'http://localhost:5000/api/auth';

document.getElementById('registroForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Clear previous messages
    clearMessages();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let isValid = true;

    // Validate nome
    if (!nome) {
        showError('nome', 'Nome é obrigatório.');
        isValid = false;
    } else if (nome.length < 2) {
        showError('nome', 'Nome deve ter pelo menos 2 caracteres.');
        isValid = false;
    }

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
    } else if (password.length < 6) {
        showError('password', 'A senha deve ter pelo menos 6 caracteres.');
        isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword) {
        showError('confirmPassword', 'Confirmação de senha é obrigatória.');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'As senhas não coincidem.');
        isValid = false;
    }

    if (isValid) {
        await registerUser({ nome, email, password });
    }
});

// Password strength indicator
document.getElementById('password').addEventListener('input', function(e) {
    const password = e.target.value;
    const strengthBar = document.querySelector('.strength-bar');
    
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    if (password.match(/\d/)) strength += 1;
    if (password.match(/[^a-zA-Z\d]/)) strength += 1;
    
    strengthBar.className = 'strength-bar';
    if (password.length > 0) {
        if (strength <= 1) {
            strengthBar.classList.add('weak');
        } else if (strength <= 2) {
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('strong');
        }
    }
});

// Register user function
async function registerUser(userData) {
    const button = document.querySelector('.submit-btn');
    const originalText = button.querySelector('.btn-text').textContent;
    
    // Show loading state
    button.classList.add('loading');
    button.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.nome,
                email: userData.email,
                password: userData.password
            })
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess('Registro realizado com sucesso! Redirecionando para login...');
            
            // Salvar token no localStorage se necessário
            if (data.data && data.data.token) {
                localStorage.setItem('authToken', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
            }
            
            // Redirecionar para a página de login após 2 segundos
            setTimeout(() => {
                window.location.href = '../login/login.html';
            }, 2000);
        } else {
            throw new Error(data.message || 'Erro ao realizar registro');
        }
    } catch (error) {
        console.error('Erro no registro:', error);
        
        // Mensagens de erro específicas
        if (error.message.includes('Usuário ou email já existe')) {
            showError('email', 'Este email ou nome de usuário já está em uso.');
        } else if (error.message.includes('NetworkError')) {
            showError('form', 'Erro de conexão. Verifique se o servidor está rodando.');
        } else {
            showError('form', error.message || 'Erro ao realizar registro. Tente novamente.');
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
        
        if (this.id === 'confirmPassword' && value !== document.getElementById('password').value) {
            showError('confirmPassword', 'As senhas não coincidem.');
        }
    });
    
    input.addEventListener('input', function() {
        // Clear error when user starts typing
        const error = this.parentNode.querySelector('.error-message');
        if (error && !error.textContent.includes('obrigatório')) {
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