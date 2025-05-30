// script.js - Código Completo Atualizado com Todas as Melhorias
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const tamanhoBloco = 50;

// Elementos da interface
const elementos = {
    menu: document.getElementById("menuInicio"),
    jogo: document.getElementById("telaJogo"),
    popup: document.getElementById("popupParabens"),
    final: document.getElementById("telaFinal"),
    gameOver: document.getElementById("telaGameOver"),
    botoes: {
        iniciar: document.getElementById("btnIniciar"),
        dica: document.getElementById("btnDica"),
        reiniciar: document.getElementById("btnReiniciarFase"),
        proximaFase: document.getElementById("btnProximaFase"),
        menu: document.getElementById("btnMenuPrincipal"),
        voltarFinal: document.getElementById("btnVoltarMenuFinal"),
        reiniciarGameOver: document.getElementById("btnReiniciarGameOver")
    },
    textos: {
        fase: document.getElementById("textoFase"),
        movimentos: document.getElementById("contadorMovimentos"),
        tempo: document.getElementById("contadorTempo"),
        vitoria: document.getElementById("mensagemVitoria"),
        totalMovimentos: document.getElementById("totalMovimentos"),
        tempoTotal: document.getElementById("tempoTotal")
    }
};

// Fases do jogo (com 4 níveis de dificuldade)
const fases = [
    // Fase 1 (Inicial)
    [
        [1,1,1,1,1,1,1,1,1],
        [1,0,0,1,0,0,0,0,1],
        [1,0,1,1,0,1,1,0,1],
        [1,0,1,0,0,0,1,0,1],
        [1,0,1,0,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,1],
        [1,1,1,1,1,1,1,4,1]
    ],
    // Fase 2 (Intermediária)
    [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,1,0,0,0,1],
        [1,0,1,1,0,1,0,1,0,1],
        [1,0,1,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,4,1]
    ],
    // Fase 3 - "O Pesadelo" (13x13)
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,1,1,0,1],
        [1,0,1,0,1,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,1,0,1],
        [1,0,1,1,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,0,0,1,0,1,0,1,0,1],
        [1,1,1,1,1,0,1,0,1,0,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,4,1]
    ],
    // Fase 4 - "O Inferno" (15x15)
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,1,0,1,0,1],
        [1,0,1,1,1,1,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,1,0,1,0,1],
        [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,4,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
];

// Estado do jogo
let estado = {
    faseAtual: 0,
    jogador: { x: 1, y: 1 },
    movimentos: 0,
    movimentosTotais: 0,
    caminho: [],
    caminhoVisivel: false,
    dicaAtiva: false,
    tempoFase: 120, // Tempo por fase em segundos
    tempoRestante: 0,
    intervaloTime: null,
    tempoInicio: null,
    intervaloContador: null
};

// Inicialização
function init() {
    if (!window.confetti) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
        script.onload = setupJogo;
        document.head.appendChild(script);
    } else {
        setupJogo();
    }
}

function setupJogo() {
    elementos.menu.style.display = "flex";
    elementos.jogo.style.display = "none";
    elementos.popup.style.display = "none";
    elementos.final.style.display = "none";
    elementos.gameOver.style.display = "none";

    // Event listeners
    elementos.botoes.iniciar.addEventListener("click", iniciarJogo);
    elementos.botoes.dica.addEventListener("click", mostrarDicaTemporaria);
    elementos.botoes.reiniciar.addEventListener("click", reiniciarFase);
    elementos.botoes.proximaFase.addEventListener("click", proximaFase);
    elementos.botoes.menu.addEventListener("click", voltarAoMenu);
    elementos.botoes.voltarFinal.addEventListener("click", voltarAoMenuFinal);
    elementos.botoes.reiniciarGameOver.addEventListener("click", reiniciarFase);
    document.addEventListener("keydown", moverJogador);
}

// Funções do jogo
function iniciarJogo() {
    estado.faseAtual = 0;
    estado.movimentosTotais = 0;
    estado.tempoInicio = Date.now();
    iniciarContadorTempo();
    carregarFase(estado.faseAtual);
    elementos.menu.style.display = "none";
    elementos.jogo.style.display = "block";
}

function iniciarContadorTempo() {
    if (estado.intervaloContador) clearInterval(estado.intervaloContador);
    estado.intervaloContador = setInterval(atualizarContadorTempo, 1000);
}

