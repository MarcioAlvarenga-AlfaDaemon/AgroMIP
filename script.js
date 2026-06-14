// ============================================================
// SCRIPT.JS — AgroMIP 2026
// Autor: AgroMIP
// Descrição: Lógica principal do site, incluindo navegação,
// quiz gamificado, contadores, gráfico e interações do DOM.
// ============================================================

// ── 1. UTILITÁRIOS DE COOKIE (LGPD) ──────────────────────

/**
 * Salva um cookie no navegador
 * @param {string} nome - Nome do cookie
 * @param {string} valor - Valor a salvar
 * @param {number} dias - Dias até expirar
 */
function definirCookie(nome, valor, dias) {
  const data = new Date();
  data.setTime(data.getTime() + dias * 24 * 60 * 60 * 1000);
  document.cookie = `${nome}=${valor};expires=${data.toUTCString()};path=/;SameSite=Strict`;
}

/**
 * Lê um cookie pelo nome
 * @param {string} nome - Nome do cookie
 * @returns {string} Valor do cookie ou string vazia
 */
function obterCookie(nome) {
  const chave = nome + "=";
  const cookies = decodeURIComponent(document.cookie).split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(chave)) {
      return cookie.substring(chave.length);
    }
  }
  return "";
}

// ── 2. INICIALIZAÇÃO DO DOM ───────────────────────────────

window.addEventListener("DOMContentLoaded", () => {
  inicializarCookieBanner();
  inicializarNavbar();
  inicializarMenuMobile();
  inicializarTema();
  inicializarContadores();
  inicializarGrafico();
  inicializarAccordion();
  inicializarAnimacoesEntrada();
  inicializarQuiz();
  saudarUsuario();
});

// ── 3. BANNER DE COOKIES ──────────────────────────────────

function inicializarCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  const consentimento = obterCookie("agrinho_cookies");

  // Mostra o banner apenas se o usuário ainda não aceitou
  if (!consentimento) {
    banner.classList.remove("oculto");
  }

  // Atualiza o badge do quiz com histórico salvo em cookie
  const historico = obterCookie("agrinho_quiz_historico");
  const elHistorico = document.getElementById("status-cookie");
  if (historico && elHistorico) {
    elHistorico.textContent = historico;
  }
}

// Função global chamada pelo botão do banner
function aceitarCookies() {
  definirCookie("agrinho_cookies", "aceito", 180);
  const banner = document.getElementById("cookie-banner");
  banner.classList.add("oculto");
}

// ── 4. NAVBAR COM SCROLL ──────────────────────────────────

function inicializarNavbar() {
  const navbar = document.getElementById("navbar");

  // Adiciona classe 'scrolled' quando o usuário rola a página
  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// ── 5. MENU MOBILE (HAMBURGUER) ───────────────────────────

function inicializarMenuMobile() {
  const btnMenu = document.getElementById("btn-menu");
  const navLinks = document.getElementById("nav-links");

  if (!btnMenu || !navLinks) return;

  btnMenu.addEventListener("click", () => {
    // Alterna a classe 'aberto' para mostrar/esconder o menu
    const estaAberto = navLinks.classList.toggle("aberto");
    btnMenu.setAttribute("aria-expanded", estaAberto);
  });

  // Fecha o menu ao clicar em um link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("aberto");
      btnMenu.setAttribute("aria-expanded", false);
    });
  });
}

// ── 6. MODO ESCURO ────────────────────────────────────────

function inicializarTema() {
  const btnTema = document.getElementById("btn-tema");
  if (!btnTema) return;

  // Verifica preferência salva em cookie
  const temaSalvo = obterCookie("agrinho_tema");
  if (temaSalvo === "escuro") {
    document.body.classList.add("modo-escuro");
    btnTema.textContent = "☀️ Claro";
  }

  btnTema.addEventListener("click", () => {
    const modoEscuroAtivo = document.body.classList.toggle("modo-escuro");
    // Altera o texto do botão conforme o tema
    btnTema.textContent = modoEscuroAtivo ? "☀️ Claro" : "🌙 Escuro";
    definirCookie("agrinho_tema", modoEscuroAtivo ? "escuro" : "claro", 30);
  });
}

