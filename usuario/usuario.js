// Verificar se o usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
});

// Função para verificar se o usuário está logado
function checkUserLogin() {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (!authToken || !userData) {
        // Usuário não está logado, redirecionar para login
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '../login/login.html';
        return;
    }

    // Usuário está logado, exibir informações
    displayUserInfo(JSON.parse(userData));
}

// Função para exibir as informações do usuário
function displayUserInfo(user) {
    document.getElementById('user-name').textContent = user.username || 'Usuário';
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-id').textContent = user.id;
}

// Função para deslogar o usuário
document.getElementById('logout-btn').addEventListener('click', function() {
    logoutUser();
});

function logoutUser() {
    // Remover dados do localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');

    // Redirecionar diretamente para a página de login
    window.location.href = '../login/login.html';
}
