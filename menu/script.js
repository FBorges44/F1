const texto= "Seja bem vindo ao nosso site"

let indice=0

function digitar(){
    if(texto<indice.length){
        document.getElementById("texto").innerHTML += texto.charAt(indice);
        indice++;
        setTimeout(digitar,80)
    }
}
window.onload=digitar;