// ── 7. CONTADORES ANIMADOS (INTERSECTION OBSERVER) ────────

function inicializarContadores() {
  const elementosContadores = document.querySelectorAll(".counter");
  if (!elementosContadores.length) return;

  /**
   * Anima um contador de 0 até o valor alvo
   * @param {HTMLElement} el - Elemento span do contador
   */
  function animarContador(el) {
    const alvo = parseInt(el.getAttribute("data-target"), 10);
    let valorAtual = 0;
    const incremento = alvo / 60; // 60 frames para suavidade

    const atualizar = () => {
      if (valorAtual < alvo) {
        valorAtual += incremento;
        el.textContent = Math.ceil(valorAtual);
        requestAnimationFrame(atualizar);
      } else {
        el.textContent = alvo;
      }
    };
    requestAnimationFrame(atualizar);
  }

  // Dispara a animação apenas quando a seção entra na tela
  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          elementosContadores.forEach(animarContador);
          observer.disconnect(); // Evita re-animar ao rolar novamente
        }
      });
    },
    { threshold: 0.3 }
  );

  const secaoStats = document.querySelector(".stats-container");
  if (secaoStats) observer.observe(secaoStats);
}

// ── 8. GRÁFICO COMPARATIVO (CHART.JS) ────────────────────

function inicializarGrafico() {
  const canvas = document.getElementById("grafico");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Químico Calendarizado (Antigo)",
        "Biológico Isolado",
        "MIP Tecnológico (Atual)",
      ],
      datasets: [
        {
          label: "Custo Operacional (R$/ha, normalizado)",
          data: [85, 60, 42],
          backgroundColor: "rgba(217, 83, 79, 0.75)",
          borderColor: "#d9534f",
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: "Preservação da Biodiversidade (%)",
          data: [15, 80, 95],
          backgroundColor: "rgba(91, 179, 24, 0.8)",
          borderColor: "#2c7a0b",
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: { font: { weight: "600", size: 13 } },
        },
        tooltip: {
          callbacks: {
            // Personaliza o tooltip do gráfico
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { font: { size: 12 } },
        },
        x: {
          ticks: { font: { size: 12 } },
        },
      },
    },
  });
}

// ── 9. ACCORDION DE PERGUNTAS FREQUENTES ──────────────────

function inicializarAccordion() {
  const itens = document.querySelectorAll(".accordion-item");

  itens.forEach((item) => {
    const btn = item.querySelector(".accordion-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const estaAberto = item.classList.contains("ativo");

      // Fecha todos os outros itens antes de abrir o clicado
      itens.forEach((outro) => outro.classList.remove("ativo"));

      // Se o item clicado estava fechado, abre-o
      if (!estaAberto) {
        item.classList.add("ativo");
      }
    });
  });
}

// ── 10. ANIMAÇÕES DE ENTRADA (SCROLL) ─────────────────────

function inicializarAnimacoesEntrada() {
  const elementos = document.querySelectorAll(".animar-entrada");
  if (!elementos.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observer.unobserve(entrada.target); // Anima apenas uma vez
        }
      });
    },
    { threshold: 0.15 }
  );

  elementos.forEach((el) => observer.observe(el));
}

// ── 11. SAUDAÇÃO PERSONALIZADA ────────────────────────────

