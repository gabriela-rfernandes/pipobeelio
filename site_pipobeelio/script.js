//MENU 
const navbar = document.querySelector("#navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        navbar.classList.add("ativa");
    } else {
        navbar.classList.remove("ativa");
    }
});

//CARRINHO
const painelCarrinho = document.getElementById("carrinho-painel");
const overlayCarrinho = document.getElementById("carrinho-overlay");

const abrirCarrinho = document.getElementById("abrir-carrinho");
const fecharCarrinho = document.getElementById("fechar-carrinho");

function abrirPainel() {
    painelCarrinho.classList.add("ativo");
    overlayCarrinho.classList.add("ativo");
    painelCarrinho.setAttribute("aria-hidden", "false");
}

function fecharPainel() {
    painelCarrinho.classList.remove("ativo");
    overlayCarrinho.classList.remove("ativo");
    painelCarrinho.setAttribute("aria-hidden", "true");
}

abrirCarrinho.addEventListener("click", abrirPainel);
fecharCarrinho.addEventListener("click", fecharPainel);
overlayCarrinho.addEventListener("click", fecharPainel);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        fecharPainel();
    }
});

const areaItens = document.getElementById("carrinho-itens");
const totalCarrinho = document.getElementById("carrinho-total");

let produtosCarrinho = JSON.parse(
    localStorage.getItem("produtosCarrinho") || "[]"
);

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function salvarCarrinho() {
    localStorage.setItem(
        "produtosCarrinho",
        JSON.stringify(produtosCarrinho)
    );
}

document.querySelectorAll(".carrinho").forEach(botao => {
    botao.addEventListener("click", () => {

        const nome = botao.dataset.nome;
        const preco = Number(botao.dataset.preco);

        if (!nome || !Number.isFinite(preco) || preco <= 0) {
            return;
        }

        const produtoExistente = produtosCarrinho.find(
            produto => produto.nome === nome
        );

        if (produtoExistente) {
            produtoExistente.quantidade++;
        } else {
            produtosCarrinho.push({
                nome: nome,
                preco: preco,
                quantidade: 1
            });
        }

        salvarCarrinho();
        atualizarCarrinho();
    });
});

function atualizarCarrinho() {

    areaItens.innerHTML = "";

    if (produtosCarrinho.length === 0) {
        areaItens.innerHTML =
            '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
    }

    produtosCarrinho.forEach((produto, index) => {

        const item = document.createElement("div");
        item.classList.add("item-carrinho");

        item.innerHTML = `
            <div>
                <h3>${produto.nome}</h3>
                <p>${formatarPreco(produto.preco)}</p>
            </div>

            <div class="quantidade-produto">
                <button class="qtd" data-acao="diminuir" data-index="${index}">−</button>

                <span>${produto.quantidade}</span>

                <button class="qtd" data-acao="aumentar" data-index="${index}">+</button>

                <button class="remover" data-acao="remover" data-index="${index}">
                    Remover
                </button>
            </div>
        `;

        areaItens.appendChild(item);
    });

    const total = produtosCarrinho.reduce(
        (soma, produto) =>
            soma + produto.preco * produto.quantidade, 0
    );

    totalCarrinho.textContent = formatarPreco(total);
}

areaItens.addEventListener("click", event => {

    const botao = event.target.closest("button[data-acao]");

    if (!botao) return;

    const index = Number(botao.dataset.index);
    const acao = botao.dataset.acao;
    const produto = produtosCarrinho[index];

    if (!produto) return;

    if (acao === "aumentar") {
        produto.quantidade++;
    }

    if (acao === "diminuir") {
        produto.quantidade--;

        if (produto.quantidade <= 0) {
            produtosCarrinho.splice(index, 1);
        }
    }

    if (acao === "remover") {
        produtosCarrinho.splice(index, 1);
    }

    salvarCarrinho();
    atualizarCarrinho();
});

atualizarCarrinho();