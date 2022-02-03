const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 1.5

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //Faz a gravidade
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        else this.velocity.y = 0
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

// src das imagens do jogo
const platformSrc = './img/platform.png'
const backgroundSrc = './img/background.png'
const hillsSrc = './img/hills.png'

const platformImage = createImage(platformSrc)

const player = new Player()
const platforms = [
    new Platform({
        x: -1,
        y: 470,
        image: platformImage
    }), new Platform({
        x: platformImage.width - 3,
        y: 470,
        image: platformImage
    })]

const genericObjects = [
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

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

// Variável controla o percuso do player
let scrollOffset = 0

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
        player.velocity.x = 5
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        // Cria a movimentação da plataforma
        if (keys.right.pressed) {
            scrollOffset += 5
            platforms.forEach(platform => {
                platform.position.x -= 5
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= 3
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach(platform => {
                platform.position.x += 5
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += 3
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

    // Verifica se o player chegou no fim da tela
    if (scrollOffset > 2000) {
        console.log('You win')
    }
}

animate()

// Evento de quando a tecla é pressionada para movimentação do player
window.addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = true
            break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            keys.right.pressed = true
            break

        case 87:
            console.log('up')
            player.velocity.y -= 20
            break
    }
})

// Evento de quando a tecla é solta na movimentação do player
window.addEventListener('keyup', ({ keyCode }) => {
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
            player.velocity.y -= 20
            break
    }
})