function atualizarContadorTempo() {
    if (!estado.tempoInicio) return;
    const segundos = Math.floor((Date.now() - estado.tempoInicio) / 1000);
    const minutos = Math.floor(segundos / 60);
    elementos.textos.tempoTotal.textContent = 
        `${minutos.toString().padStart(2, '0')}:${(segundos % 60).toString().padStart(2, '0')}`;
}

// Timer por fase
function iniciarTimer() {
    estado.tempoRestante = estado.tempoFase;
    clearInterval(estado.intervaloTime);
    
    estado.intervaloTime = setInterval(() => {
        estado.tempoRestante--;
        elementos.textos.tempo.textContent = `Tempo: ${estado.tempoRestante}s`;
        
        if (estado.tempoRestante <= 0) {
            clearInterval(estado.intervaloTime);
            elementos.jogo.style.display = "none";
            elementos.gameOver.style.display = "flex";
        }
    }, 1000);
}

function carregarFase(indice) {
    const labirinto = fases[indice];
    canvas.width = labirinto[0].length * tamanhoBloco;
    canvas.height = labirinto.length * tamanhoBloco;

    estado.jogador = { x: 1, y: 1 };
    estado.movimentos = 0;
    estado.caminhoVisivel = false;
    estado.dicaAtiva = false;
    elementos.textos.fase.textContent = `Fase ${indice + 1}`;
    elementos.textos.movimentos.textContent = `Movimentos: 0`;

    iniciarTimer();
    const saida = encontrarSaida(labirinto);
    estado.caminho = bfs(labirinto, [1, 1], saida);
    desenharLabirinto(labirinto);
}

