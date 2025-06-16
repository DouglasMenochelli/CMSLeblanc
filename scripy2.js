document.addEventListener("DOMContentLoaded", async () => {
  const supabaseUrl = 'https://tvszlivjnjztijpcuyxr.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2c3psaXZqbmp6dGlqcGN1eXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1OTU3NTIsImV4cCI6MjA2NTE3MTc1Mn0.sA5MFunNh4B6pMet4W2R-iggN2JUXFH3rODTFVf90mg';

  const client = supabase.createClient(supabaseUrl, supabaseKey);
  const tabelaUsuarios = document.getElementById("tabelaUsuarios");
  const modal = document.getElementById("userModal");
  const modalTitle = document.getElementById("modalTitle");
  const userIdInput = document.getElementById("userId");
  const nomeInput = document.getElementById("nome_completo");
  const cpfInput = document.getElementById("cpf");
  const emailInput = document.getElementById("email");
  const celularInput = document.getElementById("celular");
  const statusInput = document.getElementById("status");

  const filtroStatus = document.getElementById("filtroStatus");
  const buscarUsuario = document.getElementById("buscarUsuario");

  window.closeModal = () => {
    modal.classList.add("hidden");
    userIdInput.value = "";
    nomeInput.value = "";
    cpfInput.value = "";
    emailInput.value = "";
    celularInput.value = "";
    statusInput.value = "Ativo";
  };

  function openEditModal(usuario) {
    modal.classList.remove("hidden");
    modalTitle.textContent = "Editar informações";
    userIdInput.value = usuario.id;
    nomeInput.value = usuario.nome_completo || "";
    cpfInput.value = usuario.cpf || "";
    emailInput.value = usuario.email || "";
    celularInput.value = usuario.celular || "";
    statusInput.value = usuario.status || "Ativo";
  }

  async function carregarUsuarios() {
    let { data, error } = await client.from("usuarios").select("*");

    if (error) {
      console.error("Erro ao carregar usuários:", error.message);
      return;
    }

    const termoBusca = buscarUsuario.value.toLowerCase();
    const statusSelecionado = filtroStatus.value;

    if (termoBusca || statusSelecionado) {
      data = data.filter(usuario => {
        const nomeMatch = usuario.nome_completo.toLowerCase().includes(termoBusca);
        const statusMatch = statusSelecionado ? usuario.status === statusSelecionado : true;
        return nomeMatch && statusMatch;
      });
    }

    tabelaUsuarios.innerHTML = "";

    data.forEach(usuario => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td><input type="checkbox" /></td>
        <td>${usuario.nome_completo || ""}</td>
        <td>${usuario.celular || ""}</td>
        <td>${usuario.email || ""}</td>
        <td>${usuario.status || "Indefinido"}</td>
        <td>
          <button class="editar" data-id="${usuario.id}">✏️</button>
          <button class="excluir" data-id="${usuario.id}">🗑️</button>
        </td>
      `;
      tabelaUsuarios.appendChild(linha);
    });

    ativarBotoesEditar();
    ativarBotoesExcluir();
  }

  function ativarBotoesExcluir() {
    document.querySelectorAll(".excluir").forEach(botao => {
      botao.addEventListener("click", async () => {
        const id = botao.dataset.id;
        const { error } = await client.from("usuarios").delete().eq("id", id);
        if (error) {
          console.error("Erro ao excluir:", error.message);
          return;
        }
        carregarUsuarios();
      });
    });
  }

  function ativarBotoesEditar() {
    document.querySelectorAll(".editar").forEach(botao => {
      botao.addEventListener("click", async () => {
        const id = botao.dataset.id;
        const { data, error } = await client.from("usuarios").select("*").eq("id", id).single();
        if (error) {
          console.error("Erro ao buscar usuário:", error.message);
          return;
        }
        openEditModal(data);
      });
    });
  }

  const form = document.getElementById("userForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = userIdInput.value;
    const usuario = {
      nome_completo: nomeInput.value,
      cpf: cpfInput.value,
      email: emailInput.value,
      celular: celularInput.value,
      // status: statusInput.value - Coluna status não existe na tabelinha
    };

    let response;
    if (id) {
      response = await client.from("usuarios").update(usuario).eq("id", id);
    } else {
      response = await client.from("usuarios").insert([usuario]);
    }

    if (response.error) {
      console.error("Erro ao salvar:", response.error.message);
      return;
    }

    closeModal();
    carregarUsuarios();
  });

  document.getElementById("btnAdicionarNovo").addEventListener("click", () => {
    modalTitle.textContent = "Novo administrador";
    modal.classList.remove("hidden");
  });

  filtroStatus.addEventListener("change", carregarUsuarios);
  buscarUsuario.addEventListener("input", carregarUsuarios);

  carregarUsuarios();
});
