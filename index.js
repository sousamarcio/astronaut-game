const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 1.5

class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 66
        this.height = 150

        this.image = createImage(spriteStandRight)
        this.frames = 0
        this.sprites = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width: 127.875
            }
        }

        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    }

    update() {
        // Aplica a lógica dos frames da imagem do player
        this.frames++

        if (
            this.frames > 59 &&
            (this.currentSprite === this.sprites.stand.right ||
                this.currentSprite === this.sprites.stand.left)
        )
            this.frames = 0
        else if (
            this.frames > 29 &&
            (this.currentSprite === this.sprites.run.right ||
                this.currentSprite === this.sprites.run.left)
        )
            this.frames = 0

        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //Faz a gravidade
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
    }
}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }

        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }

        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

// Cria a imagem passando o src por parâmetro
function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}

// Imagens do jogo
const platformSrc = './img/platform.png'
const backgroundSrc = './img/background.png'
const hillsSrc = './img/hills.png'
const platformSmallTall = './img/platformSmallTall.png'

// Imagens do player
const spriteRunLeft = './img/spriteRunLeft.png'
const spriteRunRight = './img/spriteRunRight.png'
const spriteStandLeft = './img/spriteStandLeft.png'
const spriteStandRight = './img/spriteStandRight.png'


let platformImage = createImage(platformSrc)
let platformSmallTallImage = createImage(platformSmallTall)

let player = new Player()
let platforms = []
let genericObjects = []

let lastKey

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

// Controla o percuso do player
let scrollOffset = 0

function init() {
    platformImage = createImage(platformSrc)

    player = new Player()
    platforms = [
        new Platform({
            x: platformImage.width * 4 + 300 - 2 + platformImage.
                width - platformSmallTallImage.width,
            y: 270,
            image: platformSmallTallImage
        }),
        new Platform({
            x: platformImage.width * 10 + 620 - 2 + platformImage.
                width - platformSmallTallImage.width,
            y: 270,
            image: platformSmallTallImage
        }),
        new Platform({
            x: platformImage.width * 11 + 620 - 2 + platformImage.
                width - platformSmallTallImage.width,
            y: 170,
            image: platformSmallTallImage
        }),
        new Platform({
            x: platformImage.width * 12 + 720 - 2 + platformImage.
                width - platformSmallTallImage.width,
            y: 170,
            image: platformSmallTallImage
        }),
        new Platform({
            x: -1,
            y: 470,
            image: platformImage
        }), new Platform({
            x: platformImage.width - 3,
            y: 470,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 2 + 100,
            y: 470,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 3 + 300,
            y: 470,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 4 + 300 - 2,
            y: 470,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 5 + 700 - 2,
            y: 470,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 6 + 700 - 3,
            y: 470,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 7 + 1000 - 3,
            y: 470,
            image: platformSmallTallImage
        }),
        new Platform({
            x: platformImage.width * 8 + 1100 - 3,
            y: 470,
            image: platformSmallTallImage
        }),
        new Platform({
            x: platformImage.width * 9 + 1200 - 3,
            y: 470,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 12 + 1750,
            y: 470,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 13 + 1750 - 3,
            y: 470,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 14 + 1750 - 4,
            y: 470,
            image: platformImage
        })
    ]

    genericObjects = [
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage(backgroundSrc)
        }),
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage(hillsSrc)
        })
    ]

    scrollOffset = 0
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // Desenha os objetos genéricos
    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })

    // Desenha as plataformas
    platforms.forEach(platform => {
        platform.draw()
    })

    player.update()


    // Define a velocidade do player para trás e para frente quando pressionado
    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if (
        (keys.left.pressed && player.position.x > 100)
        || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
    ) {
        player.velocity.x = - player.speed
    } else {
        player.velocity.x = 0

        // Cria a movimentação da plataforma
        if (keys.right.pressed) {
            scrollOffset += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * .66
            })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * .66
            })
        }
    }

    // Verifica a posição do player para detectar colisão com a plataforma
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y
            && player.position.y + player.height + player.velocity.y >=
            platform.position.y && player.position.x + player.width >=
            platform.position.x && player.position.x <= platform.position.x +
            platform.width) {
            player.velocity.y = 0
        }
    })

    // Troca de sprite de correndo para parado
    if (
        keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.run.right
    ) {
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (
        keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.run.left
    ) {
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (
        !keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.stand.left
    ) {
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    } else if (
        !keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.stand.right
    ) {
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }

    // Condição de vitória
    if (scrollOffset > platformImage.width * 5 + 300 - 2) {
        console.log('You win')
    }

    // Condição de derrota
    if (player.position.y > canvas.height) {
        init()
    }
}

init()
animate()

// Evento de quando a tecla é pressionada para movimentação do player
addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = true
            lastKey = 'left'

            break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            keys.right.pressed = true
            lastKey = 'right'

            break

        case 87:
            console.log('up')
            player.velocity.y -= 25
            break
    }
})

// Evento de quando a tecla é solta na movimentação do player
addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = false
            break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            keys.right.pressed = false
            break

        case 87:
            console.log('up')
            break
    }
})
