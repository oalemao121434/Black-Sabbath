// Verificar se o usuário está logado ao carregar a página usando Supabase
document.addEventListener('DOMContentLoaded', async function() {
    await checkUserLogin();
});

// Função para verificar se o usuário está logado usando Supabase
async function checkUserLogin() {
    try {
        // Verificar sessão atual com Supabase
        const { data, error } = await window.auth.getUser();

        if (error || !data.user) {
            // Usuário não está logado, redirecionar para login
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = '../login/login.html';
            return;
        }

        // Usuário está logado, exibir informações
        displayUserInfo(data.user);

    } catch (error) {
        console.error('Erro ao verificar login:', error);
        alert('Erro ao verificar autenticação. Redirecionando para login.');
        window.location.href = '../login/login.html';
    }
}

// Função para exibir as informações do usuário
function displayUserInfo(user) {
    // Usar email como username se não houver nome
    const username = user.user_metadata?.full_name || user.email.split('@')[0] || 'Usuário';
    document.getElementById('user-name').textContent = username;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-id').textContent = user.id;

    // Salvar dados atualizados no localStorage para compatibilidade
    const userData = {
        id: user.id,
        email: user.email,
        username: username
    };
    localStorage.setItem('user', JSON.stringify(userData));
}

// Função para deslogar o usuário usando Supabase
document.getElementById('logout-btn').addEventListener('click', async function() {
    await logoutUser();
});

async function logoutUser() {
    try {
        // Fazer logout com Supabase
        const { error } = await window.auth.signOut();

        if (error) {
            console.error('Erro no logout:', error);
            alert('Erro ao fazer logout. Tente novamente.');
            return;
        }

        // Limpar dados do localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');

        // Redirecionar para a página inicial
        window.location.href = '../inicio/inicio.html';

    } catch (error) {
        console.error('Erro no logout:', error);
        alert('Erro ao fazer logout. Tente novamente.');
    }
}
