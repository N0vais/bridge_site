
        // Função principal para alternar o menu
        function toggleMenu() {
            // 1. Seleciona os elementos
            const sidebar = document.getElementById('mySidebar');
            const icon = document.querySelector('#menuToggle i'); // Seleciona o elemento <i> dentro do link
            const mainContent = document.getElementById('mainContent');
            // 2. Alterna a classe 'open' na sidebar
            sidebar.classList.toggle('open');
            mainContent.classList.toggle('pushed');
            // 3. Verifica se a sidebar está aberta e muda o ícone
            if (sidebar.classList.contains('open')) {
                // Se estiver aberta, muda o ícone para 'X' (times)
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // 'fa-times' é o ícone de 'X' ou fechar
            } else {
                // Se estiver fechada, muda o ícone de volta para o hambúrguer
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }


        // 4. Adiciona um "ouvinte de evento" ao link do hambúrguer
        document.getElementById('menuToggle').addEventListener('click', function (event) {
            event.preventDefault(); // Impede o link de navegar ou rolar para o topo
            toggleMenu(); // Chama a função que faz toda a mágica
        });

        //logout da pagina
        document.getElementById('logout-button').addEventListener('click', async (e) => {
            e.preventDefault();

            try {
                const response = await fetch('/alunos/logout', {
                    method: 'POST', // Use POST ou GET, dependendo de como você configurou a rota
                    // Não é necessário enviar headers de autenticação, pois o cookie será enviado automaticamente
                });

                // Não precisamos do JSON de resposta, apenas do status 200 (OK)
                if (response.ok) {
                    // 1. O servidor limpou o cookie

                    // 2. Redireciona o usuário para a página inicial (pública)
                    window.location.href = '/';
                } else {
                    alert('Erro ao fazer logout. Tente novamente.');
                }
            } catch (err) {
                console.error('Erro de rede ou servidor:', err);
                alert('Falha na conexão com o servidor.');
            }
        });

        // acrescentando o nome e atributo do banco logado na pagina html
        document.addEventListener("DOMContentLoaded", () => {
            const nome = localStorage.getItem("usuario_nome");
            const tipo = localStorage.getItem("usuario_tipo");

            if (nome) {
                document.getElementById("userName").textContent = `${nome} `;
                document.getElementById("userRole").textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);

                const tituloElement = document.getElementById("userNameTitle");
                if(tituloElement) {
                tituloElement.textContent = nome;
                }
            }
        });

        const profilePic = document.getElementById("profilePic");
        const fileInput = document.getElementById("fileInput");

        // Clicar na imagem abre o seletor
        profilePic.addEventListener("click", () => fileInput.click());

        // Quando o usuário escolhe a imagem
        fileInput.addEventListener("change", async () => {
            const file = fileInput.files[0];

            if (!file) return;

            // Previsualiza na hora
            profilePic.src = URL.createObjectURL(file);

            // Envia para o servidor
            const formData = new FormData();
            formData.append("foto", file);

            const response = await fetch("upload_foto.php", {
                method: "POST",
                body: formData
            });

            const result = await response.text();
            console.log(result);
        });

        
    // Função genérica para carregar páginas
    async function carregarPagina(event, url) {
        event.preventDefault(); // 1. Impede o link de abrir uma nova página normal

        try {
            // 2. Busca o conteúdo da outra página
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Erro ao carregar a página');

            const textoHtml = await response.text();

            // 3. Converte o texto em um documento HTML virtual para podermos filtrar
            const parser = new DOMParser();
            const doc = parser.parseFromString(textoHtml, 'text/html');

            // 4. Seleciona APENAS o conteúdo que interessa da outra página
            // Tenta pegar o conteúdo de uma div principal ou o body inteiro se não achar
            // NOTA: Se na propostas.html o conteúdo principal tiver um ID ou classe específica, mude aqui.
            // Exemplo: doc.querySelector('.conteudo-propostas')
            const novoConteudo = doc.querySelector('#mainContent') ? doc.querySelector('#mainContent').innerHTML : doc.body.innerHTML;

            // 5. Injeta no seu main atual
            document.getElementById('mainContent').innerHTML = novoConteudo;

        } catch (error) {
            console.error(error);
            document.getElementById('mainContent').innerHTML = '<p>Erro ao carregar o conteúdo.</p>';
        }
    }

    // Opcional: Adiciona o evento a todos os links do menu automaticamente
    document.querySelectorAll('.switcher a, .nav-item a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Verifica se o link é interno (não é logout, nem link vazio)
            const href = this.getAttribute('href');
            if (href && href !== '#' && !href.includes('logout')) {
                carregarPagina(e, href);
            }
        });
    });


   