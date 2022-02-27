let order = [];
let clickedOrder = [];
let score;
const player = {}; //Objeto q poderá ser salvo no localStorage

const blue = document.querySelector('.blue')
const red = document.querySelector('.red')
const green = document.querySelector('.green')
const yellow = document.querySelector('.yellow')

//Alterna entre o iniciar do jogo ou o ranking
const openOrClose = () => {
    const rankingDiv = document.getElementsByClassName('ranking-div')[0];
    const usernameDiv = document.getElementsByClassName('username-div')[0];
    rankingDiv.classList.toggle('d-none');
    usernameDiv.classList.toggle('d-none');

    listRanking(rankingDiv);
}

//lista o ranking
const listRanking = rankDiv => {
    const scoreView = document.getElementById('scores-view');
    scoreView.innerHTML = '';

    if (!rankDiv.classList.contains('d-none')) {
        if (localStorage.length > 0) {
            for (let i = 0; i < localStorage.length; i++) {
                let pScore = document.createElement('p');

                let objScore = JSON.parse(localStorage.getItem(i + 1));
                pScore.innerHTML += `${i + 1}º ${objScore.name}: ${objScore.score} pontos`;
                scoreView.appendChild(pScore);
            }
        } else {
            scoreView.innerHTML = 'Não existe dados para mostrar!'
        }
    }
}
//salva o username, verifica a opção para daltônicos e inicia o jogo
const play = () => {
    const name = document.getElementById('username').value;
    const shadowDiv = document.getElementsByClassName('shadow')[0];
    const colorBlind = document.getElementById('color-blind');
    const legendColorBlind = document.getElementsByClassName('c-blind');

    if (name.trim() === '') {
        alert('Digite algum nome');
        return
    }

    if (colorBlind.checked) {
        for (let i = 0; i < legendColorBlind.length; i++) {
            legendColorBlind[i].classList.remove('d-none');
        }
    }
    player.name = name;
    shadowDiv.classList.add('d-none');

    playGame();
}

//Cria ordem aleatoria de cores
const shuffleOrder = () => {
    let colorOrder = Math.floor(Math.random() * 4);
    order.push(colorOrder);
    clickedOrder = [];

    for (let i in order) {
        let elementColor = createColorElement(order[i]);
        ligthColor(elementColor, Number(i) + 1);
    }
}

//acende a próxima cor
const ligthColor = (element, number) => {
    number = number * 500;
    setTimeout(() => {
        element.classList.add('selected');
    }, number - 250);
    setTimeout(() => {
        element.classList.remove('selected');
    }, number + 100)
}

//Checa se os botões clicados são os mesmos da ordem gerada no jogo
const checkOrder = () => {
    for (let i in clickedOrder) {
        if (clickedOrder[i] != order[i]) {
            gameOver();
            break;
        }
    }
    if (clickedOrder.length == order.length) {
        score++;
        alert(`Pontuação: ${score}\nVocê acertou! Iniciando próximo nível!`);
        nextLevel();
    }
}

//função para o clique do usuario
const click = color => {
    clickedOrder.push(color);
    createColorElement(color).classList.add('selected');

    setTimeout(() => {
        createColorElement(color).classList.remove('selected');
        checkOrder();
    }, 250)
}

//função que retorna a cor 
const createColorElement = color => {
    const colorArray = [green, red, yellow, blue];
    return colorArray[color];
}

//função para próximo nível do jogo
const nextLevel = () => {
    shuffleOrder();
}

//função para game over
const gameOver = () => {
    alert(`Pontuação: ${score}\nVocê perdeu o jogo!\nClique em OK para iniciar um novo jogo`);
    order = [];
    clickedOrder = [];

    analyzeScore();
    playGame();
}

//função de inicio de jogo
let playGame = () => {
    score = 0;
    player.score = 0;
    nextLevel();
}

green.onclick = () => click(0);
red.onclick = () => click(1);
yellow.onclick = () => click(2);
blue.onclick = () => click(3);

//COMPARAR E ORGANIZAR LOCAL HOST APENAS QUANDO O JOGO ACABAR
const analyzeScore = () => {
    const currentRanking = []
    player.score = score

    if (localStorage.length > 0) {
        for (let i = 0; i < localStorage.length; i++) {
            currentRanking.push(JSON.parse(localStorage.getItem(i + 1)));
        }
    }

    if (currentRanking.length < 3) {
        currentRanking.push(player);
    } else {
        for (let i = currentRanking.length; i > 0; i--) {
            if (player.score >= currentRanking[i-1].score) {
                currentRanking.splice(i - 1, 1, player);
                break;
            }
        }
    }

    currentRanking.sort((a, b) => parseInt(a.score) - parseInt(b.score)).reverse()

    for (let i = 0; i < currentRanking.length; i++) {
        localStorage.setItem(i + 1, JSON.stringify(currentRanking[i]))
    }
}