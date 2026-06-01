(() => {
    'use strict';

    /* CONFIGURAÇÕES */

    const WHATSAPP_NUMERO = '5511999999999';

    const NOME_LOJA = 'Super Tech Store Apple';
    const CHAVE_CARRINHO = 'carrinho_sts';
    const CHAVE_TEMA = 'tema_sts';

    /* PRODUTOS — TOTAL 12 */

    const produtos = [
        {
            id: 1,
            nome: 'iPhone 15 Pro Max',
            descricao: 'Performance extrema com câmera avançada.',
            categoria: 'smartphones',
            categoriaLabel: 'Smartphone',
            preco: 8999,
            imagem: './iPhone 15 Pro.jpg'
        },

        {
            id: 2,
            nome: 'Samsung Galaxy S24',
            descricao: 'Potência e inteligência artificial avançada.',
            categoria: 'smartphones',
            categoriaLabel: 'Smartphone',
            preco: 2132,
            imagem: './Samsung Galaxy S24.webp'
        },

        {
            id: 3,
            nome: 'MacBook Pro',
            descricao: 'Alta performance para produtividade.',
            categoria: 'laptops',
            categoriaLabel: 'Notebook',
            preco: 12499,
            imagem: './MacBook Air M2.png'
        },

        {
            id: 4,
            nome: 'Dell XPS 13',
            descricao: 'Notebook premium ultrafino.',
            categoria: 'laptops',
            categoriaLabel: 'Notebook',
            preco: 4599,
            imagem: './Dell XPS 13.jpg'
        },

        {
            id: 5,
            nome: 'iPad Pro',
            descricao: 'Potência e mobilidade em um só dispositivo.',
            categoria: 'laptops',
            categoriaLabel: 'Tablet',
            preco: 15999,
            imagem: './Apple iPad Pro Wi-Fi de 12,9 polegadas (Wi-Fi, 256 GB) - Prateado.jpg'
        },

        {
            id: 6,
            nome: 'Tablet XP-Pen Magic Drawing Pad 2025',
            descricao: 'Tablet profissional para artistas.',
            categoria: 'laptops',
            categoriaLabel: 'Tablet',
            preco: 3949,
imagem: './Tablet XP-Pen Magic Drawing Pad 2025 Azul Android 14 com Caneta de 16K Níveis de Pressão MDP12.webp'
        },

        {
            id: 7,
            nome: 'AirPods Max',
            descricao: 'Áudio premium com cancelamento de ruído.',
            categoria: 'headphones',
            categoriaLabel: 'Fone Premium',
            preco: 4299,
            imagem: './AirPods Pro.jpg'
        },

        {
            id: 8,
            nome: 'Sony WH-1000XM5',
            descricao: 'Som imersivo e bateria duradoura.',
            categoria: 'headphones',
            categoriaLabel: 'Fone Premium',
            preco: 2399,
            imagem: './Sony WH-1000XM5.jpg'
        },

        {
            id: 9,
            nome: 'Apple Watch Ultra',
            descricao: 'Monitoramento inteligente premium.',
            categoria: 'smartwatch',
            categoriaLabel: 'Smartwatch',
            preco: 6199,
            imagem: './Apple Watch Série 9.webp'
        },

        {
            id: 10,
            nome: 'Magic Keyboard',
            descricao: 'Precisão e conforto profissional.',
            categoria: 'accessories',
            categoriaLabel: 'Acessório',
            preco: 1299,
            imagem: './Magic Keyboard.webp'
        },

        {
            id: 11,
            nome: 'Carregador MagSafe',
            descricao: 'Recarga rápida e sem fios.',
            categoria: 'accessories',
            categoriaLabel: 'Acessório',
            preco: 669.99,
            imagem: './Carregador MagSafe.webp'
        },

        {
            id: 12,
            nome: 'Capa de Silicone para iPhone',
            descricao: 'Proteção premium com toque macio.',
            categoria: 'accessories',
            categoriaLabel: 'Acessório',
            preco: 55.99,
            imagem: './Capa de Silicone para iPhone.webp'
        }
    ];

    /* HELPERS */

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    const formatarPreco = (valor) =>
        valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

    /* ELEMENTOS */

    const elementos = {
        produtosGrid: $('#produtos-grid'),
        produtosVazio: $('#produtos-vazio'),

        categoriaTitulo: $('#categoria-titulo'),
        categoriaContagem: $('#categoria-contagem'),

        buscaInput: $('#busca-input'),
        buscaLimpar: $('#busca-limpar'),

        categoriaBtns: $$('.categoria-btn'),

        abrirCarrinho: $('#abrir-carrinho'),
        fecharCarrinho: $('#fechar-carrinho'),

        carrinhoOverlay: $('#carrinho-overlay'),
        carrinhoLateral: $('#carrinho-lateral'),

        carrinhoCorpo: $('#carrinho-corpo'),
        carrinhoResumo: $('#carrinho-resumo'),

        carrinhoSubtotal: $('#carrinho-subtotal'),
        carrinhoTotal: $('#carrinho-total'),

        carrinhoBadge: $('#carrinho-badge'),

        finalizarBtn: $('#finalizar-pedido-btn'),

        toast: $('#toast'),
        toastMensagem: $('#toast-mensagem')
    };

    /* ESTADO */

    let carrinho = [];
    let categoriaAtiva = 'all';
    let termoBusca = '';

    /* LOCAL STORAGE */

    const carregarCarrinho = () => {
        carrinho = JSON.parse(localStorage.getItem(CHAVE_CARRINHO) || '[]');
    };

    const salvarCarrinho = () => {
        localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
    };

    /* TOAST */

    let toastTimer;

    const exibirToast = (mensagem) => {
        elementos.toastMensagem.textContent = mensagem;

        elementos.toast.classList.add('visivel');

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            elementos.toast.classList.remove('visivel');
        }, 2500);
    };

    /* RENDER PRODUTOS */

    const renderizarProdutos = () => {
        elementos.produtosGrid.innerHTML = produtos.map(produto => `
            <article class="produto-card" data-categoria="${produto.categoria}" data-nome="${produto.nome}">

                <div class="produto-imagem-container">
                    <img
                        src="${produto.imagem}"
                        alt="${produto.nome}"
                        class="produto-imagem"
                    />
                </div>

                <div class="produto-info">

                    <span class="produto-categoria">
                        ${produto.categoriaLabel}
                    </span>

                    <h4 class="produto-nome">
                        ${produto.nome}
                    </h4>

                    <p class="produto-descricao">
                        ${produto.descricao}
                    </p>

                    <div class="produto-rodape">

                        <strong class="produto-preco">
                            ${formatarPreco(produto.preco)}
                        </strong>

                        <button
                            class="produto-btn adicionar-carrinho"
                            data-id="${produto.id}">
                            <i class="fa-solid fa-cart-shopping"></i>
                            Comprar
                        </button>

                    </div>
                </div>
            </article>
        `).join('');
    };

    /* FILTRO */

    const filtrarProdutos = () => {

        const termo = termoBusca.toLowerCase();

        let visiveis = 0;

        $$('.produto-card').forEach(card => {

            const nome = card.dataset.nome.toLowerCase();
            const categoria = (card.dataset.categoria || '').toLowerCase();
            const categoriaTexto = ($('.produto-categoria', card)?.textContent || '').toLowerCase();

            const matchBusca =
                !termo ||
                nome.includes(termo) ||
                categoria.includes(termo) ||
                categoriaTexto.includes(termo);

            const matchCategoria =
                categoriaAtiva === 'all' ||
                categoria === categoriaAtiva;

            const mostrar =
                matchBusca && matchCategoria;

            card.style.display =
                mostrar ? '' : 'none';

            if (mostrar) visiveis++;
        });

        elementos.categoriaContagem.textContent =
            `${visiveis} itens`;

        elementos.produtosVazio.style.display =
            visiveis === 0 ? 'block' : 'none';
    };

    /* RENDER CARRINHO */

    const renderizarCarrinho = () => {

        const totalItens =
            carrinho.reduce((s, i) => s + i.quantidade, 0);

        elementos.carrinhoBadge.textContent = totalItens;

        elementos.carrinhoBadge.classList.toggle(
            'visivel',
            totalItens > 0
        );

        if (!carrinho.length) {

            elementos.carrinhoCorpo.innerHTML = `
                <div class="carrinho-vazio">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <h4>Seu carrinho está vazio</h4>
                </div>
            `;

            elementos.carrinhoResumo.style.display = 'none';

            elementos.finalizarBtn.disabled = true;

            return;
        }

        elementos.carrinhoCorpo.innerHTML = carrinho.map(item => `
            <div class="carrinho-item">

                <img
                    src="${item.imagem}"
                    class="carrinho-item-img"
                    alt="${item.nome}"
                />

                <div class="carrinho-item-info">

                    <span class="carrinho-item-nome">
                        ${item.nome}
                    </span>

                    <span class="carrinho-item-preco">
                        ${formatarPreco(item.preco)}
                    </span>

                    <div class="carrinho-item-controles">

                        <button
                            class="qtd-btn"
                            data-id="${item.id}"
                            data-acao="diminuir">
                            -
                        </button>

                        <span class="qtd-valor">
                            ${item.quantidade}
                        </span>

                        <button
                            class="qtd-btn"
                            data-id="${item.id}"
                            data-acao="aumentar">
                            +
                        </button>

                    </div>
                </div>

                <button
                    class="remover-item-btn"
                    data-id="${item.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `).join('');

        const total =
            carrinho.reduce(
                (s, i) => s + i.preco * i.quantidade,
                0
            );

        elementos.carrinhoSubtotal.textContent =
            formatarPreco(total);

        elementos.carrinhoTotal.textContent =
            formatarPreco(total);

        elementos.carrinhoResumo.style.display = 'block';

        elementos.finalizarBtn.disabled = false;
    };

    /* AÇÕES CARRINHO */

    const adicionarAoCarrinho = (id) => {

        const produto =
            produtos.find(p => p.id === id);

        if (!produto) return;

        const existente =
            carrinho.find(i => i.id === id);

        if (existente) {
            existente.quantidade++;
        } else {
            carrinho.push({
                ...produto,
                quantidade: 1
            });
        }

        salvarCarrinho();

        renderizarCarrinho();

        exibirToast(`${produto.nome} adicionado!`);
    };

    const alterarQuantidade = (id, delta) => {

        const item =
            carrinho.find(i => i.id === id);

        if (!item) return;

        item.quantidade += delta;

        if (item.quantidade <= 0) {
            carrinho =
                carrinho.filter(i => i.id !== id);
        }

        salvarCarrinho();

        renderizarCarrinho();
    };

    const removerItem = (id) => {

        carrinho =
            carrinho.filter(i => i.id !== id);

        salvarCarrinho();

        renderizarCarrinho();
    };

    /* ABRIR / FECHAR CARRINHO */

    const abrirCarrinho = () => {

        elementos.carrinhoLateral.classList.add('ativo');

        elementos.carrinhoOverlay.classList.add('ativo');

        document.body.classList.add('no-scroll');
    };

    const fecharCarrinho = () => {

        elementos.carrinhoLateral.classList.remove('ativo');

        elementos.carrinhoOverlay.classList.remove('ativo');

        document.body.classList.remove('no-scroll');
    };

    /* WHATSAPP */

    const finalizarPedido = () => {

        if (!carrinho.length) return;

        let mensagem =
            `🛒 Pedido — ${NOME_LOJA}\n\n`;

        carrinho.forEach(item => {

            mensagem +=
                `• ${item.nome}\n`;

            mensagem +=
                `Qtd: ${item.quantidade}\n`;

            mensagem +=
                `Subtotal: ${formatarPreco(item.preco * item.quantidade)}\n\n`;
        });

        const total =
            carrinho.reduce(
                (s, i) => s + i.preco * i.quantidade,
                0
            );

        mensagem += `💰 Total: ${formatarPreco(total)}`;

        const url =
            `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, '_blank');
    };

    /* EVENTOS */

    const registrarEventos = () => {

        elementos.buscaInput?.addEventListener('input', e => {
            termoBusca = e.target.value;
            filtrarProdutos();
        });

        elementos.buscaLimpar?.addEventListener('click', () => {

            elementos.buscaInput.value = '';

            termoBusca = '';

            filtrarProdutos();
        });

        elementos.categoriaBtns.forEach(btn => {

            btn.addEventListener('click', () => {

                elementos.categoriaBtns.forEach(b =>
                    b.classList.remove('ativa')
                );

                btn.classList.add('ativa');

                categoriaAtiva =
                    btn.dataset.categoria;

                filtrarProdutos();
            });
        });

        elementos.produtosGrid?.addEventListener('click', e => {

            const btn =
                e.target.closest('.adicionar-carrinho');

            if (!btn) return;

            adicionarAoCarrinho(
                Number(btn.dataset.id)
            );
        });

        elementos.carrinhoCorpo?.addEventListener('click', e => {

            const qtdBtn =
                e.target.closest('.qtd-btn');

            const removerBtn =
                e.target.closest('.remover-item-btn');

            if (qtdBtn) {

                alterarQuantidade(
                    Number(qtdBtn.dataset.id),
                    qtdBtn.dataset.acao === 'aumentar'
                        ? 1
                        : -1
                );
            }

            if (removerBtn) {

                removerItem(
                    Number(removerBtn.dataset.id)
                );
            }
        });

        elementos.abrirCarrinho?.addEventListener(
            'click',
            abrirCarrinho
        );

        elementos.fecharCarrinho?.addEventListener(
            'click',
            fecharCarrinho
        );

        elementos.carrinhoOverlay?.addEventListener(
            'click',
            fecharCarrinho
        );

        elementos.finalizarBtn?.addEventListener(
            'click',
            finalizarPedido
        );
    };

    /* INICIALIZAÇÃO */

    const inicializar = () => {

        carregarCarrinho();

        renderizarProdutos();

        renderizarCarrinho();

        registrarEventos();

        filtrarProdutos();

        // Carrinho sempre no lado direito
        const carrinhoLateral = document.querySelector('.carrinho-lateral');

        if (carrinhoLateral) {
            carrinhoLateral.style.right = '0';
            carrinhoLateral.style.left = 'auto';
        }
    };

    document.addEventListener(
        'DOMContentLoaded',
        inicializar
    );

})();

