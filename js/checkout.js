// ======== Resumo do Carrinho ========
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const itensResumo = document.getElementById("itensResumo");
const totalResumo = document.getElementById("totalResumo");
const finalizarBtn = document.querySelector("#checkoutForm button[type='submit']");

function renderizarResumo() {
    itensResumo.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        itensResumo.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalResumo.textContent = "0,00";
        atualizarBotaoFinalizar(false);
        return;
    }

    carrinho.forEach(item => {
        total += item.preco * item.quantidade;

        const div = document.createElement("div");
        div.innerHTML = `
            <span>${item.nome}</span>
            <div class="quantidade-container">
                <button class="decrementar" data-id="${item.id}">-</button>
                <span>${item.quantidade}</span>
                <button class="incrementar" data-id="${item.id}">+</button>
            </div>
            <span>R$ ${(item.preco * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        `;

        div.style.animation = "none";
        requestAnimationFrame(() => { div.style.animation = ""; });

        itensResumo.appendChild(div);
    });

    totalResumo.textContent = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    atualizarBotaoFinalizar(true);

    // Botões + e -
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
    renderizarResumo();
}

function atualizarBotaoFinalizar(ativo) {
    finalizarBtn.disabled = !ativo;
    finalizarBtn.classList.toggle("desabilitado", !ativo);
}

renderizarResumo();

// ======== ViaCEP + Formulário ========
const form = document.getElementById("checkoutForm");
const cepInput = document.getElementById("cep");
const rua = document.getElementById("rua");
const bairro = document.getElementById("bairro");
const cidade = document.getElementById("cidade");
const uf = document.getElementById("uf");
const numero = document.getElementById("numero");
const mensagem = document.getElementById("mensagem");

cepInput.addEventListener("input", async () => {
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length === 8) {
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (data.erro) {
                Toastify({
                    text: "CEP não encontrado. Preencha manualmente.",
                    duration: 4000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#f44336"
                }).showToast();
                mensagem.textContent = "CEP não encontrado. Preencha manualmente.";
            } else {
                rua.value = data.logradouro;
                bairro.value = data.bairro;
                cidade.value = data.localidade;
                uf.value = data.uf;
                numero.focus();
                mensagem.textContent = "";

                Toastify({
                    text: "CEP preenchido automaticamente.",
                    duration: 2500,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#4CAF50"
                }).showToast();
            }
        } catch (err) {
            Toastify({
                text: "Falha na consulta. Preencha manualmente.",
                duration: 4000,
                gravity: "top",
                position: "center",
                backgroundColor: "#ff9800"
            }).showToast();
            mensagem.textContent = "Falha na consulta. Preencha manualmente.";
        }
    }
});

// ======== Finalização da compra ========
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (carrinho.length === 0) return;

    // Verifica se todos os campos de endereço estão preenchidos
    if (
        !cepInput.value.trim() ||
        !rua.value.trim() ||
        !numero.value.trim() ||
        !bairro.value.trim() ||
        !cidade.value.trim() ||
        !uf.value.trim()
    ) {
        Toastify({
            text: "Preencha todos os campos de endereço antes de finalizar a compra.",
            duration: 2500,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336"
        }).showToast();
        return;
    }

    // Compra concluída
    Toastify({
        text: "Compra finalizada com sucesso! Redirecionando...",
        duration: 2500,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
    }).showToast();

    // Limpa carrinho e redireciona
    localStorage.removeItem("carrinho");
    carrinho = [];
    renderizarResumo();

    setTimeout(() => {
        window.location.href = "index.html"; // redireciona para a página inicial
    }, 2500); // 2,5 segundos para o usuário ver o toast
});
