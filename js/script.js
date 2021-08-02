// Variáveis Globais
let nCards = 0
nCards = 14

// lista que conterá dicionários com informações de cada carta
const listCards = []


// Informações da carta que está virada atualmente
const flippedCard = {
    alreadyFlipped: false,
    id: -1
}


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


function random_number() {return Math.random() - 0.5}


function makeListOfGifs() {
    const nGifs = nCards / 2

    // Randomizar a ordem dos GIFs e depois escolhe quais serão utilizados
    let listOfGifs = parrotGifs.sort(random_number).slice(0, nGifs)
    
    // Duplica lista de GIFs porque temos duas cartas com cada um deles
    listOfGifs = [...listOfGifs, ...listOfGifs]
    
    listOfGifs.sort(random_number)

    return listOfGifs
}


function createCard(parrotGif, index) {
    mainElement = document.querySelector('main')
    
    // Conteúdo de cada carta
    cardElement = `<div class="card" id="${index}" onclick="handleClick(this)">
        <div class="card-faces">
        <img src="./assets/front.png" alt="Papagaio frontal da carta" />
        </div>
        <div class="card-faces card-back">
        <img src="./assets/${parrotGif}" alt="Papagaio em GIF parte de trás da carta" />
        </div>
        </div>`
        
    mainElement.innerHTML += cardElement
}


function createCards(listOfGifs) {
    // Adiciona cada uma das n cartas ao main
    for (let i=0; i<nCards; i++) {
        createCard(listOfGifs[i], i)
    }
}


function makeDictOfCards(listOfGifs) {
    for (let i=0; i<nCards; i++) {
        dictCard = {
            name: listOfGifs[i],
            id: i,
            isFlipped: false,
            itsAMatch: false
        }
        
        listCards.push(dictCard)
    }
    
    return listCards
}


function initializeGame() {
    // Cria lista com GIFs que serão utilizadas
    const listOfGifs = makeListOfGifs()

    // Cria e distribui as cartas na tela
    createCards(listOfGifs)
    
    // Inicializa informações dos dicionários de cada carta
    makeDictOfCards(listOfGifs)
    
    
}

initializeGame()



function flipCard(cardElement, cardId) {
    // Caso já tenha escolhido duas iguais
    if (listCards[cardId].itsAMatch) {return}

    // Vira a carta adicionando/removendo o flip dela
    cardElement.classList.toggle('flip')
    // console.log('flip!')

    console.log(`flipou do id ${cardId}`)
    console.log(flippedCard)
    console.log('')

    listCards[cardId].isFlipped = !listCards[cardId].isFlipped

    
}


function resetFlippedCard() {
    flippedCard.alreadyFlipped = false
    flippedCard.id = -1
}


function updateChosenCards(cardElement, cardId) {
    const idFlippedCard = flippedCard.id
    const FlippedCardElement = document.getElementById(`${idFlippedCard}`)
    if (listCards[cardId].name === listCards[idFlippedCard].name) {
        // APERTEI EM DUAS IGUAIS
        listCards[cardId].itsAMatch = true
        listCards[idFlippedCard].itsAMatch = true

    } else {

        // Caso elas sejam diferentes, espera 1seg e vira as duas
        setTimeout(() => {
            flipCard(FlippedCardElement, idFlippedCard)
            flipCard(cardElement, cardId)
        }, 1000)
    }

    resetFlippedCard()
}

function handleClick(cardElement) {
    const cardId = Number(cardElement.id)
    
    //  TEM ALGUMA JÁ FLIPPADA?
    if (flippedCard.alreadyFlipped) {
        
        // cliquei numa diferente?
        if (flippedCard.id !== cardId) {
            flipCard(cardElement, cardId)
            
            // VAI ANALIZAR E FAZER AS DEVIDAS MUDANÇAS
            updateChosenCards(cardElement, cardId)
            // SE FOR IGUAL --> MANTÉM VIRADA PRA CIMA
            
            // SE FOR DIFERENTE --> DESVIREM
        }
    } else {
        
        flipCard(cardElement, cardId)
        // CASO NÃO TENHA NENHUMA VIRADA
        if (!listCards[cardId].itsAMatch) {

            // CASO VOCÊ NÃO TENHA CLICADO NUM MATCH
            flippedCard.alreadyFlipped = true
            flippedCard.id = cardId
        }
    }
    
}
