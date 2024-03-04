const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const scoreText = document.querySelector('#scoreText')
const button = document.querySelector('button')
const scoreDiv = document.querySelector('#scoreDiv')

const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30
let score = 0

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

ctx.scale(BLOCK_SIZE, BLOCK_SIZE)

const createBoard = (width, height) => {
    return Array(height).fill().map(() => Array(width).fill(0))
}

const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)

const PIECES = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ],
]

const piece = {
    position: { x: 5, y: 5},
    shape: PIECES[Math.floor(Math.random() * PIECES.length)]
}

let dropCounter = 0
let lastTime = 0

function update(time = 0){
    const deltaTime = time - lastTime
    lastTime = time

    dropCounter += deltaTime

    let dropInterval = 1000
    if(score > 50 && score < 100){
        dropInterval = 500
    }else if(score > 100){
        dropInterval = 300
    }

    if(dropCounter > dropInterval){
        piece.position.y++
        dropCounter = 0

        if(checkCollision()){
            piece.position.y--
            solidifyPiece()
            removeRows()
        }
    }

    draw()
    window.requestAnimationFrame(update)
}


function draw(){
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value == 1) {
                // Relleno principal
                ctx.fillStyle = 'yellow';
                ctx.fillRect(x, y, 1, 1);
    
                // Borde más oscuro
                ctx.fillStyle = 'darkgoldenrod'; // Puedes ajustar el color oscuro según tus preferencias
                ctx.fillRect(x + 0.1, y + 0.1, 0.8, 0.8);
            }
        });
    });

    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value == 1) {
                // Relleno principal
                ctx.fillStyle = 'red';
                ctx.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
    
                // Borde más oscuro
                ctx.fillStyle = 'darkred'; // Puedes ajustar el color oscuro según tus preferencias
                ctx.fillRect(x + piece.position.x + 0.1, y + piece.position.y + 0.1, 0.8, 0.8);
            }
        });
    });
}

document.addEventListener('keydown', event => {
    if(event.key == 'ArrowLeft'){
        piece.position.x--
        if(checkCollision()){
            piece.position.x++
        }
    }

    if(event.key == 'ArrowRight'){
        piece.position.x++
        if(checkCollision()){
            piece.position.x--
        }
    }

    if(event.key == 'ArrowDown'){
        piece.position.y++
        if(checkCollision()){
            piece.position.y--
            solidifyPiece()
            removeRows()
        }
    }

    if(event.key == 'ArrowUp'){
        const rotated = []

        for (let i = 0;i < piece.shape[0].length; i++){
            const row = []
            
            for(let j = piece.shape.length - 1;j >= 0; j--){
                row.push(piece.shape[j][i])
            }
            
            rotated.push(row)
        }

        const previousShape = piece.shape
        piece.shape = rotated
        if(checkCollision()){
            piece.shape = previousShape
        }
    }

})

function checkCollision (){
    return piece.shape.find((row, y) => {
        return row.find((value, x) => {
            return (
                value != 0 &&
                board[y + piece.position.y]?.[x + piece.position.x] != 0
            )
        })
    })
}

function solidifyPiece(){
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value == 1){
                board[y + piece.position.y][x + piece.position.x] = 1
            }
        })
    })

    piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2)
    piece.position.y = 0
    piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]

    if(checkCollision()){
        board.forEach((row) => row.fill(0))
        score = 0
        scoreText.innerText = score
    }
}

function removeRows(){
    const rowsToRemove = []
    board.forEach((row, y) => {
        if(row.every(value => value == 1)){
            rowsToRemove.push(y)
        }
    })

    rowsToRemove.forEach(y => {
        board.splice(y, 1)
        const newRow = Array(BOARD_WIDTH).fill(0)
        board.unshift(newRow)
        score = score + 10
        scoreText.innerText = score
    })
}

function cleanCanvas(){
    ctx.clearRect(0,0, canvas.width, canvas.height)
}

function startGame(){
    score = 0
    scoreText.innerText = score
    update()
    canvas.style.display = 'block'
    scoreDiv.style.display = 'block'
    button.style.display = "none"
}

button.addEventListener('click', () => {
    startGame()
})
