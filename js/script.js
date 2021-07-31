// Variáveis Globais
let n_cards = 0

const pathParrotGifs = [
    '../assets/bobrossparrot.gif',
    '../assets/explodyparrot.gif',
    '../assets/fiestaparrot.gif',
    '../assets/metalparrot.gif',
    '../assets/revertitparrot.gif',
    '../assets/tripletsparrot.gif',
    '../assets/unicornparrot.gif'
]

// window.onload = askNumberCards


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


function askNumberCards() {
    while (isValidAnswer(n_cards) !== true) {
        n_cards = prompt("Escolha um número par de cartas entre 04 e 14!")
    }
}


function random_number() {return Math.random()}


function makeListOfGifs() {
    const n_gifs = n_cards / 2

    // Randomizar a ordem dos GIFs antes de escolher quais serão utilizados
    let listOfGifs = pathParrotGifs.sort(random_number)

    listOfGifs = [...listOfGifs[n_gifs], ...listOfGifs[n_gifs]]

    listOfGifs.sort(random_number)

    return listOfGifs
}