// Desenho com tema de incêndio
function desenharLabirinto(labirinto) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Cores temáticas
    const cores = {
        parede: "#8B0000",    // Vermelho escuro
        chao: "#FFE4C4",      // Branco amarelado
        saida: "#FF0000",     // Vermelho vivo
        jogador: "#32CD32",   // Verde lima
        dica: "rgba(255, 69, 0, 0.3)" // Laranja transparente
    };

    // Desenha células
    for (let i = 0; i < labirinto.length; i++) {
        for (let j = 0; j < labirinto[i].length; j++) {
            ctx.fillStyle = 
                labirinto[i][j] === 1 ? cores.parede : 
                labirinto[i][j] === 4 ? cores.saida : cores.chao;
            ctx.fillRect(j * tamanhoBloco, i * tamanhoBloco, tamanhoBloco, tamanhoBloco);
            ctx.strokeStyle = "#FF4500";
            ctx.strokeRect(j * tamanhoBloco, i * tamanhoBloco, tamanhoBloco, tamanhoBloco);
        }
    }

    // Desenha caminho BFS se visível
    if (estado.caminhoVisivel) {
        ctx.fillStyle = cores.dica;
        estado.caminho.forEach(([x, y]) => {
            ctx.fillRect(y * tamanhoBloco, x * tamanhoBloco, tamanhoBloco, tamanhoBloco);
        });
    }

    // Desenha jogador
    ctx.fillStyle = cores.jogador;
    ctx.beginPath();
    ctx.arc(
        (estado.jogador.y * tamanhoBloco) + (tamanhoBloco / 2),
        (estado.jogador.x * tamanhoBloco) + (tamanhoBloco / 2),
        tamanhoBloco / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Algoritmo BFS (modificado para dica contextual)
function bfs(matriz, inicio, fim) {
    const fila = [[inicio]];
    const visitados = new Set([inicio.toString()]);

    while (fila.length > 0) {
        const caminho = fila.shift();
        const [x, y] = caminho[caminho.length - 1];

        if (x === fim[0] && y === fim[1]) return caminho;

        for (const [dx, dy] of [[-1,0], [1,0], [0,-1], [0,1]]) {
            const nx = x + dx, ny = y + dy;
            const pos = [nx, ny].toString();

            if (nx >= 0 && nx < matriz.length && 
                ny >= 0 && ny < matriz[0].length &&
                matriz[nx][ny] !== 1 && 
                !visitados.has(pos)) {
                visitados.add(pos);
                fila.push([...caminho, [nx, ny]]);
            }
        }
    }
    return [];
}

function encontrarSaida(labirinto) {
    for (let i = 0; i < labirinto.length; i++) {
        for (let j = 0; j < labirinto[i].length; j++) {
            if (labirinto[i][j] === 4) return [i, j];
        }
    }
    return [labirinto.length-2, labirinto[0].length-2];
}

// Controles
function moverJogador(e) {
    const teclas = {
        "ArrowUp": [-1, 0],
        "ArrowDown": [1, 0],
        "ArrowLeft": [0, -1],
        "ArrowRight": [0, 1],
        " ": () => mostrarDicaTemporaria()
    };

    if (teclas[e.key] instanceof Function) {
        teclas[e.key]();
        return;
    }

    if (teclas[e.key]) {
        const [dx, dy] = teclas[e.key];
        const labirinto = fases[estado.faseAtual];
        const novoX = estado.jogador.x + dx;
        const novoY = estado.jogador.y + dy;

        if (labirinto[novoX]?.[novoY] !== undefined && labirinto[novoX][novoY] !== 1) {
            if (estado.dicaAtiva) {
                estado.caminhoVisivel = false;
                estado.dicaAtiva = false;
            }

            estado.jogador.x = novoX;
            estado.jogador.y = novoY;
            estado.movimentos++;
            elementos.textos.movimentos.textContent = `Movimentos: ${estado.movimentos}`;
            
            desenharLabirinto(labirinto);
            
            if (labirinto[novoX][novoY] === 4) {
                estado.caminhoVisivel = true;
                desenharLabirinto(labirinto);
                
                setTimeout(() => {
                    elementos.textos.vitoria.textContent = 
                        `Você completou a fase ${estado.faseAtual + 1} em ${estado.movimentos} movimentos!`;
                    elementos.popup.style.display = "flex";
                }, 500);
            }
        }
    }
}

// Dica contextual (BFS a partir da posição atual)
function mostrarDicaTemporaria() {
    if (!estado.dicaAtiva) {
        const labirinto = fases[estado.faseAtual];
        const saida = encontrarSaida(labirinto);
        
        estado.caminho = bfs(labirinto, [estado.jogador.x, estado.jogador.y], saida);
        estado.caminhoVisivel = true;
        estado.dicaAtiva = true;
        desenharLabirinto(labirinto);
        
        setTimeout(() => {
            estado.caminhoVisivel = false;
            estado.dicaAtiva = false;
            desenharLabirinto(labirinto);
        }, 3000);
    }
}

function reiniciarFase() {
    clearInterval(estado.intervaloTime);
    estado.caminhoVisivel = false;
    estado.dicaAtiva = false;
    elementos.popup.style.display = "none";
    elementos.gameOver.style.display = "none";
    carregarFase(estado.faseAtual);
}

function proximaFase() {
    clearInterval(estado.intervaloTime);
    estado.movimentosTotais += estado.movimentos;
    estado.faseAtual++;
    elementos.popup.style.display = "none";
    
    if (estado.faseAtual < fases.length) {
        carregarFase(estado.faseAtual);
    } else {
        finalizarJogo();
    }
}

function finalizarJogo() {
    clearInterval(estado.intervaloContador);
    
    const segundos = Math.floor((Date.now() - estado.tempoInicio) / 1000);
    const minutos = Math.floor(segundos / 60);
    elementos.textos.tempoTotal.textContent = 
        `${minutos.toString().padStart(2, '0')}:${(segundos % 60).toString().padStart(2, '0')}`;
    
    elementos.textos.totalMovimentos.textContent = estado.movimentosTotais + estado.movimentos;
    
    elementos.jogo.style.display = "none";
    elementos.final.style.display = "flex";
    iniciarEfeitoConfete();
}

function iniciarEfeitoConfete() {
    if (!window.confetti) return;
    
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) return clearInterval(interval);
        
        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}

function voltarAoMenu() {
    clearInterval(estado.intervaloTime);
    elementos.popup.style.display = "none";
    elementos.menu.style.display = "flex";
    elementos.jogo.style.display = "none";
    elementos.botoes.proximaFase.style.display = "block";
}

function voltarAoMenuFinal() {
    elementos.final.style.display = "none";
    elementos.menu.style.display = "flex";
    if (window.confetti) confetti.reset();
}

// Inicia o jogo
document.addEventListener("DOMContentLoaded", init);