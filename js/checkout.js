// ======== Resumo do Carrinho ========
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const itensResumo = document.getElementById("itensResumo");
const totalResumo = document.getElementById("totalResumo");
const finalizarBtn = document.querySelector("#checkoutForm button[type='submit']"); // Botão de finalizar

function renderizarResumo() {
    itensResumo.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        itensResumo.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalResumo.textContent = "0.00";
        atualizarBotaoFinalizar(false); // 🔒 Desabilita se vazio
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
            <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
        `;

        div.style.animation = "none";
        requestAnimationFrame(() => { div.style.animation = ""; });

        itensResumo.appendChild(div);
    });

    totalResumo.textContent = total.toFixed(2);
    atualizarBotaoFinalizar(true); // ✅ Habilita se tiver itens

    // Eventos dos botões de + e -
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

// ✅ Função para habilitar/desabilitar o botão de finalizar
function atualizarBotaoFinalizar(ativo) {
    if (ativo) {
        finalizarBtn.disabled = false;
        finalizarBtn.classList.remove("desabilitado");
    } else {
        finalizarBtn.disabled = true;
        finalizarBtn.classList.add("desabilitado");
    }
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
                mensagem.textContent = "CEP não encontrado. Preencha manualmente.";
            } else {
                rua.value = data.logradouro;
                bairro.value = data.bairro;
                cidade.value = data.localidade;
                uf.value = data.uf;
                numero.focus();
                mensagem.textContent = "";
            }
        } catch (err) {
            mensagem.textContent = "Falha na consulta. Preencha manualmente.";
        }
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (carrinho.length === 0) return; // 🔒 Segurança extra
    alert("Compra finalizada!");
});
