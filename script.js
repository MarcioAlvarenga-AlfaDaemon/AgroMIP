
document.querySelectorAll('.counter').forEach(el=>{
let t=+el.dataset.target,n=0;
const i=setInterval(()=>{
n++;
el.textContent=n;
if(n>=t) clearInterval(i);
},15);
});

new Chart(document.getElementById('grafico'),{
type:'bar',
data:{
labels:['Controle Químico','Controle Biológico','MIP'],
datasets:[{label:'Impacto Ambiental',data:[90,40,20]}]
}
});

function responder(){
document.getElementById('resultado').innerHTML=
'Reduzir danos causados por pragas utilizando métodos sustentáveis e eficientes.';
}
