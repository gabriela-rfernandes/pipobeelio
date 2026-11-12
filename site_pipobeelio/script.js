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

//HISTÓRIA
const etapasHistoria = [
    {
        titulo: "O começo",
        descricao: "A Pipobeelio nasce como um projeto de empreendedorismo escolar.",
        imagem: "assets/historia-1.png"
    },
    {
        titulo: "A ideia",
        descricao: "Transformar um produto simples em uma experiência diferente através de pipocas gourmet, sabores diferenciados e uma identidade própria.",
        imagem: "assets/historia-2.jpg"
    },
    {
        titulo: "A produção",
        descricao: "A equipe desenvolveu os produtos, a identidade visual, a comunicação e preparou a marca para a feira.",
        imagem: "assets/historia-3.jpg"
    },
    {
        titulo: "A feira",
        descricao: "A Pipobeelio foi colocada à prova diante de clientes reais.",
        imagem: "assets/historia-4.jpg"
    },
    {
        titulo: "O resultado",
        descricao: "Os produtos tiveram grande procura, esgotando rapidamente, e a barraca alcançou um alto rendimento na feira.",
        imagem: "assets/historia-5.jpg"
    },
    {
        titulo: "O próximo passo",
        descricao: "A partir dessa experiência, a marca é transformada em uma experiência digital.",
        imagem: "assets/historia-6.png"
    }
];

const secaoHistoria = document.querySelector(".historia-scroll");
const tituloHistoria = document.querySelector(".historia-titulo");
const descricaoHistoria = document.querySelector(".historia-descricao");
const imagemHistoria = document.querySelector(".historia-imagem img");
const numeroHistoria = document.querySelector(".historia-etapa");
const linhaHistoria = document.querySelector(".historia-linha-preenchida");
const pontosHistoria = document.querySelectorAll(".historia-pontos span");

let etapaAtual = -1;

function atualizarHistoria() {

    const inicio = secaoHistoria.getBoundingClientRect().top + window.scrollY;
    const distancia = secaoHistoria.offsetHeight - window.innerHeight;

    const progresso = Math.max(0, Math.min(1,
        (window.scrollY - inicio) / distancia
    ));

    const indice = Math.min(5, Math.floor(progresso * 6));

    // Atualiza o conteúdo somente quando a etapa muda
    if (indice !== etapaAtual) {

        etapaAtual = indice;

        const etapa = etapasHistoria[indice];

        tituloHistoria.textContent = etapa.titulo;
        descricaoHistoria.textContent = etapa.descricao;
        imagemHistoria.src = etapa.imagem;
        numeroHistoria.textContent = `0${indice + 1} / 06`;

        linhaHistoria.style.width = `${(indice / 5) * 100}%`;
    }

    // Atualiza os números em toda rolagem
    pontosHistoria.forEach((ponto, i) => {
        ponto.classList.toggle("ativo", i === indice);
    });
}

window.addEventListener("scroll", atualizarHistoria);
window.addEventListener("resize", atualizarHistoria);

atualizarHistoria();