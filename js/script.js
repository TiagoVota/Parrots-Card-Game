// Variáveis Globais
const parrotGifs = [
    'bobrossparrot.gif',
    'explodyparrot.gif',
    'fiestaparrot.gif',
    'metalparrot.gif',
    'revertitparrot.gif',
    'tripletsparrot.gif',
    'unicornparrot.gif'
]


let nCards = 0
let nCardsMatched = 0


let playerMoves = 0
let playerTime = 0


// lista que conterá dicionários com informações de cada carta
let listCards = []
// Informações da carta que está virada atualmente
const flippedCard = {
    alreadyFlipped: false,
    id: -1
}


function isValidAnswer(answer) {
    answer = Number(answer)  // Vê o estado numérico da resposta
    
    if (Number.isFinite(answer)) {

        // Se for um número finito, verifica se é um número múltiplo de 2
        answer = Number(answer) / 2
        const isEven = parseInt(answer, 10) == answer
        if (isEven) {

            // Verifica se a metade do número está entre 1 e 7
            if (2 <= answer && answer <= 7) {

                nCards = Number(nCards)
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


function createCard(parrotGif, index, cardsSectionElement) {
    
    
    // Conteúdo de cada carta
    cardElement = `<div class="card" id="${index}" onclick="handleClick(this)">
        <div class="card-faces">
        <img src="./assets/front.png" alt="Papagaio frontal da carta" />
        </div>
        <div class="card-faces card-back">
        <img src="./assets/${parrotGif}" alt="Papagaio em GIF parte de trás da carta" />
        </div>
        </div>`
        
    cardsSectionElement.innerHTML += cardElement
}


function createCards(listOfGifs) {
    const cardsSectionElement = document.querySelector('.cards-section')

    // Adiciona cada uma das n cartas à seção das cartas
    for (let i=0; i<nCards; i++) {

        createCard(listOfGifs[i], i, cardsSectionElement)
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


function countTime() {
    const clockElement = document.querySelector('.clock')
    
    // Reinicia contagem
    playerTime = 0

    // Atualizará sempre o tempo do relógio com o tempo do jogador
    timeIsTicking = setInterval(() => {
        playerTime++
        clockElement.innerHTML = `${playerTime}`
    }, 1000)
}


function initializeGame() {
    // Cria lista com GIFs que serão utilizadas
    const listOfGifs = makeListOfGifs()

    // Cria e distribui as cartas na tela
    createCards(listOfGifs)
    
    // Inicializa informações dos dicionários de cada carta
    makeDictOfCards(listOfGifs)

    // Começa a contagem de tempo
    countTime()
}


function startGame() {
    // Pede com quantas cartas quer jogar
    askCardsNumber()

    // Inicializa o jogo
    initializeGame()
}


function flipCard(cardElement, cardId) {

    // Vira a carta adicionando/removendo o flip dela
    cardElement.classList.toggle('flip')

    // Muda o estado de virada/não virada da carta
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
        
        // Caso deu Match! (duas cartas iguais)
        listCards[cardId].itsAMatch = true
        listCards[idFlippedCard].itsAMatch = true
        
        nCardsMatched += 2
    } else {
        
        // Caso elas sejam diferentes, espera 1seg e vira as duas
        setTimeout(() => {
            flipCard(FlippedCardElement, idFlippedCard)
            flipCard(cardElement, cardId)
        }, 1000)
    }
    
    resetFlippedCard()
}


function gameReadyToFinalize() {
    if (nCardsMatched === nCards) {return true}
    return false
}


function handleClick(cardElement) {

    const cardId = Number(cardElement.id)
    
    if (flippedCard.alreadyFlipped) {
        
        //  Caso tenha alguma carta já virada
        // Caso tenha escolhido uma carta que já deu match, ignore
        if (listCards[cardId].itsAMatch) {return}
        
        // Verifica se clicou numa carta diferente (de id) da anterior
        if (flippedCard.id !== cardId) {

            flipCard(cardElement, cardId)
            playerMoves += 1
            
            // Verifica se temos uma dupla ou não e faz as alterações
            updateChosenCards(cardElement, cardId)
        }
    } else {
        
        // Caso não haja nenhuma carta virada
        if (!listCards[cardId].itsAMatch) {
            
            // Caso não tenha apertado numa carta que já deu match
            flipCard(cardElement, cardId)

            flippedCard.alreadyFlipped = true
            flippedCard.id = cardId
        }
    }

    // Ao final de cada clique verifica se o jogo já acabou
    if (gameReadyToFinalize()) {
        setTimeout(finalizeGame, 100)
    }
}


function isValidReplay(replayAnswer) {
    const validAnswers = ['s', 'sim', 'yep', 'claro', 'com certeza']

    // CASO TENHA CANCELADO O PROMPT
    if (replayAnswer === null) {return true}

    // Tratando resposta e verificando se ela está na lista de possíveis respostas
    replayAnswer = replayAnswer.toLocaleLowerCase()
    if (validAnswers.includes(replayAnswer)) {

        return true
    }
    return false
}

function readyToReplay() {
    const replayAnswer = prompt('Jogar novamente?')

    if (isValidReplay(replayAnswer)) {return true}

    // Caso a resposta não tenha sido válida, refaça a pergunta
    readyToReplay()
}


function clearData() {
    nCards = 0
    nCardsMatched = 0
    playerMoves = 0
    listCards = []
    document.querySelector('.cards-section').innerHTML = ''
}


function finalizeGame() {
    // Finaliza contagem de tempo
    clearInterval(timeIsTicking)  // Calm down Rabbit, my friend

    // MOSTRAR RANKING DO LINDÃO
    alert(`Parabéns! Jogo finalizado em ${playerMoves} movimentos e em ${playerTime} segundos!`)

    // Pede se quer jogar novamente
    readyToReplay()

    // Reseta informações do site
    clearData()

    //  Começa o jogo novamente
    startGame()
}


window.onload = startGame