function saudarUsuario() {
  const elSaudacao = document.getElementById("saudacao-usuario");
  if (!elSaudacao) return;

  // Verifica se o nome do usuário está salvo
  let nomeUsuario = obterCookie("agrinho_usuario_nome");

  if (nomeUsuario) {
    // DOM: atualiza o texto da saudação com o nome salvo
    elSaudacao.textContent = `Olá, ${nomeUsuario}! Bem-vindo(a) de volta ao AgroMIP.`;
    elSaudacao.classList.remove("oculto");
  } else {
    // Solicita o nome do usuário (apenas na primeira visita)
    setTimeout(() => {
      const nome = prompt(
        "🌱 Bem-vindo(a) ao AgroMIP!\n\nQual é o seu nome? (opcional)"
      );
      if (nome && nome.trim()) {
        nomeUsuario = nome.trim();
        definirCookie("agrinho_usuario_nome", nomeUsuario, 30);
        // DOM: insere o nome no elemento de saudação
        elSaudacao.textContent = `Olá, ${nomeUsuario}! Explore o mundo do MIP.`;
        elSaudacao.classList.remove("oculto");
      }
    }, 1500);
  }
}

// ── 12. QUIZ GAMIFICADO COMPLETO ──────────────────────────

// Banco de perguntas do quiz
const perguntasQuiz = [
  {
    pergunta:
      'O que significa a sigla "MIP" no contexto da agricultura?',
    opcoes: [
      "Método Intensivo de Pesticidas",
      "Manejo Integrado de Pragas",
      "Monitoramento Industrial de Plantas",
      "Método Integrado de Produção",
    ],
    correta: 1,
    feedback:
      "Correto! MIP significa Manejo Integrado de Pragas — uma abordagem científica e ecológica que combina diferentes métodos para controlar organismos nocivos à agricultura de forma sustentável.",
  },
  {
    pergunta:
      "Quando o monitoramento indica que a população de pragas atingiu o 'Nível de Controle', qual deve ser a primeira escolha segundo o MIP?",
    opcoes: [
      "Aplicar imediatamente a dose máxima de inseticida químico.",
      "Priorizar agentes biológicos ou ferramentas culturais específicas para aquela praga.",
      "Ignorar e esperar que as condições climáticas eliminem os insetos.",
      "Fazer a colheita antecipada para evitar danos.",
    ],
    correta: 1,
    feedback:
      "Exato! No MIP, o controle químico é a última opção. Quando o nível de ação econômica é atingido, o correto é priorizar métodos biológicos e culturais antes de recorrer a pesticidas.",
  },
  {
    pergunta:
      "O que é o 'Nível de Ação Econômica' (NAE) no MIP?",
    opcoes: [
      "O preço de mercado dos agrotóxicos.",
      "O número mínimo de pragas que pode existir na lavoura.",
      "O ponto em que o dano causado pela praga é maior que o custo do controle.",
      "O orçamento anual do produtor rural para defensivos.",
    ],
    correta: 2,
    feedback:
      "Isso mesmo! O NAE é o limiar crítico: quando a população da praga causa prejuízo superior ao custo de controlá-la. Antes disso, é mais econômico e ecológico não intervir.",
  },
  {
    pergunta:
      "Qual destes é um exemplo de controle BIOLÓGICO de pragas?",
    opcoes: [
      "Uso de inseticida à base de organofosforado.",
      "Rotação de culturas entre as safras.",
      "Liberação de vespas parasitoides (ex.: Trichogramma) para atacar ovos de pragas.",
      "Instalação de telas de proteção nas estufas.",
    ],
    correta: 2,
    feedback:
      "Correto! O controle biológico usa organismos vivos — como vespas parasitoides, joaninhas, fungos entomopatogênicos (Beauveria bassiana) e bactérias (Bacillus thuringiensis) — para combater pragas de forma natural.",
  },
  {
    pergunta:
      "Por que a ROTAÇÃO DE CULTURAS é considerada uma prática do MIP?",
    opcoes: [
      "Aumenta a necessidade de fertilizantes nitrogenados.",
      "Quebra o ciclo de vida das pragas específicas de cada cultura, reduzindo sua infestação.",
      "Permite usar o mesmo agrotóxico por mais tempo sem criar resistência.",
      "Aumenta a compactação do solo, dificultando o acesso de pragas.",
    ],
    correta: 1,
    feedback:
      "Perfeito! Pragas geralmente são especialistas em poucas culturas. Ao mudar o que se planta em cada área, o ciclo reprodutivo das pragas é interrompido, reduzindo naturalmente sua pressão.",
  },
  {
    pergunta:
      "Qual é o principal benefício ambiental do MIP em relação ao controle químico convencional?",
    opcoes: [
      "Elimina completamente todas as pragas da lavoura.",
      "Reduz drasticamente o uso de agrotóxicos, preservando polinizadores e inimigos naturais.",
      "Aumenta a produtividade em 100% na primeira safra.",
      "Dispensa completamente o monitoramento da lavoura.",
    ],
    correta: 1,
    feedback:
      "Muito bem! O MIP reduz significativamente o uso de pesticidas, protegendo abelhas e outros polinizadores essenciais, além de preservar predadores naturais que regulam as populações de pragas.",
  },
  {
    pergunta:
      "O fungo Beauveria bassiana, muito usado no MIP, é um exemplo de:",
    opcoes: [
      "Inseticida químico sintético de terceira geração.",
      "Agente de controle biológico (fungo entomopatogênico).",
      "Fertilizante foliar orgânico.",
      "Herbicida biológico seletivo.",
    ],
    correta: 1,
    feedback:
      "Excelente! Beauveria bassiana é um fungo entomopatogênico — ele infecta e mata insetos pragas como lagartas, cigarrinhas e moscas-brancas, sendo amplamente utilizado no controle biológico dentro do MIP.",
  },
];

