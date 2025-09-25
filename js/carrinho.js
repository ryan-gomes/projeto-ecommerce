// ======== Carrinho ========
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const itensCarrinho = document.getElementById("itensCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const botaoCheckout = document.querySelector(".finalizar"); // botão "Ir para Checkout"

function renderizarCarrinho() {
    itensCarrinho.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        itensCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalCarrinho.textContent = "0,00";

        // Desabilita botão de checkout
        botaoCheckout.disabled = true;
        botaoCheckout.style.backgroundColor = "#999";
        botaoCheckout.style.cursor = "not-allowed";

        return;
    }

    // Reabilita botão caso tenha itens
    botaoCheckout.disabled = false;
    botaoCheckout.style.backgroundColor = "#ff6f61";
    botaoCheckout.style.cursor = "pointer";

    carrinho.forEach(item => {
        total += item.preco * item.quantidade;

        const div = document.createElement("div");
        div.innerHTML = `
        <span>${item.nome}</span>
        <div class="quantidade-preco">
            <div class="quantidade-container">
                <button class="decrementar" data-id="${item.id}">-</button>
                <span>${item.quantidade}</span>
                <button class="incrementar" data-id="${item.id}">+</button>
            </div>
            <span>R$ ${(item.preco * item.quantidade).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}</span>
        </div>
    `;

        div.style.animation = "none";
        requestAnimationFrame(() => { div.style.animation = ""; });

        itensCarrinho.appendChild(div);
    });


    totalCarrinho.textContent = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Eventos dos botões
    document.querySelectorAll(".incrementar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.getAttribute("data-id"));
            alterarQuantidade(id, 1);
        });
    });

    document.querySelectorAll(".decrementar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.getAttribute("data-id"));
            alterarQuantidade(id, -1);
        });
    });
}

function alterarQuantidade(id, delta) {
    const item = carrinho.find(p => p.id === id);
    if (!item) return;

    item.quantidade += delta;

    if (item.quantidade <= 0) {
        carrinho = carrinho.filter(p => p.id !== id);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderizarCarrinho();
}

// Inicializa
renderizarCarrinho();
