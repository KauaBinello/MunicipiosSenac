const API = "http://127.0.0.1:3000/municipios";

const listagem = document.getElementById("listagem");
const btnCarregar = document.getElementById("btn");
const btnSalvar = document.getElementById("btnSalvar");
const btnPaginacao = document.getElementById('btnPaginacao');
const btnPaginacaoMenos = document.getElementById('btnPaginacaoMenos');
const btnAlterar = document.getElementById('btnSalvar_alteracao');

const limit = 999;
let offset = 0;
let lastScrollTop = 0

//--------------------------------------------------
// EVENTOS
//--------------------------------------------------
// scroll
window.addEventListener("scroll", async () => {
    let scrollTop = window.pageYOffset;

    console.log("scrolleeiiiiiii");

    if (scrollTop > lastScrollTop) {
        console.log("rolou pra baixo");
    } else {
        console.log("Rolei para cima!!!");
    }

    lastScrollTop = scrollTop;
});

btnCarregar.addEventListener("click", () => atualizarMunicipios("inicio"));
btnSalvar.addEventListener("click", inserirMunicipio);
btnAlterar.addEventListener("click", alterarMunicipio);
btnPaginacao.addEventListener("click", () => atualizarMunicipios("mais"));
btnPaginacaoMenos.addEventListener("click", () => atualizarMunicipios("menos"));

//--------------------------------------------------
// FUNÇÃO ÚNICA DE LISTAGEM + PAGINAÇÃO
//--------------------------------------------------
async function atualizarMunicipios(acao = "") {

    if (acao === "inicio") {
        offset = 0;
    }

    if (acao === "mais") {
        offset += limit;
    }

    if (acao === "menos") {
        offset -= limit;
        if (offset < 0) offset = 0;
    }

    try {
        const resposta = await fetch(`${API}/?limit=${limit}&offset=${offset}`);
        const dados = await resposta.json();

        listagem.innerHTML = "";

        dados.forEach(m => criarCard(m));

    } catch (erro) {
        console.error("Erro ao carregar:", erro.message);
    }
}

//--------------------------------------------------
// CRIAR CARD NO FRONT
//--------------------------------------------------
function criarCard(m) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <h3>${m.nome} (${m.estado})</h3>
        <p>${m.caracteristica}</p>
        <button class="btn-editar" onclick="modalEdicao(${m.id})">Editar</button>
        <button class="btn-delete" onclick="deletar(${m.id})">Deletar</button>
    `;

    listagem.appendChild(card);
}

//--------------------------------------------------
// INSERIR MUNICÍPIO (POST)
//--------------------------------------------------
async function inserirMunicipio() {
    const nome = document.getElementById("campoMunicipio").value;
    const estado = document.getElementById("campoUF").value;
    const caracteristica = document.getElementById("campoCaracteristica").value;

    const novoMunicipio = { nome, estado, caracteristica };

    try {
        const resposta = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoMunicipio),
        });

        if (!resposta.ok) {
            throw new Error("Erro ao inserir!");
        }

        carregarMunicipios();

    } catch (erro) {
        console.error("Erro ao inserir:", erro.message);
    }
}

//--------------------------------------------------
// DELETAR MUNICÍPIO (DELETE)
//--------------------------------------------------
async function deletar(id) {

    try {

        const resposta = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao deletar!");
        }

        carregarMunicipios();

    } catch (erro) {
        console.error("Erro ao deletar:", erro.message);
    }
}


//--------------------------------------------------
// ABRIR O MODAL E CARREGAR OS DADOS DO MUNICÍPIO
//--------------------------------------------------
async function modalEdicao(id) {
    idMunicipioEdit = id; // Armazenar o ID do município a ser editado

    try {
        const resposta = await fetch(`${API}/${id}`);
        const municipio = await resposta.json();

        // Preencher os campos do modal com os dados do município
        document.getElementById("campoMunicipio_edit").value = municipio.nome;
        document.getElementById("campoUF_edit").value = municipio.estado;
        document.getElementById("campoCaracteristica_edit").value = municipio.caracteristica;

        // Exibir o modal
        modal.style.display = "block";

    } catch (erro) {
        console.error("Erro ao carregar dados para edição:", erro.message);
    }
}

//--------------------------------------------------
// ALTERAR MUNICÍPIO (PUT)
//--------------------------------------------------
async function alterarMunicipio() {
    const nome = document.getElementById("campoMunicipio_edit").value;
    const estado = document.getElementById("campoUF_edit").value;
    const caracteristica = document.getElementById("campoCaracteristica_edit").value;

    const municipioAlterado = { nome, estado, caracteristica };

    try {
        const resposta = await fetch(`${API}/${idMunicipioEdit}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(municipioAlterado),
        });

        if (!resposta.ok) {
            throw new Error("Erro ao alterar!");
        }

        carregarMunicipios();
        modal.style.display = "none"; // Fechar o modal após salvar

    } catch (erro) {
        console.error("Erro ao alterar:", erro.message);
    }
}

// Fechar o modal ao clicar fora dele
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}