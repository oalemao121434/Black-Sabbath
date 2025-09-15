document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Clear previous error messages
    clearErrors();

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
        // Show loading state
        const button = document.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'Registrando...';
        button.disabled = true;

        // Simulate registration process
        setTimeout(() => {
            // Simular registro bem-sucedido
            showSuccess('Registro realizado com sucesso! Redirecionando para login...');
            // Redirecionar para a página de login após 2 segundos
            setTimeout(() => {
                window.location.href = '../login/login.html';
            }, 2000);
        }, 1000);
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';
    field.parentNode.appendChild(errorDiv);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.color = '#4ecdc4';
    successDiv.style.fontSize = '0.9rem';
    successDiv.style.marginTop = '1rem';
    successDiv.style.textAlign = 'center';
    document.querySelector('.container').appendChild(successDiv);
}

function clearErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
    const success = document.querySelector('.success-message');
    if (success) success.remove();
}
