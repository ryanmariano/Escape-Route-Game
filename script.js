const canvas = document.getElementById("mazeCanvas");
const contexto = canvas.getContext("2d");
const tamanhoBloco = 50;

// Matriz do Labirinto
const labirinto = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 4, 1] // Saída (ponto vermelho)
];

let jogadorX = 1, jogadorY = 1; // Posição inicial do jogador

function desenharLabirinto() {
    for (let i = 0; i < labirinto.length; i++) {
        for (let j = 0; j < labirinto[i].length; j++) {
            if (labirinto[i][j] === 1) {
                contexto.fillStyle = "black"; // Paredes
            } else if (labirinto[i][j] === 0) {
                contexto.fillStyle = "white"; // Corredores
            } else if (labirinto[i][j] === 4) {
                contexto.fillStyle = "red"; // Saída
            }
            contexto.fillRect(j * tamanhoBloco, i * tamanhoBloco, tamanhoBloco, tamanhoBloco);
        }
    }
    
    // Desenha o jogador
    contexto.fillStyle = "green";
    contexto.fillRect(jogadorY * tamanhoBloco, jogadorX * tamanhoBloco, tamanhoBloco, tamanhoBloco);
}

// Movimentação com as setas do teclado
document.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowUp") moverJogador(-1, 0);
    if (evento.key === "ArrowDown") moverJogador(1, 0);
    if (evento.key === "ArrowLeft") moverJogador(0, -1);
    if (evento.key === "ArrowRight") moverJogador(0, 1);
});

function moverJogador(dx, dy) {
    let novoX = jogadorX + dx;
    let novoY = jogadorY + dy;

    if (labirinto[novoX][novoY] === 0 || labirinto[novoX][novoY] === 4) {
        jogadorX = novoX;
        jogadorY = novoY;
        desenharLabirinto();
        verificarChegada(); // Aciona o BFS automaticamente quando chega ao ponto vermelho
    }
}

// Algoritmo BFS no JavaScript
function bfs(matriz, inicio, fim) {
    let filas = [[inicio]];
    let visitados = new Set();
    visitados.add(inicio.toString());

    while (filas.length > 0) {
        let caminho = filas.shift();
        let [x, y] = caminho[caminho.length - 1];

        if (x === fim[0] && y === fim[1]) {
            return caminho;
        }

        for (let [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            let novoX = x + dx, novoY = y + dy;
            let novoPos = [novoX, novoY].toString();

            if (novoX >= 0 && novoX < matriz.length && novoY >= 0 && novoY < matriz[0].length && matriz[novoX][novoY] !== 1) {
                if (!visitados.has(novoPos)) {
                    visitados.add(novoPos);
                    filas.push([...caminho, [novoX, novoY]]);
                }
            }
        }
    }
    return [];
}

// Verifica se o jogador chegou à saída e aciona o BFS automaticamente
function verificarChegada() {
    if (labirinto[jogadorX][jogadorY] === 4) {
        let rota = bfs(labirinto, [1, 1], [jogadorX, jogadorY]);
        destacarRota(rota);
    }
}

// Destaca o melhor caminho na tela
function destacarRota(rota) {
    contexto.fillStyle = "blue"; // Cor da rota segura
    rota.forEach(([x, y]) => {
        contexto.fillRect(y * tamanhoBloco, x * tamanhoBloco, tamanhoBloco, tamanhoBloco);
    });
}

desenharLabirinto();