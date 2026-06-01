# SDD — Super Tech Store (MVC + GSD) | Estrutura Funcional e Testes E2E

## 1) Objetivo do Site (o que ele precisa fazer)
1. Exibir um catálogo de produtos.
2. Permitir **busca** por texto (filtra por nome).
3. Permitir **filtro por categoria** (botões). 
4. Permitir **adicionar/remover** itens no carrinho.
5. Permitir **alterar quantidade** no carrinho.
6. Exibir **subtotal e total** do carrinho.
7. Permitir **finalizar pedido** abrindo WhatsApp com mensagem gerada.
8. Possuir **tema claro/escuro** persistido (localStorage).
9. Mostrar **toast** ao adicionar/remover itens.
10. Ser **100% responsivo**.

## 2) MVC (organização pretendida)
> Observação: o projeto atual é vanilla (JS no browser). Mesmo assim, organizaremos mentalmente em:
- **Model**: dados e estado (produtos, carrinho, tema).
- **View**: renderização/DOM (cards de produto, UI do carrinho, toast).
- **Controller**: eventos (clique, busca, categoria, tema, finalizar).

### 2.1 Model (ex.: em `script.js`)
- `produtos`: array fixo.
- `carrinho`: array persistido.
- `categoriaAtiva`, `termoBusca`.
- utilitários puros:
  - `formatarPreco`, `escapeHTML`
  - `carregarCarrinho`, `salvarCarrinho`

### 2.2 View (ex.: funções de renderização)
- `renderizarProdutos()`
- `filtrarProdutos()`
- `renderizarCarrinho()`
- `exibirToast()`
- `aplicarTema()`

### 2.3 Controller (ex.: eventos)
- registrar eventos:
  - `botaoTema` (alternar)
  - `buscaInput` (input)
  - `buscaLimpar` (click)
  - `.categoria-btn` (click)
  - delegação para `.adicionar-carrinho`
  - delegação para `.qtd-btn` e `.remover-item-btn`
  - `finalizarBtn` (click)
  - ESC fecha carrinho

## 3) GSD — Planejamento executável + validações ponta-a-ponta (E2E)

### 3.1 Framework “GSD”
- **Status**: não existe um pacote “GSD” amplamente conhecido para instalar via npm/pip nesse contexto.
- Como consequência, vou implementar o equivalente no repositório criando este arquivo de etapas (SDD) com:
  - definição de tarefas
  - critérios de aceite
  - testes de validação E2E (manuais e/ou automatizáveis via console)

> Se você quiser instalar um framework específico chamado “GSD” via npm, informe a referência (nome do pacote/repo) para eu ajustar.

### 3.2 Critérios de aceite por recurso
- **Carrinho**:
  - adicionar aumenta badge e renderiza item
  - aumentar/diminuir altera quantidade
  - quantidade chega a 0 remove item
  - remover remove item e recalcula totais
- **UI**:
  - carrinho vazio mostra estado correto
  - overlay e painel abrem/fecham
- **WhatsApp**:
  - abre nova aba com URL `wa.me/NUM?text=`
  - mensagem inclui itens, qty e totais
- **Busca**:
  - busca filtra por nome
  - limpar remove filtro e volta lista
- **Categorias**:
  - botão ativa altera título e filtra
- **Tema**:
  - alterna claro/escuro
  - persiste em localStorage
- **Responsivo**:
  - layout não quebra em 480px e 768px

## 4) Testes E2E (ponta-a-ponta)

### 4.1 Setup de validação (manual)
1. Abrir `e-commerce/index.html` no navegador.
2. (Opcional) Abrir DevTools > Console.

### 4.2 Testes principais
#### T1 — Render inicial
- Esperado:
  - cards aparecem
  - carrinho mostra vazio
  - badge começa em 0

#### T2 — Categoria
- Ação:
  - clicar em “Smartphones”
- Esperado:
  - apenas itens da categoria aparecem
  - contador e título atualizam

#### T3 — Busca
- Ação:
  - buscar “iPhone”
- Esperado:
  - apenas cards com nome contendo “iPhone” aparecem

#### T4 — Limpar busca
- Ação:
  - clicar no botão de limpar
- Esperado:
  - lista volta a mostrar todos da categoria ativa

#### T5 — Adicionar ao carrinho
- Ação:
  - clicar “Comprar” em um card
- Esperado:
  - badge aumenta
  - carrinho mostra item
  - toast aparece

#### T6 — Quantidade
- Ação:
  - clicar “+” até aumentar qtd
  - clicar “-” até remover
- Esperado:
  - totais recalculam
  - item some quando qtd <= 0

#### T7 — Remover item
- Ação:
  - clicar na lixeira
- Esperado:
  - item some, badge e totais atualizam

#### T8 — Finalizar
- Ação:
  - clicar “Finalizar Pedido”
- Esperado:
  - abre WhatsApp com mensagem contendo itens e totais

#### T9 — Tema
- Ação:
  - alternar tema
  - recarregar página
- Esperado:
  - tema persiste

#### T10 — Responsivo
- Ação:
  - inspecionar em 768px e 480px
- Esperado:
  - grid e navegação se ajustam sem overflow horizontal

## 5) Plano de execução (passo a passo)
1. Revisar `e-commerce/script.js` e `e-commerce/index.html`:
   - garantir fechamentos/estrutura ({} () e tags)
2. Otimizar `e-commerce/script.js`:
   - remover linhas redundantes
   - compactar lógica sem alterar comportamento
   - manter comentários curtos (1-2 palavras)
3. Otimizar `e-commerce/index.html`:
   - reduzir/limpar comentários inline
   - manter `<script>` inline consistente com a versão final do `script.js`
4. Otimizar `e-commerce/style.css` se houver duplicações/linhas redundantes.
5. Verificar responsivo manualmente com T10.
6. Verificar fechamentos e execução:
   - `DOMContentLoaded`
   - existência de elementos por id/class

## 6) Nota sobre duplicação (script inline vs script.js)
- Se o `index.html` tiver um `<script>` inline funcional e o `e-commerce/script.js` também existir, pode ocorrer divergência.
- Preferência: manter **um único controlador**.
- A execução final após a revisão vai assegurar que o layout e o comportamento usem o mesmo código.