// Variáveis de estado do quiz
let indicePerguntaAtual = 0;
let pontuacaoQuiz = 0;
let quizRespondido = false;

/**
 * Inicializa o quiz, configurando eventos dos botões
 */
function inicializarQuiz() {
  const btnProxima = document.getElementById("btn-proxima");
  const btnReiniciar = document.getElementById("btn-reiniciar");

  if (btnProxima) {
    btnProxima.addEventListener("click", avancarPergunta);
  }

  if (btnReiniciar) {
    btnReiniciar.addEventListener("click", reiniciarQuiz);
  }

  renderizarPergunta();
}

/**
 * Renderiza a pergunta atual na tela (manipula o DOM)
 */
function renderizarPergunta() {
  quizRespondido = false;
  const perguntaAtual = perguntasQuiz[indicePerguntaAtual];

  // DOM: atualiza o texto da pergunta
  document.getElementById("quiz-pergunta").textContent =
    `${indicePerguntaAtual + 1}. ${perguntaAtual.pergunta}`;

  // DOM: renderiza as opções dinamicamente
  const containerOpcoes = document.getElementById("quiz-opcoes");
  containerOpcoes.innerHTML = "";
  perguntaAtual.opcoes.forEach((opcao, i) => {
    const btn = document.createElement("button");
    btn.className = "opcao-btn";
    btn.textContent = opcao;
    btn.addEventListener("click", () => verificarResposta(i));
    containerOpcoes.appendChild(btn);
  });

  // DOM: esconde feedback e botão "próxima"
  const feedback = document.getElementById("quiz-feedback");
  feedback.className = "";
  feedback.style.display = "none";
  feedback.textContent = "";

  const btnProxima = document.getElementById("btn-proxima");
  btnProxima.classList.remove("visivel");

  // DOM: atualiza a barra de progresso
  atualizarBarraProgresso();
}

/**
 * Atualiza visualmente a barra de progresso do quiz
 */
function atualizarBarraProgresso() {
  const pontos = document.querySelectorAll(".prog-ponto");
  pontos.forEach((ponto, i) => {
    ponto.classList.remove("ativo", "feito");
    if (i < indicePerguntaAtual) {
      ponto.classList.add("feito");
    } else if (i === indicePerguntaAtual) {
      ponto.classList.add("ativo");
    }
  });
}

