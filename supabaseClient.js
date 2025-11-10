// supabaseClient.js
// Arquivo de configuração para conectar ao Supabase
// Substitua os placeholders pelas suas chaves reais do Supabase

// Importar o Supabase (usando CDN no HTML ou npm se for um projeto Node.js)
// Para projetos estáticos, adicione no HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// Configurações do Supabase - SUBSTITUA PELAS SUAS CHAVES REAIS
const supabaseUrl = 'https://gxrqklgmrvqlzddjzmtx.supabase.co'; // URL do seu projeto Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cnFrbGdtcnZxbHpkZGp6bXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NjIzNTksImV4cCI6MjA3ODMzODM1OX0.PucUGopxYfT0Rv5Kloa_FmdSkhFIlqoKS1QJwQ76nOQ'; // Chave anônima (anon key) do Supabase

// Criar cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Exportar o cliente para uso em outros arquivos
window.supabase = supabase; // Para acesso global em projetos vanilla JS

// Funções de autenticação utilitárias
const auth = {
    // Cadastro de usuário
    async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        return { data, error };
    },

    // Login de usuário
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        return { data, error };
    },

    // Logout
    async signOut() {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    // Obter usuário atual
    async getUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    },

    // Escutar mudanças de estado de autenticação (opcional)
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    },

    // Login com Google (opcional)
    async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        return { data, error };
    }
};

// Exportar funções de auth
window.auth = auth;
