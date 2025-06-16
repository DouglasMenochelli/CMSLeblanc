(() => {
 const supabaseUrl = 'https://tvszlivjnjztijpcuyxr.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2c3psaXZqbmp6dGlqcGN1eXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1OTU3NTIsImV4cCI6MjA2NTE3MTc1Mn0.sA5MFunNh4B6pMet4W2R-iggN2JUXFH3rODTFVf90mg';
  const { createClient } = supabase;

  const supabaseClient = createClient(supabaseUrl, supabaseKey);

  document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const senhaInput = document.getElementById("senha");
    const toggleBtn = document.querySelector(".toggle");

    if (!loginForm) {
      console.error("Formulário de login não encontrado.");
      return;
    }

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = senhaInput.value.trim();

      if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
      }

      try {
        const { data, error } = await supabaseClient
          .from("usuarios")
          .select("senha")
          .eq("email", email)
          .single();

        if (error) {
          console.error("Erro Supabase:", error);
          alert("Erro ao buscar usuário.");
          return;
        }

        if (data.senha !== senha) {
          alert("Senha incorreta.");
          return;
        }

        // Login bem-sucedido
        window.location.href = "index2.html";

      } catch (err) {
        console.error("Erro inesperado:", err);
        alert("Erro ao tentar logar.");
      }
    });

    // Mostrar/ocultar senha
    if (toggleBtn && senhaInput) {
      toggleBtn.addEventListener("click", () => {
        senhaInput.type = senhaInput.type === "password" ? "text" : "password";
      });
    }
  });
})();