// ===== Classe Produto =====
class Produto {
    constructor(id, nome, preco, categoria, img, descricao, galeria = []) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.img = img;
        this.descricao = descricao;
        this.galeria = galeria;
    }
}

// ===== Mock de produtos como Objetos =====
const produtos = [
    new Produto(
        1,
        "Câmera DSLR",
        3500,
        "Câmeras",
        "./assets/produtos/nikon-D750.webp",
        "Câmera DSLR full-frame com alta resolução e desempenho em baixa luz."
    ),
    new Produto(
        2,
        "Lente 50mm",
        1200,
        "Lentes",
        "./assets/produtos/lente-50mm.jpg",
        "Lente prime 50mm f/1.8 para retratos e baixa luminosidade."
    ),
    new Produto(
        3,
        "Tripé",
        250,
        "Acessórios",
        "./assets/produtos/tripe.jpg",
        "Tripé leve e portátil, ideal para fotografia em campo."
    ),
];

// ===== Carrega categorias =====
const filtroCategoria = document.getElementById("filtroCategoria");
const categorias = [...new Set(produtos.map(p => p.categoria))];
categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filtroCategoria.appendChild(option);
});

// ===== Renderização dos cards =====
function renderizarCatalogo(produtosRender) {
    const catalogo = document.getElementById("catalogo");
    catalogo.innerHTML = "";

    produtosRender.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${prod.img}" alt="${prod.nome}">
            <div class="info">
                <h3>${prod.nome}</h3>
                <p>R$ ${prod.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <button onclick="adicionarCarrinhoOuDetalhe(${prod.id})">Ver Detalhes</button>
            </div>
        `;

        catalogo.appendChild(card);
    });
}

renderizarCatalogo(produtos);

// ===== Filtros =====
document.getElementById("busca").addEventListener("input", filtrar);
filtroCategoria.addEventListener("change", filtrar);

function filtrar() {
    const busca = document.getElementById("busca").value.toLowerCase();
    const categoria = filtroCategoria.value;
    const resultado = produtos.filter(p =>
        p.nome.toLowerCase().includes(busca) &&
        (categoria === "" || p.categoria === categoria)
    );
    renderizarCatalogo(resultado);
}

// ===== Ordenação =====
document.getElementById("ordenar").addEventListener("change", (e) => {
    const ordem = e.target.value;
    const copia = [...produtos];
    switch(ordem) {
        case "preco-asc": copia.sort((a,b)=>a.preco-b.preco); break;
        case "preco-desc": copia.sort((a,b)=>b.preco-a.preco); break;
        case "nome-asc": copia.sort((a,b)=>a.nome.localeCompare(b.nome)); break;
        case "nome-desc": copia.sort((a,b)=>b.nome.localeCompare(a.nome)); break;
    }
    renderizarCatalogo(copia);
});

// ===== Carrinho =====
function adicionarCarrinho(id) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const produto = produtos.find(p => p.id === id);
    const existente = carrinho.find(p => p.id === id);

    if (existente) {
        existente.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    // === Toastify ===
    Toastify({
        text: `${produto.nome} adicionado ao carrinho.`,
        duration: 2500,
        gravity: "top",
        position: "center",
        style: {
            background: "#ff6f61",
            color: "#fff",
            borderRadius: "6px",
            padding: "10px 16px",
            fontSize: "0.95rem",
        },
    }).showToast();
}

// ===== Modal =====
const modal = document.getElementById("modalProduto");
const modalNome = document.getElementById("modalNome");
const modalPreco = document.getElementById("modalPreco");
const modalDescricao = document.getElementById("modalDescricao");
const imgPrincipal = document.getElementById("imgPrincipal");
const miniaturas = document.getElementById("miniaturas");
const btnAdicionarModal = document.getElementById("adicionarModal");
const btnFechar = document.querySelector(".fechar");

function abrirModal(produto) {
    modal.style.display = "block";
    modalNome.textContent = produto.nome;
    modalPreco.textContent = `R$ ${produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    modalDescricao.textContent = produto.descricao || "Descrição não disponível";

    imgPrincipal.src = produto.img;
    imgPrincipal.alt = produto.nome;

    miniaturas.innerHTML = "";
    const imgs = produto.galeria.length ? produto.galeria : [produto.img];
    imgs.forEach((img, i) => {
        const thumb = document.createElement("img");
        thumb.src = img;
        if(i===0) thumb.classList.add("active");
        thumb.addEventListener("click", () => {
            imgPrincipal.src = img;
            document.querySelectorAll("#miniaturas img").forEach(t => t.classList.remove("active"));
            thumb.classList.add("active");
        });
        miniaturas.appendChild(thumb);
    });

    btnAdicionarModal.onclick = () => {
        adicionarCarrinho(produto.id);
        modal.style.display = "none";
    };
}

btnFechar.onclick = () => { modal.style.display = "none"; };
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

function adicionarCarrinhoOuDetalhe(id) {
    const produto = produtos.find(p => p.id === id);
    abrirModal(produto);
}
