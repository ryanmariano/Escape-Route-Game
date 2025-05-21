const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const tamanhoBloco = 50;

// Elementos das telas
const menuInicio = document.getElementById("menuInicio");
const telaJogo = document.getElementById("telaJogo");
const popupParabens = document.getElementById("popupParabens"); // Corrigido para match com HTML
const btnIniciar = document.getElementById("btnIniciar");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnDica = document.getElementById("btnDica");

// Labirinto (1: parede, 0: caminho, 4: saída)
const labirinto = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 4, 1]
];

let jogadorX = 1, jogadorY = 1;
let caminhoSolucao = [];

// Eventos
btnIniciar.addEventListener("click", iniciarJogo);
btnReiniciar.addEventListener("click", reiniciarJogo);
btnDica.addEventListener("click", () => destacarRota(caminhoSolucao));

function iniciarJogo() {
    menuInicio.style.display = "none";
    telaJogo.style.display = "block";
    popupParabens.style.display = "none";
    caminhoSolucao = bfs(labirinto, [1, 1], [6, 7]);
    jogadorX = 1;
    jogadorY = 1;
    desenharLabirinto();
}

function reiniciarJogo() {
    popupParabens.style.display = "none";
    iniciarJogo();
}

// Desenha o labirinto e o jogador
function desenharLabirinto() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha o labirinto
    for (let i = 0; i < labirinto.length; i++) {
        for (let j = 0; j < labirinto[i].length; j++) {
            ctx.fillStyle = 
                labirinto[i][j] === 1 ? "black" : 
                labirinto[i][j] === 4 ? "red" : "white";
            ctx.fillRect(j * tamanhoBloco, i * tamanhoBloco, tamanhoBloco, tamanhoBloco);
        }
    }
    
    // Desenha o jogador
    ctx.fillStyle = "green";
    ctx.fillRect(jogadorY * tamanhoBloco, jogadorX * tamanhoBloco, tamanhoBloco, tamanhoBloco);
}

// Movimentação do jogador
document.addEventListener("keydown", (evento) => {
    const teclas = {
        "ArrowUp": [-1, 0],
        "ArrowDown": [1, 0],
        "ArrowLeft": [0, -1],
        "ArrowRight": [0, 1]
    };

    if (teclas[evento.key]) {
        const [dx, dy] = teclas[evento.key];
        const novoX = jogadorX + dx;
        const novoY = jogadorY + dy;

        if (labirinto[novoX]?.[novoY] !== undefined && labirinto[novoX][novoY] !== 1) {
            jogadorX = novoX;
            jogadorY = novoY;
            desenharLabirinto();
            
            // Verifica se chegou ao final
            if (labirinto[novoX][novoY] === 4) {
                destacarRota(caminhoSolucao); // Mostra o caminho
                setTimeout(() => {
                    popupParabens.style.display = "flex"; // Mostra popup
                }, 500);
            }
        }
    }
});

// Algoritmo BFS (mantido igual)
function bfs(matriz, inicio, fim) {
    const fila = [[inicio]];
    const visitados = new Set();
    visitados.add(inicio.toString());

    while (fila.length > 0) {
        const caminho = fila.shift();
        const [x, y] = caminho[caminho.length - 1];

        if (x === fim[0] && y === fim[1]) {
            return caminho;
        }

        const movimentos = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [dx, dy] of movimentos) {
            const novoX = x + dx;
            const novoY = y + dy;
            const novaPos = [novoX, novoY].toString();

            if (novoX >= 0 && novoX < matriz.length &&
                novoY >= 0 && novoY < matriz[0].length &&
                matriz[novoX][novoY] !== 1 &&
                !visitados.has(novaPos)) {
                visitados.add(novaPos);
                fila.push([...caminho, [novoX, novoY]]);
            }
        }
    }
    return [];
}

// Destaca o caminho
function destacarRota(rota) {
    ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
    rota.forEach(([x, y]) => {
        ctx.fillRect(y * tamanhoBloco, x * tamanhoBloco, tamanhoBloco, tamanhoBloco);
    });
    // Redesenha o jogador por cima
    ctx.fillStyle = "green";
    ctx.fillRect(jogadorY * tamanhoBloco, jogadorX * tamanhoBloco, tamanhoBloco, tamanhoBloco);
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    menuInicio.style.display = "block";
    telaJogo.style.display = "none";
    popupParabens.style.display = "none";
});