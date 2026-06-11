// --- 1. EFEITO DOS CONTADORES INTELIGENTES (Apenas rodam ao rolar a tela) ---
const iniciarContadores = () => {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const speed = target / 80; // Controla a velocidade uniforme

        const updateCount = () => {
            if (count < target) {
                count += speed;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// Intersection Observer para detectar quando o usuário chega na seção dos números
const statsSection = document.querySelector('.stats-container');
const observer = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting) {
        iniciarContadores();
        observer.disconnect(); // Roda a animação apenas uma vez
    }
}, { threshold: 0.5 });

observer.observe(statsSection);


// --- 2. CONFIGURAÇÃO AVANÇADA DO GRÁFICO (CHART.JS) ---
const ctx = document.getElementById('grafico').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Controle Químico Tradicional', 'Controle Biológico Isolado', 'Metodologia AgroMIP'],
        datasets: [{
            label: 'Grau de Impacto Ambiental (Menor é melhor)',
            data: [92, 35, 12],
            backgroundColor: [
                'rgba(217, 83, 79, 0.85)',  // Vermelho para químico
                'rgba(91, 179, 24, 0.6)',   // Verde médio para biológico
                'rgba(27, 77, 62, 0.9)'     // Verde escuro premium para o MIP
            ],
            borderColor: [
                '#d9534f',
                '#5bb318',
                '#1b4d3e'
            ],
            borderWidth: 2,
            borderRadius: 8
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: { font: { family: 'sans-serif', size: 13, weight: 'bold' } }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { display: false }
            },
            x: {
                grid: { display: false }
            }
        }
    }
});


// --- 3. SISTEMA DE QUIZ INTERATIVO E GAMIFICADO ---
function verificarQuiz(eCorreto, elementoClicado) {
    // Desabilita todos os botões para o usuário não clicar de novo
    const botoes = document.querySelectorAll('.option-btn');
    botoes.forEach(btn => btn.disabled = true);

    const feedback = document.getElementById('quiz-feedback');
    feedback.classList.remove('hidden');

    if (eCorreto) {
        elementoClicado.classList.add('correct');
        feedback.className = "feedback-box success";
        feedback.innerHTML = "🎉 <strong>Parabéns, resposta exata!</strong> O foco do MIP é o equilíbrio ecológico e financeiro, controlando as pragas de forma inteligente sem agredir a biodiversidade.";
    } else {
        elementoClicado.classList.add('wrong');
        feedback.className = "feedback-box error";
        feedback.innerHTML = "❌ <strong>Quase lá!</strong> A resposta correta seria a segunda opção. O MIP não busca erradicar os insetos por completo, mas sim mantê-los sob controle de forma segura e econômica.";
        
        // Destaca a alternativa correta mesmo se ele errou
        botoes[1].classList.add('correct');
    }
}