/**
 * Verifica a resposta escolhida pelo usuário
 * @param {number} indiceEscolhido - Índice da opção clicada
 */
function verificarResposta(indiceEscolhido) {
  if (quizRespondido) return;
  quizRespondido = true;

  const perguntaAtual = perguntasQuiz[indicePerguntaAtual];
  const botoes = document.querySelectorAll(".opcao-btn");

  // Desabilita todos os botões após responder
  botoes.forEach((btn) => (btn.disabled = true));

  const feedback = document.getElementById("quiz-feedback");

  if (indiceEscolhido === perguntaAtual.correta) {
    pontuacaoQuiz++;
    // DOM: marca o botão correto e exibe feedback de sucesso
    botoes[indiceEscolhido].classList.add("correta");
    feedback.className = "sucesso";
    feedback.style.display = "block";
    feedback.innerHTML = `✅ <strong>Correto!</strong> ${perguntaAtual.feedback}`;
  } else {
    // DOM: marca o errado e destaca o correto
    botoes[indiceEscolhido].classList.add("errada");
    botoes[perguntaAtual.correta].classList.add("correta");
    feedback.className = "erro";
    feedback.style.display = "block";
    feedback.innerHTML = `❌ <strong>Incorreto.</strong> ${perguntaAtual.feedback}`;
  }

  // DOM: exibe o botão de avançar
  document.getElementById("btn-proxima").classList.add("visivel");
}

/**
 * Avança para a próxima pergunta ou exibe o resultado final
 */
function avancarPergunta() {
  indicePerguntaAtual++;

  if (indicePerguntaAtual < perguntasQuiz.length) {
    renderizarPergunta();
  } else {
    exibirResultado();
  }
}

/**
 * Exibe o resultado final do quiz e salva nos cookies
 */
function exibirResultado() {
  const total = perguntasQuiz.length;
  const percentual = Math.round((pontuacaoQuiz / total) * 100);

  // DOM: esconde a área de perguntas e mostra o resultado
  document.getElementById("quiz-area").classList.add("oculto");
  const resultado = document.getElementById("quiz-resultado");
  resultado.classList.add("visivel");

  // DOM: preenche os dados do resultado
  document.getElementById("resultado-emoji").textContent =
    percentual === 100 ? "🏆" : percentual >= 70 ? "🌿" : percentual >= 40 ? "📚" : "🌱";

  document.getElementById("resultado-pontuacao").textContent =
    `${pontuacaoQuiz} / ${total} (${percentual}%)`;

  const mensagens = {
    100: "Perfeito! Você domina o MIP. Futuro(a) agrônomo(a)!",
    70: "Muito bem! Você entende os conceitos fundamentais do MIP.",
    40: "Bom começo! Revise o conteúdo e tente novamente.",
    0: "Continue aprendendo! O MIP tem muito a oferecer.",
  };
  const chave = percentual === 100 ? 100 : percentual >= 70 ? 70 : percentual >= 40 ? 40 : 0;
  document.getElementById("resultado-mensagem").textContent = mensagens[chave];

  // Salva o resultado nos cookies e atualiza o badge
  const textoHistorico = `${pontuacaoQuiz}/${total} (${percentual}%) — último teste`;
  definirCookie("agrinho_quiz_historico", textoHistorico, 7);
  const elHistorico = document.getElementById("status-cookie");
  if (elHistorico) elHistorico.textContent = textoHistorico;
}

/**
 * Reinicia o quiz do zero
 */
function reiniciarQuiz() {
  indicePerguntaAtual = 0;
  pontuacaoQuiz = 0;
  quizRespondido = false;

  // DOM: esconde resultado e mostra área de perguntas
  document.getElementById("quiz-resultado").classList.remove("visivel");
  document.getElementById("quiz-area").classList.remove("oculto");

  renderizarPergunta();
}