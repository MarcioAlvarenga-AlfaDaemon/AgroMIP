const btnHamburguer = document.getElementById("menu-hamburguer");
const navMenu = document.getElementById("nav-menu");

// Abre e fecha o menu hamburguer
btnHamburguer.addEventListener("click", () => {
    navMenu.classList.toggle("ativo");
});

// Fecha o menu automaticamente ao clicar em um tópico (melhoria para celular)
document.querySelectorAll(".nav-lista a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("ativo");
    });
});

// Animação inteligente dos contadores
function animarContador(id, alvo) {
    let numero = 0;
    // Define o passo com base no tamanho do alvo para que todos terminem rápido
    const passo = Math.ceil(alvo / 50); 

    const intervalo = setInterval(() => {
        numero += passo;
        
        if (numero >= alvo) {
            document.getElementById(id).textContent = alvo;
            clearInterval(intervalo);
        } else {
            document.getElementById(id).textContent = numero;
        }
    }, 25);
}

// Inicializa as animações
animarContador("contador1", 80);
animarContador("contador2", 95);
animarContador("contador3", 90);

// Validação do Quiz com cores dinâmicas
function verificarQuiz(correto) {
    const resultado = document.getElementById("resultadoQuiz");

    if (correto) {
        resultado.innerHTML = "✅ Resposta correta! O MIP foca no equilíbrio biológico.";
        resultado.style.color = "#2e7d32"; // Verde para acerto
    } else {
        resultado.innerHTML = "❌ Tente novamente. Lembre-se do foco sustentável!";
        resultado.style.color = "#d32f2f"; // Vermelho para erro
    }
}

// Controle do tema com troca de ícone (Sol/Lua)
const tema = document.getElementById("tema");

tema.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    
    // Troca o emoji do botão dinamicamente
    if (document.body.classList.contains("dark")) {
        tema.textContent = "☀️";
    } else {
        tema.textContent = "🌙";
    }
});
