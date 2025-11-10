// Configuração do Supabase para autenticação
// Usando as funções do supabaseClient.js

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

// Função de registro usando Supabase
async function registerUser(userData) {
    const button = document.querySelector('.submit-btn');
    const originalText = button.querySelector('.btn-text').textContent;

    // Show loading state
    button.classList.add('loading');
    button.disabled = true;

    try {
        // Fazer registro com Supabase
        const { data, error } = await window.auth.signUp(userData.email, userData.password);

        if (error) {
            throw error;
        }

        // Registro bem-sucedido
        showSuccess('Registro realizado com sucesso! Verifique seu email para confirmar a conta.');

        // Salvar dados básicos do usuário (sem fazer login automático)
        // O usuário precisa confirmar o email primeiro

        // Redirecionar para a página de login após 3 segundos
        setTimeout(() => {
            window.location.href = '../login/login.html';
        }, 3000);

    } catch (error) {
        console.error('Erro no registro:', error);

        // Mensagens de erro específicas do Supabase
        let errorMessage = 'Erro ao realizar registro. Tente novamente.';

        if (error.message.includes('User already registered')) {
            errorMessage = 'Este email já está cadastrado.';
        } else if (error.message.includes('Password should be at least')) {
            errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        } else if (error.message.includes('Invalid email')) {
            errorMessage = 'Por favor, insira um email válido.';
        } else if (error.message.includes('Signup is disabled')) {
            errorMessage = 'Registro temporariamente desabilitado.';
        }

        showError('form', errorMessage);
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

function isValidPassword(password) {
    // Pelo menos 8 caracteres, no máximo 20
    if (password.length < 8 || password.length > 20) {
        return false;
    }
    // Pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(password)) {
        return false;
    }
    // Pelo menos um número
    if (!/\d/.test(password)) {
        return false;
    }
    // Pelo menos um caractere especial
    if (!/[^a-zA-Z\d]/.test(password)) {
        return false;
    }
    return true;
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

        // Save input values to sessionStorage
        if (this.id === 'nome') {
            sessionStorage.setItem('registroNome', this.value);
        } else if (this.id === 'email') {
            sessionStorage.setItem('registroEmail', this.value);
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

// Restore saved values from sessionStorage
document.addEventListener('DOMContentLoaded', function() {
    const savedNome = sessionStorage.getItem('registroNome');
    if (savedNome) {
        document.getElementById('nome').value = savedNome;
    }

    const savedEmail = sessionStorage.getItem('registroEmail');
    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
    }
});
