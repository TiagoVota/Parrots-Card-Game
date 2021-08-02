// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// -=-=-=-=-=-=-=-=-=-= Variáveis Globais =-=-=-=-=-=-=-=-=-=-
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
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


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// -=-=-=-=-=-=-=-=-=-=-=-=- Funções -=-=-=-=-=-=-=-=-=-=-=-=-
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

function isValidAnswer(answer) {
    answer = Number(answer)  // Vê o estado numérico da resposta
    
    if (Number.isFinite(answer)) {

        // Se for um número finito, verifica se é um número múltiplo de 2
        answer = Number(answer) / 2
        const isEven = parseInt(answer, 10) == answer
        if (isEven) {

            // Verifica se a metade do número está entre 2 e 7
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


function formatTime(time) {
    if (time < 10) {
        return '0' + time
    }
    return time
}


function countTime() {
    // Pegamos os dois elementos que temos para a contagem do tempo,
    // o de minutos e de segundos
    const timeCountersElements = document.querySelectorAll('.time')
    
    // Reinicia contagem e display do tempo na tela
    playerTime = 0
    timeCountersElements[0].innerHTML = '00'
    timeCountersElements[1].innerHTML = '00'

    // Atualizará sempre o tempo do relógio com o tempo do jogador
    timeIsTicking = setInterval(() => {
        playerTime++

        // Mudando os segundos
        let timeSeconds = playerTime % 60
        timeCountersElements[1].innerHTML = `${formatTime(timeSeconds)}`
        
        // Mudando os minutos
        let timeMinutes = (playerTime - timeSeconds) / 60
        timeCountersElements[0].innerHTML = `${formatTime(timeMinutes)}`
    }, 1000)
}


function initializeData() {
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

    // Inicializa as informações do jogo
    initializeData()
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
    // Essa função parte do fato de já ter uma carta virada e você acabou de escolher outra para virar
    const flippedCardId = flippedCard.id
    const flippedCardElement = document.getElementById(`${flippedCardId}`)
    
    if (listCards[cardId].name === listCards[flippedCardId].name) {
        
        // Caso deu Match! (duas cartas iguais)
        listCards[cardId].itsAMatch = true
        listCards[flippedCardId].itsAMatch = true
        
        nCardsMatched += 2
    } else {
        
        // Caso elas sejam diferentes, espera 1seg e vira as duas
        setTimeout(() => {
            flipCard(flippedCardElement, flippedCardId)
            flipCard(cardElement, cardId)
        }, 1000)
    }
    
    resetFlippedCard()
}


function gameReadyToFinalize() {
    if (nCardsMatched === nCards) { return true }
    return false
}


function handleClick(cardElement) {

    const cardId = Number(cardElement.id)
    
    if (flippedCard.alreadyFlipped) {
        
        // Caso tenha escolhido uma carta que já deu match, ignore
        if (listCards[cardId].itsAMatch) { return }
        
        // Verifica se clicou numa carta diferente (de id) da anterior
        if (flippedCard.id !== cardId) {

            flipCard(cardElement, cardId)
            playerMoves += 1
            
            // Verifica se temos uma dupla ou não e faz a lógica envolvida
            updateChosenCards(cardElement, cardId)
        }
    } else {
        
        // Caso não haja nenhuma carta virada e não tenha apertado numa carta que já deu match
        if (!listCards[cardId].itsAMatch) {
            
            flipCard(cardElement, cardId)

            flippedCard.alreadyFlipped = true
            flippedCard.id = cardId
        }
    }

    // Ao final de cada clique verifica se o jogo já acabou
    if (gameReadyToFinalize()) {

        // Se sim, gera um delay para a última carta poder virar
        setTimeout(finalizeGame, 100)
    }
}


function isValidReplay(replayAnswer) {
    const validConfirms = ['s', 'sim', 'yes', 'y', 'yep', 'claro', 'com certeza']
    const validNegations = ['n', 'não', 'no', 'nops', 'nem', 'to de buenas']

    // Caso tenha simplesmente fechado o prompt
    if (replayAnswer === null) { return [true, 'cancel'] }

    // Tratando resposta e verificando se ela está na lista de possíveis respostas
    replayAnswer = replayAnswer.toLocaleLowerCase()
    if (validConfirms.includes(replayAnswer)) { return [true, 'confirm'] }
    else if (validNegations.includes(replayAnswer)) { return [true, 'cancel'] }

    // Caso a resposta seja inválida
    return [false]
}

function readyToReplay() {
    const replayAnswer = prompt('Jogar novamente? Digite \'s\' ou \'n\'!')

    const answerToReplay = isValidReplay(replayAnswer)
    if (answerToReplay[0]) { return answerToReplay[1] }

    // Caso a resposta não tenha sido válida, refaça a pergunta
    return readyToReplay()
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

    // Mostrar resultado do player
    alert(`Parabéns! Jogo finalizado em ${playerMoves} movimentos e em ${playerTime} segundos!`)

    // Pede se quer jogar novamente e verifica sua resposta
    const isReadyToReplay = readyToReplay()
    if (isReadyToReplay === 'cancel') { return }

    // Reseta informações do site
    clearData()

    //  Começa o jogo novamente
    startGame()
}


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// -=-=-=-=-=-=-=-=-=-=-= Inicialização =-=-=-=-=-=-=-=-=-=-=-
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Quando a página estiver carregada, inicia o jogo!
window.onload = startGame
