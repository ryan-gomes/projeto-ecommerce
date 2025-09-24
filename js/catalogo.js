// Mock de produtos
const produtos = [
    {id: 1, nome: "Câmera DSLR", preco: 3500, categoria: "Câmeras", img: "assets/images/camera.jpg"},
    {id: 2, nome: "Lente 50mm", preco: 1200, categoria: "Lentes", img: "assets/images/lente.jpg"},
    {id: 3, nome: "Tripé", preco: 250, categoria: "Acessórios", img: "assets/images/tripe.jpg"},
];

// Carrega categorias no select
const filtroCategoria = document.getElementById("filtroCategoria");
const categorias = [...new Set(produtos.map(p => p.categoria))];
categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filtroCategoria.appendChild(option);
});

// Renderiza catálogo
function renderizarCatalogo(produtosRender) {
    const catalogo = document.getElementById("catalogo");
    catalogo.innerHTML = "";
    produtosRender.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${prod.img}" alt="${prod.nome}">
            <h3>${prod.nome}</h3>
            <p>R$ ${prod.preco.toFixed(2)}</p>
            <button onclick="adicionarCarrinhoOuDetalhe(${prod.id})">Ver Detalhes</button>
        `;
        catalogo.appendChild(card);
    });
}

renderizarCatalogo(produtos);

// Filtrar por busca e categoria
document.getElementById("busca").addEventListener("input", filtrar);
filtroCategoria.addEventListener("change", filtrar);

function filtrar() {
    const busca = document.getElementById("busca").value.toLowerCase();
    const categoria = filtroCategoria.value;
    let resultado = produtos.filter(p => 
        p.nome.toLowerCase().includes(busca) &&
        (categoria === "" || p.categoria === categoria)
    );
    renderizarCatalogo(resultado);
}

// Ordenar produtos
document.getElementById("ordenar").addEventListener("change", (e) => {
    const ordem = e.target.value;
    let copia = [...produtos];
    switch(ordem) {
        case "preco-asc": copia.sort((a,b)=>a.preco-b.preco); break;
        case "preco-desc": copia.sort((a,b)=>b.preco-a.preco); break;
        case "nome-asc": copia.sort((a,b)=>a.nome.localeCompare(b.nome)); break;
        case "nome-desc": copia.sort((a,b)=>b.nome.localeCompare(a.nome)); break;
    }
    renderizarCatalogo(copia);
});

// Carrinho no localStorage
function adicionarCarrinho(id) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const produto = produtos.find(p => p.id === id);
    const existente = carrinho.find(p => p.id === id);
    if(existente) {
        existente.quantidade += 1;
    } else {
        carrinho.push({...produto, quantidade: 1});
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert(`${produto.nome} adicionado ao carrinho!`);
}

// Modal e mini-galeria
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
    modalPreco.textContent = `R$ ${produto.preco.toFixed(2)}`;
    modalDescricao.textContent = produto.descricao || "Descrição não disponível";
    
    // Imagem principal
    imgPrincipal.src = produto.img;
    imgPrincipal.alt = produto.nome;

    // Miniaturas
    miniaturas.innerHTML = "";
    const imgs = produto.galeria || [produto.img]; // array de imagens
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

    // Botão adicionar no modal
    btnAdicionarModal.onclick = () => {
        adicionarCarrinho(produto.id);
        modal.style.display = "none";
    };
}

// Fechar modal
btnFechar.onclick = () => { modal.style.display = "none"; }
window.onclick = (e) => { if(e.target === modal) modal.style.display = "none"; }

// Alterar função do botão do card para abrir modal
function adicionarCarrinhoOuDetalhe(id) {
    const produto = produtos.find(p => p.id === id);
    abrirModal(produto);
}
