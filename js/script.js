// Variáveis Globais
let nCards = 0
nCards = 14

const parrotGifs = [
    'bobrossparrot.gif',
    'explodyparrot.gif',
    'fiestaparrot.gif',
    'metalparrot.gif',
    'revertitparrot.gif',
    'tripletsparrot.gif',
    'unicornparrot.gif'
]

// window.onload = askCardsNumber


function isValidAnswer(answer) {
    answer = Number(answer)  // Vê o estado numérico da resposta
    
    if (Number.isFinite(answer)) {

        // Se for um número finito, verifica se é um número múltiplo de 2
        answer = Number(answer) / 2
        const isEven = parseInt(answer, 10) == answer
        if (isEven) {

            // Verifica se a metade do número está entre 1 e 7
            if (2 <= answer && answer <= 7) {

                return true
            }
        }  
    }

    // Caso não seja um número par entre 2 e 14
    return false
}


function askCardsNumber() {
    while (isValidAnswer(nCards) !== true) {
        nCards = prompt("Escolha um número par de cartas entre 04 e 14 :3")
    }
}


function random_number() {return Math.random() - 0.5}  // NÃO ENTENDI PQ TEM QUE SUBTRAIR 0.5, MAS PRECISA PARA PODER EMBARALHAR


function makeListOfGifs() {
    const nGifs = nCards / 2

    // Randomizar a ordem dos GIFs e depois escolhe quais serão utilizados
    let listOfGifs = parrotGifs.sort(random_number).slice(0, nGifs)
    
    // Duplica lista de GIFs porque temos duas cartas com cada um deles
    listOfGifs = [...listOfGifs, ...listOfGifs]
    
    listOfGifs.sort(random_number)

    return listOfGifs
}


function flipCard(cardElement) {
    // Gira a carta adicionando/removendo o flip dela
    cardElement.classList.toggle('flip')
}


function createCard(parrotGif, index) {
    mainElement = document.querySelector('main')

    // Conteúdo de cada carta
    cardElement = `<div class="card" id="${index}" onclick="flipCard(this)">
        <div class="card-faces">
            <img src="./assets/front.png" alt="Papagaio frontal da carta" />
        </div>
        <div class="card-faces card-back">
            <img src="./assets/${parrotGif}" alt="Papagaio em GIF parte de trás da carta" />
        </div>
    </div>`

    mainElement.innerHTML += cardElement
}


function createCards() {

    // Cria lista com GIFs que serão utilizadas
    const listOfGifs = makeListOfGifs()

    // Adiciona cada uma das n cartas ao main
    for (let i=0; i<nCards; i++) {
        createCard(listOfGifs[i], i)
    }
}

createCards()