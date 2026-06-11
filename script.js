// ==========================================
// 1. SISTEMA DE COOKIES (Focado na LGPD e Memória do Quiz)
// ==========================================

// Função básica para salvar um cookie
function definirCookie(nome, valor, dias) {
    const data = new Date();
    data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000));
    const expira = "expires=" + data.toUTCString();
    document.cookie = nome + "=" + valor + ";" + expira + ";path=/;SameSite=Strict";
}

// Função básica para ler um cookie
function obterCookie(nome) {
    const cNome = nome + "=";
    const cookiesDecodificados = decodeURIComponent(document.cookie);
    const listaCookies = cookiesDecodificados.split(';');
    for(let i = 0; i < listaCookies.length; i++) {
        let c = listaCookies[i].trim();
        if (c.indexOf(cNome) == 0) {
            return c.substring(cNome.length, c.length);
        }
    }
    return "";
}

// Gerencia a exibição do Banner de Cookies
window.addEventListener('DOMContentLoaded', () => {
    const consentimento = obterCookie("cookies_aceitos");
    if (!consentimento) {
        document.getElementById('cookie-banner').classList.remove('hidden');
    }
    
    // Atualiza o painel do quiz com base no cookie histórico guardado
    const historicoQuiz = obterCookie("resultado_quiz_mip");
    if (historicoQuiz) {
        document.getElementById('status-cookie').innerText = historicoQuiz;
    }
});

function aceitarCookies() {
    definirCookie("cookies_aceitos", "verdadeiro", 30);
    document.getElementById('cookie-banner').classList.add('hidden');
}


// ==========================================
// 2. CONTADORES DINÂMICOS COM INTERSECTION OBSERVER
// ==========================================
const rodarAnimacaoContadores = () => {
    const elementosContadores = document.querySelectorAll('.counter');
    
    elementosContadores.forEach(contador => {
        const limite = +contador.getAttribute('data-target');
        let valorAtual = 0;
        const incremento = limite / 60; // Suavidade da subida

        const atualizarContagem = () => {
            if (valorAtual < limite) {
                valorAtual += incremento;
                contador.innerText = Math.ceil(valorAtual);
                setTimeout(atualizarContagem, 25);
            } else {
                contador.innerText = limite;
            }
        };
        atualizarContagem();
    });
};

const painelEstatisticas = document.querySelector('.stats-container');
const observadorPainel = new IntersectionObserver((entradas) => {
    if(entradas[0].isIntersecting) {
        rodarAnimacaoContadores();
        observadorPainel.disconnect(); // Evita reativar ao rolar novamente
    }
}, { threshold: 0.3 });

observadorPainel.observe(painelEstatisticas);


// ==========================================
// 3. GRÁFICO CIENTÍFICO (MÉTRICAS INSPIRADAS EM EMBRAPA/BAYER)
// ==========================================
const localGrafico = document.getElementById('grafico').getContext('2d');
new Chart(localGrafico, {
    type: 'bar',
    data: {
        labels: ['Químico Calendarizado (Antigo)', 'Manejo Biológico Isolado', 'AgroMIP Tecnológico (Atual)'],
        datasets: [
            {
                label: 'Custo Operacional Financeiro (R$ / ha)',
                data: [85, 60, 42],
                backgroundColor: 'rgba(217, 83, 79, 0.75)',
                borderColor: '#d9534f',
                borderWidth: 2,
                borderRadius: 6
            },
            {
                label: 'Preservação da Biodiversidade (%)',
                data: [15, 85, 95],
                backgroundColor: 'rgba(91, 179, 24, 0.85)',
                borderColor: '#2b7a0b',
                borderWidth: 2,
                borderRadius: 6
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { font: { weight: '600' } } }
        },
        scales: {
            y: { beginAtZero: true, max: 100 }
        }
    }
});


// ==========================================
// 4. QUIZ GAMIFICADO COM MEMÓRIA DE COOKIE
// ==========================================
function verificarQuiz(acertou, botaoClicado) {
    const todasOpcoes = document.querySelectorAll('.option-btn');
    todasOpcoes.forEach(btn => btn.disabled = true); // Bloqueia novos cliques

    const painelFeedback = document.getElementById('quiz-feedback');
    painelFeedback.classList.remove('hidden');

    if (acertou) {
        botaoClicado.classList.add('correct');
        painelFeedback.className = "feedback-box success";
        painelFeedback.innerHTML = "🎯 <strong>Exatamente!</strong> As pesquisas da Syngenta e da BASF comprovam que tratamentos químicos só devem entrar em cena quando o nível de dano econômico é iminente. Antes disso, ferramentas biológicas e culturais dão conta com menor custo ambiental.";
        
        // Salva o acerto nos Cookies do navegador por 7 dias
        definirCookie("resultado_quiz_mip", "Aprovado (100% de Acertos)", 7);
        document.getElementById('status-cookie').innerText = "Aprovado (100% de Acertos)";
    } else {
        botaoClicado.classList.add('wrong');
        painelFeedback.className = "feedback-box error";
        painelFeedback.innerHTML = "⚠️ <strong>Incorreto.</strong> A alternativa correta é a segunda. O MIP prega o equilíbrio: produtos químicos de amplo espectro aplicados preventivamente geram resistência nas pragas e matam inimigos naturais.";
        
        // Destaca visualmente qual era o botão certo
        todasOpcoes[1].classList.add('correct');
        
        // Salva o erro nos Cookies por 7 dias
        definirCookie("resultado_quiz_mip", "Necessita Revisão", 7);
        document.getElementById('status-cookie').innerText = "Necessita Revisão";
    }
}