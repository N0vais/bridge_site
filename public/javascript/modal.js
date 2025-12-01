document.addEventListener('DOMContentLoaded', () => {

    const loginOverlay = document.getElementById('loginOverlay');
    const openButton = document.getElementById('openLoginButton');
    const closeButton = document.getElementById('closeLoginButton');

    const profileSelection = document.getElementById('profile-selection');
    const loginFormArea = document.getElementById('login-form');
    const form = document.getElementById('form');

    // ----------------------------
    // ABRIR E FECHAR MODAL
    // ----------------------------

    function openModal() {
        loginOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        loginOverlay.classList.remove('visible');
        document.body.style.overflow = 'auto';
    }

    if (openButton) {
        openButton.addEventListener('click', e => {
            e.preventDefault();
            openModal();
        });
    }

    closeButton.addEventListener('click', closeModal);

    loginOverlay.addEventListener('click', e => {
        if (e.target === loginOverlay) closeModal();
    });

    // ----------------------------
    // TROCAR DE PERFIL
    // ----------------------------

    const texts = {
        aluno: {
            title: "Acesso do Aluno",
            subtitle: "Use seu RA ou e-mail institucional.",
            button: "ENTRAR COMO ALUNO"
        },
        gerente: {
            title: "Acesso do Gerente",
            subtitle: "Use sua matrícula funcional ou e-mail.",
            button: "ENTRAR COMO GERENTE"
        },
        empresa: {
            title: "Acesso da Empresa",
            subtitle: "Use seu usuário ou e-mail.",
            button: "ENTRAR COMO EMPRESA"
        }
    };

    document.querySelectorAll('.profile-card').forEach(card => {
        card.addEventListener('click', () => {
            const selectedProfile = card.dataset.profile;

            localStorage.setItem('selectedProfile', selectedProfile);

            profileSelection.classList.remove('active');

            setTimeout(() => {
                document.getElementById('login-title').textContent = texts[selectedProfile].title;
                document.getElementById('login-subtitle').textContent = texts[selectedProfile].subtitle;

                const btn = document.getElementById('login-button');
                btn.textContent = texts[selectedProfile].button;

                loginFormArea.classList.add('active');
            }, 300);
        });
    });

    // ----------------------------
    // VOLTAR
    // ----------------------------

    window.resetPage = function () {
        loginFormArea.classList.remove('active');

        setTimeout(() => {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            profileSelection.classList.add('active');
        }, 300);
    };

    // ----------------------------
    // LOGIN — CORRIGIDO
    // ----------------------------

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const profile = localStorage.getItem('selectedProfile');
        const email = document.getElementById('username').value;
        const senha = document.getElementById('password').value;

        if (!profile || !email || !senha) {
            alert("Preencha todos os campos e selecione um perfil.");
            return;
        }

        try {
            const response = await fetch('/alunos/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha, profile })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                alert(data.message || "Login inválido.");
                return;
            }
            const userRole = data.role;
               
                
            // SALVAR NO LOCALSTORAGE
            localStorage.setItem("usuario_nome", data.profileData.nome);
            localStorage.setItem("usuario_tipo", data.role);

            // REDIRECIONAR
           if (userRole === 'aluno') {
                    // Para alunos: Passa o parâmetro "role=aluno"
                    targetPage = '/restrict/portalAluno.html';
                } else if (userRole === 'empresa') {
                    targetPage = '/restrict/portalEmpresa.html';
                } else if (userRole === 'gerente') {
                    // Para gerentes: Passa o parâmetro "role=gerente"
                    targetPage = '/restrict/portalGerente.html';
                }

                console.log('esta redirecionando para', targetPage);
                window.location.href = targetPage;

        } catch (err) {
            console.error("ERRO DE CONEXÃO:", err);
            alert("Falha ao conectar ao servidor. Backend está rodando?");
        }

    });

});
//este e o arquivo otimizado