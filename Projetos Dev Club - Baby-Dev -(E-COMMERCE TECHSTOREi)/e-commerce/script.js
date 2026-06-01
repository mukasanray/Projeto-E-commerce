/* ============================================================
   SUPER TECH STORE APPLE — SCRIPT PRINCIPAL
   Autor: Samuel
   Funcionalidades: catálogo, busca, filtro, carrinho, tema,
   persistência (localStorage) e finalização via WhatsApp.
============================================================ */

(() => {
    'use strict';

    /* ============================================================
       1. CONFIGURAÇÃO — ALTERE AQUI
    ============================================================ */

    // ⚠️ COLOQUE AQUI O NÚMERO REAL DA LOJA NO FORMATO INTERNACIONAL
    // Formato: código do país + DDD + número (sem espaços, traços ou parênteses)
    // Exemplo Brasil: '5511999999999'
    const WHATSAPP_NUMERO = '5511999999999';

    const NOME_LOJA = 'Super Tech Store Apple';
    const CHAVE_CARRINHO = 'carrinho_sts';
    const CHAVE_TEMA = 'tema_sts';

    /* ============================================================
       2. CATÁLOGO DE PRODUTOS
    ============================================================ */
    const produtos = [
        {
            id: 1,
            nome: 'iPhone 15 Pro Max',
            descricao: 'Performance extrema com câmera avançada e chip A17 Pro.',
            categoria: 'smartphones',
            categoriaLabel: 'Smartphone',
            preco: 8999,
            imagem: 'img/iphone.png'
        },
        {
            id: 2,
            nome: 'MacBook Pro',
            descricao: 'Alta performance para produtividade profissional.',
            categoria: 'laptops',
            categoriaLabel: 'Notebook',
            preco: 12499,
            imagem: 'img/macbook.png'
        },
        {
            id: 3,
            nome: 'AirPods Max',
            descricao: 'Áudio imersivo com cancelamento ativo de ruído.',
            categoria: 'headphones',
            categoriaLabel: 'Fone Premium',
            preco: 4299,
            imagem: 'img/airpods.png'
        },
        {
            id: 4,
            nome: 'Apple Watch Ultra',
            descricao: 'Monitoramento inteligente com design premium.',
            categoria: 'smartwatch',
            categoriaLabel: 'Smartwatch',
            preco: 6199,
            imagem: 'img/watch.png'
        },
        {
            id: 5,
            nome: 'Magic Keyboard',
            descricao: 'Precisão e conforto para máxima produtividade.',
            categoria: 'accessories',
            categoriaLabel: 'Acessório',
            preco: 1299,
            imagem: 'img/keyboard.png'
        },
        {
            id: 6,
            nome: 'iPad Pro',
            descricao: 'Potência e mobilidade em um só dispositivo.',
            categoria: 'laptops',
            categoriaLabel: 'Tablet',
            preco: 7599,
            imagem: 'img/ipad.png'
        }
    ];

    /* Helpers */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    const formatarPreco = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '<', '>': '>', '"': '"', "'": '&#39;' }[c]));

    // Config



    /* ============================================================
       4. ELEMENTOS DO DOM
    ============================================================ */
    const elementos = {
        // Cabeçalho
        botaoTema: $('#botao-tema'),
        buscaInput: $('#busca-input'),
        buscaLimpar: $('#busca-limpar'),

        // Carrinho
        abrirCarrinho: $('#abrir-carrinho'),
        fecharCarrinho: $('#fechar-carrinho'),
        carrinhoOverlay: $('#carrinho-overlay'),
        carrinhoLateral: $('#carrinho-lateral'),
        carrinhoCorpo: $('#carrinho-corpo'),
        carrinhoResumo: $('#carrinho-resumo'),
        carrinhoBadge: $('#carrinho-badge'),
        carrinhoSubtotal: $('#carrinho-subtotal'),
        carrinhoTotal: $('#carrinho-total'),
        finalizarBtn: $('#finalizar-pedido-btn'),

        // Produtos
        produtosGrid: $('#produtos-grid'),
        produtosVazio: $('#produtos-vazio'),
        categoriaTitulo: $('#categoria-titulo'),
        categoriaContagem: $('#categoria-contagem'),
        categoriaBtns: $$('.categoria-btn'),

        // Toast
        toast: $('#toast'),
        toastMensagem: $('#toast-mensagem')
    };

    /* ============================================================
       5. ESTADO DA APLICAÇÃO
    ============================================================ */
    let carrinho = [];
    let categoriaAtiva = 'all';
    let termoBusca = '';

    const labelsCategorias = {
        all: 'Todos os produtos',
        smartphones: 'Smartphones',
        laptops: 'Notebooks',
        headphones: 'Fones de Ouvido',
        smartwatch: 'Smartwatches',
        accessories: 'Acessórios'
    };

    /* ============================================================
       6. PERSISTÊNCIA (LOCALSTORAGE)
    ============================================================ */
    const carregarCarrinho = () => {
        try {
            const dados = localStorage.getItem(CHAVE_CARRINHO);
            carrinho = dados ? JSON.parse(dados) : [];
        } catch (e) {
            console.warn('Erro ao carregar carrinho:', e);
            carrinho = [];
        }
    };

    const salvarCarrinho = () => {
        try {
            localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
        } catch (e) {
            console.warn('Erro ao salvar carrinho:', e);
        }
    };

    /* ============================================================
       7. TEMA (CLARO / ESCURO)
    ============================================================ */
    const aplicarTema = (tema) => {
        document.documentElement.setAttribute('data-tema', tema);
        const icone = elementos.botaoTema?.querySelector('i');
        if (icone) {
            icone.className = tema === 'escuro' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }

        try {
            localStorage.setItem(CHAVE_TEMA, tema);
        } catch {
            /* ignore */
        }
    };

    const inicializarTema = () => {
        let temaSalvo;
        try {
            temaSalvo = localStorage.getItem(CHAVE_TEMA);
        } catch {
            temaSalvo = null;
        }

        if (!temaSalvo) {
            temaSalvo = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'escuro'
                : 'claro';
        }
        aplicarTema(temaSalvo);
    };

    const alternarTema = () => {
        const atual = document.documentElement.getAttribute('data-tema');
        aplicarTema(atual === 'escuro' ? 'claro' : 'escuro');
    };

    /* ============================================================
       8. TOAST DE NOTIFICAÇÃO
    ============================================================ */
    let toastTimer = null;

    const exibirToast = (mensagem, icone = 'fa-circle-check', cor = 'var(--cor-sucesso)') => {
        if (!elementos.toast) return;

        const iEl = elementos.toast.querySelector('i');
        if (iEl) {
            iEl.className = `fa-solid ${icone}`;
            iEl.style.color = cor;
        }
        elementos.toastMensagem.textContent = mensagem;
        elementos.toast.classList.add('visivel');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            elementos.toast.classList.remove('visivel');
        }, 2500);
    };

    /* ============================================================
       9. RENDERIZAÇÃO DE PRODUTOS
    ============================================================ */
    const renderizarProdutos = () => {
        if (!elementos.produtosGrid) return;

        elementos.produtosGrid.innerHTML = produtos.map((p) => `
            <article class="produto-card"
                     data-categoria="${escapeHTML(p.categoria)}"
                     data-nome="${escapeHTML(p.nome)}"
                     data-id="${p.id}">
                <div class="produto-imagem-container">
                    <img src="${escapeHTML(p.imagem)}"
                         alt="${escapeHTML(p.nome)}"
                         class="produto-imagem"
                         loading="lazy"
                         onerror="this.style.opacity='0.3';this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23ccc%22><path d=%22M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z%22/></svg>'" />
                </div>
                <div class="produto-info">
                    <span class="produto-categoria">${escapeHTML(p.categoriaLabel)}</span>
                    <h4 class="produto-nome">${escapeHTML(p.nome)}</h4>
                    <p class="produto-descricao">${escapeHTML(p.descricao)}</p>
                    <div class="produto-rodape">
                        <strong class="produto-preco">${formatarPreco(p.preco)}</strong>
                        <button class="produto-btn adicionar-carrinho"
                                data-id="${p.id}"
                                aria-label="Adicionar ${escapeHTML(p.nome)} ao carrinho">
                            <i class="fa-solid fa-cart-shopping"></i>
                            <span>Comprar</span>
                        </button>
                    </div>
                </div>
            </article>
        `).join('');
    };

    /* ============================================================
       10. FILTRO (CATEGORIA + BUSCA)
    ============================================================ */
    const filtrarProdutos = () => {
        const termo = termoBusca.trim().toLowerCase();
        let visiveis = 0;

        $$('.produto-card').forEach((card) => {
            const nome = (card.dataset.nome || '').toLowerCase();
            const categoria = card.dataset.categoria || '';

            const matchBusca = !termo || nome.includes(termo);
            const matchCategoria = categoriaAtiva === 'all' || categoria === categoriaAtiva;

            const visivel = matchBusca && matchCategoria;
            card.style.display = visivel ? '' : 'none';
            if (visivel) visiveis++;
        });

        if (elementos.produtosVazio) {
            elementos.produtosVazio.style.display = visiveis === 0 ? 'block' : 'none';
        }
        if (elementos.produtosGrid) {
            elementos.produtosGrid.style.display = visiveis === 0 ? 'none' : 'grid';
        }

        if (elementos.categoriaContagem) {
            elementos.categoriaContagem.textContent =
                `${visiveis} ${visiveis === 1 ? 'item' : 'itens'}`;
        }

        if (elementos.categoriaTitulo) {
            elementos.categoriaTitulo.textContent = labelsCategorias[categoriaAtiva] || 'Produtos';
        }

        if (elementos.buscaLimpar) {
            elementos.buscaLimpar.classList.toggle('visivel', termo.length > 0);
        }
    };

    /* ============================================================
       11. CARRINHO — RENDERIZAR
    ============================================================ */
    const renderizarCarrinho = () => {
        const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);
        if (elementos.carrinhoBadge) {
            elementos.carrinhoBadge.textContent = totalItens;
            elementos.carrinhoBadge.classList.toggle('visivel', totalItens > 0);
        }

        if (carrinho.length === 0) {
            if (elementos.carrinhoCorpo) {
                elementos.carrinhoCorpo.innerHTML = `
                    <div class="carrinho-vazio">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <h4>Seu carrinho está vazio</h4>
                        <p>Adicione produtos para começar.</p>
                    </div>`;
            }
            if (elementos.carrinhoResumo) elementos.carrinhoResumo.style.display = 'none';
            if (elementos.finalizarBtn) elementos.finalizarBtn.disabled = true;
            return;
        }

        if (elementos.carrinhoCorpo) {
            elementos.carrinhoCorpo.innerHTML = carrinho.map((item) => `
                <div class="carrinho-item" data-id="${item.id}">
                    <img src="${escapeHTML(item.imagem)}"
                         alt="${escapeHTML(item.nome)}"
                         class="carrinho-item-img"
                         onerror="this.style.opacity='0.4';" />

                    <div class="carrinho-item-info">
                        <span class="carrinho-item-nome">${escapeHTML(item.nome)}</span>
                        <span class="carrinho-item-preco">${formatarPreco(item.preco)}</span>

                        <div class="carrinho-item-controles">
                            <button class="qtd-btn" data-acao="diminuir" data-id="${item.id}" aria-label="Diminuir quantidade">
                                <i class="fa-solid fa-minus"></i>
                            </button>
                            <span class="qtd-valor">${item.quantidade}</span>
                            <button class="qtd-btn" data-acao="aumentar" data-id="${item.id}" aria-label="Aumentar quantidade">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <button class="remover-item-btn" data-id="${item.id}" aria-label="Remover ${escapeHTML(item.nome)}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        const subtotal = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
        if (elementos.carrinhoSubtotal) elementos.carrinhoSubtotal.textContent = formatarPreco(subtotal);
        if (elementos.carrinhoTotal) elementos.carrinhoTotal.textContent = formatarPreco(subtotal);
        if (elementos.carrinhoResumo) elementos.carrinhoResumo.style.display = 'block';
        if (elementos.finalizarBtn) elementos.finalizarBtn.disabled = false;
    };

    /* ============================================================
       12. CARRINHO — AÇÕES
    ============================================================ */
    const adicionarAoCarrinho = (id) => {
        const produto = produtos.find((p) => p.id === id);
        if (!produto) return;

        const existente = carrinho.find((i) => i.id === id);
        if (existente) {
            existente.quantidade += 1;
        } else {
            carrinho.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                quantidade: 1
            });
        }

        salvarCarrinho();
        renderizarCarrinho();
        animarBadge();
        exibirToast(`${produto.nome} adicionado!`);
    };

    const alterarQuantidade = (id, delta) => {
        const item = carrinho.find((i) => i.id === id);
        if (!item) return;

        item.quantidade += delta;
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter((i) => i.id !== id);
        }

        salvarCarrinho();
        renderizarCarrinho();
    };

    const removerDoCarrinho = (id) => {
        const item = carrinho.find((i) => i.id === id);
        carrinho = carrinho.filter((i) => i.id !== id);
        salvarCarrinho();
        renderizarCarrinho();

        if (item) {
            exibirToast(`${item.nome} removido`, 'fa-trash', 'var(--cor-erro)');
        }
    };

    const animarBadge = () => {
        if (!elementos.carrinhoBadge) return;
        elementos.carrinhoBadge.classList.remove('pulsar');
        elementos.carrinhoBadge.offsetWidth; // reflow
        elementos.carrinhoBadge.classList.add('pulsar');
    };

    /* ============================================================
       13. CARRINHO — UI (ABRIR / FECHAR)
    ============================================================ */
    const abrirCarrinho = () => {
        elementos.carrinhoLateral?.classList.add('ativo');
        elementos.carrinhoOverlay?.classList.add('ativo');
        document.body.classList.add('no-scroll');
    };

    const fecharCarrinho = () => {
        elementos.carrinhoLateral?.classList.remove('ativo');
        elementos.carrinhoOverlay?.classList.remove('ativo');
        document.body.classList.remove('no-scroll');
    };

    /* ============================================================
       14. FINALIZAÇÃO — WHATSAPP
    ============================================================ */
    const finalizarPedido = () => {
        if (carrinho.length === 0) return;

        let mensagem = `🛒 *Pedido — ${NOME_LOJA}*\n\n`;
        mensagem += `*Itens do pedido:*\n`;

        carrinho.forEach((item, index) => {
            const subtotalItem = item.preco * item.quantidade;
            mensagem += `\n${index + 1}. *${item.nome}*\n`;
            mensagem += `   Qtd: ${item.quantidade} × ${formatarPreco(item.preco)}\n`;
            mensagem += `   Subtotal: ${formatarPreco(subtotalItem)}\n`;
        });

        const total = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
        const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);

        mensagem += `\n━━━━━━━━━━━━━━━━━━\n`;
        mensagem += `📦 *Total de itens:* ${totalItens}\n`;
        mensagem += `💰 *Valor total:* ${formatarPreco(total)}\n\n`;
        mensagem += `Aguardo confirmação. Obrigado! 🙌`;

        const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    /* ============================================================
       15. EVENT LISTENERS
    ============================================================ */
    const registrarEventos = () => {
        // ----- TEMA -----
        elementos.botaoTema?.addEventListener('click', alternarTema);

        // ----- BUSCA -----
        elementos.buscaInput?.addEventListener('input', (e) => {
            termoBusca = e.target.value;
            filtrarProdutos();
        });

        elementos.buscaLimpar?.addEventListener('click', () => {
            if (elementos.buscaInput) {
                elementos.buscaInput.value = '';
                termoBusca = '';
                filtrarProdutos();
                elementos.buscaInput.focus();
            }
        });

        // ----- CATEGORIAS -----
        elementos.categoriaBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                elementos.categoriaBtns.forEach((b) => b.classList.remove('ativa'));
                btn.classList.add('ativa');
                categoriaAtiva = btn.dataset.categoria || 'all';
                filtrarProdutos();

                $('#produtos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // ----- ADICIONAR AO CARRINHO (delegação) -----
        elementos.produtosGrid?.addEventListener('click', (e) => {
            const btn = e.target.closest('.adicionar-carrinho');
            if (!btn) return;

            const id = parseInt(btn.dataset.id, 10);
            if (!Number.isNaN(id)) adicionarAoCarrinho(id);
        });

        // ----- CARRINHO: ABRIR / FECHAR -----
        elementos.abrirCarrinho?.addEventListener('click', abrirCarrinho);
        elementos.fecharCarrinho?.addEventListener('click', fecharCarrinho);
        elementos.carrinhoOverlay?.addEventListener('click', fecharCarrinho);

        // ESC fecha o carrinho
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elementos.carrinhoLateral?.classList.contains('ativo')) {
                fecharCarrinho();
            }
        });

        // ----- CONTROLES DENTRO DO CARRINHO (delegação) -----
        elementos.carrinhoCorpo?.addEventListener('click', (e) => {
            const btnQtd = e.target.closest('.qtd-btn');
            const btnRemover = e.target.closest('.remover-item-btn');

            if (btnQtd) {
                const id = parseInt(btnQtd.dataset.id, 10);
                const acao = btnQtd.dataset.acao;
                if (!Number.isNaN(id)) {
                    alterarQuantidade(id, acao === 'aumentar' ? 1 : -1);
                }
                return;
            }

            if (btnRemover) {
                const id = parseInt(btnRemover.dataset.id, 10);
                if (!Number.isNaN(id)) removerDoCarrinho(id);
            }
        });

        // ----- FINALIZAR PEDIDO -----
        elementos.finalizarBtn?.addEventListener('click', finalizarPedido);

        // ----- SCROLL SUAVE PARA ÂNCORAS -----
        $$('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.length > 1) {
                    const alvo = $(href);
                    if (alvo) {
                        e.preventDefault();
                        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    };

    /* ============================================================
       16. INICIALIZAÇÃO
    ============================================================ */
    const inicializar = () => {
        inicializarTema();
        carregarCarrinho();
        renderizarProdutos();
        renderizarCarrinho();
        registrarEventos();
        filtrarProdutos();

        if (WHATSAPP_NUMERO === '5511999999999') {
            console.warn(
                '⚠️ ATENÇÃO: O número do WhatsApp ainda é o exemplo padrão.\n' +
                'Edite a constante WHATSAPP_NUMERO no script.js com o número real da loja.'
            );
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }

})();

