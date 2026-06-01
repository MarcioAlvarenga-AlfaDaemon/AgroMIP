const btnHamburguer =
document.getElementById("menu-hamburguer");

const navMenu =
document.getElementById("nav-menu");

btnHamburguer.addEventListener("click",()=>{

navMenu.classList.toggle("ativo");

});

function animarContador(id, alvo){

let numero = 0;

const intervalo = setInterval(()=>{

numero++;

document.getElementById(id).textContent = numero;

if(numero >= alvo){

clearInterval(intervalo);

}

},20);

}

animarContador("contador1",80);
animarContador("contador2",95);
animarContador("contador3",90);

function verificarQuiz(correto){

const resultado =
document.getElementById("resultadoQuiz");

if(correto){

resultado.innerHTML =
"✅ Resposta correta!";

}else{

resultado.innerHTML =
"❌ Tente novamente.";

}

}

const tema =
document.getElementById("tema");

tema.addEventListener("click",()=>{

document.body.classList.toggle("dark");

});