/**
* Essa função é showdi
* @param {number} n1 é o primeiro número
* @param {number} n2 é o segundo número
* @return {number} a soma dos carinhas
*/
function teste(n1, n2) {
    return n1 + n2
}


function isValidAnswer(answer) {
    answer = Number(answer)  // Vê o estado numérico da resposta
    
    if (Number.isFinite(answer)) {

        // Se for um número finito, verifica se é um número múltiplo de 2
        answer = Number(answer) / 2
        const isEven = parseInt(answer, 10) == answer
        if (isEven) {

            // Verifica se a metade do número está entre 1 e 7
            if (1 <= answer && answer <= 7) {

                return true
            }
        }  
    }

    // Caso não seja um número par entre 2 e 14
    return false
}

