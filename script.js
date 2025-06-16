document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = 'https://tvszlivjnjztijpcuyxr.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2c3psaXZqbmp6dGlqcGN1eXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1OTU3NTIsImV4cCI6MjA2NTE3MTc1Mn0.sA5MFunNh4B6pMet4W2R-iggN2JUXFH3rODTFVf90mg';

  const client = supabase.createClient(supabaseUrl, supabaseKey);

  const form = document.getElementById("cadastro-form");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      

      const nome_completo = form.elements["nome"].value;
      const cpf = form.elements["cpf"].value;
      const email = form.elements["email"].value;
      const celular = form.elements["celular"].value;
      const senha = form.elements["senha"].value;

      const { data, error } = await client
        .from("usuarios")
        .insert([{ nome_completo, cpf, email, celular, senha }]);

      if (error) {
        alert("Erro ao cadastrar: " + error.message);
        return;
      }

      alert("Cadastro realizado com sucesso!");
      form.reset();

      //  Redirecionamento para o CMS
      window.location.href = "/html/index2.html"; 
    });
  }
});
