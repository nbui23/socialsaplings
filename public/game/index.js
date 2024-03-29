const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

const oakTreeImg = new Image()
oakTreeImg.src = './img/oakTree.png'

const appleTreeImg = new Image()
appleTreeImg.src = './img/appleTree.png'

const cherryTreeImg = new Image()
cherryTreeImg.src = './img/cherryTree.png'

const treeTypes = {
  oak: {
      color: 'darkgreen',
      growthTime: 100, // Number of frames to fully grow
      finalSize: 5,
      image: oakTreeImg,
  },
  apple: {
      color: 'red',
      growthTime: 150,
      finalSize: 4,
      image: appleTreeImg,
  },
  cherry: {
      color: 'pink',
      growthTime: 120,
      finalSize: 3,
      image: cherryTreeImg,
  },
};
let treePlantingModeActive = false;
let selectedTreeType = 'oak'; // Default tree type
let trees = []; // Array to store planted trees

const charactersMap = []
for (let i = 0; i < charactersMapData.length; i += 70) {
  charactersMap.push(charactersMapData.slice(i, 70 + i))
}

const boundaries = []
const offset = {
  x: -735,
  y: -650
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
  })
})

const characters = []
const villagerImg = new Image()
villagerImg.src = './img/villager/Idle.png'

const oldManImg = new Image()
oldManImg.src = './img/oldMan/Idle.png'

charactersMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    // 1026 === villager
    if (symbol === 1026) {
      characters.push(
        new Character({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          image: villagerImg,
          frames: {
            max: 4,
            hold: 60
          },
          scale: 3,
          animate: true,
          dialogue: ['...', 'Did you know we lose around 10 million hectares of forest every single year?']
        })
      )
    }
    // 1031 === oldMan
    else if (symbol === 1031) {
      characters.push(
        new Character({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          image: oldManImg,
          frames: {
            max: 4,
            hold: 60
          },
          scale: 3,
          dialogue: ['One tree absorbs approximately 25kg of CO2 per year']
        })
      )
    }

    if (symbol !== 0) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
    }
  })
})

const image = new Image()
image.src = './img/Pellet Town.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'


const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage
  }
})

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: image
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foregroundImage
})

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

const movables = [
  background,
  ...boundaries,
  foreground,
  ...characters
]
const renderables = [
  background,
  ...boundaries,
  ...characters,
  player,
  foreground,
]


function animate() {
 
  const animationId = window.requestAnimationFrame(animate)
  renderables.forEach((renderable) => {
    renderable.draw()
  })

  let moving = true
  player.animate = false

  if (keys.w.pressed && lastKey === 'w') {
    player.animate = true
    player.image = player.sprites.up

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 0, y: 3 }
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3
      })
  } else if (keys.a.pressed && lastKey === 'a') {
    player.animate = true
    player.image = player.sprites.left

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 3, y: 0 }
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3
      })
  } else if (keys.s.pressed && lastKey === 's') {
    player.animate = true
    player.image = player.sprites.down

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 0, y: -3 }
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3
      })
  } else if (keys.d.pressed && lastKey === 'd') {
    player.animate = true
    player.image = player.sprites.right

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: -3, y: 0 }
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3
      })
  }
}
 animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
  if (e.key === 't') {

    treePlantingModeActive = !treePlantingModeActive;
    console.log(`Tree planting mode: ${treePlantingModeActive ? 'ON' : 'OFF'}`);
}
  if (player.isInteracting) {
    switch (e.key) {
      case ' ':
        player.interactionAsset.dialogueIndex++

        const { dialogueIndex, dialogue } = player.interactionAsset
        if (dialogueIndex <= dialogue.length - 1) {
          document.querySelector('#characterDialogueBox').innerHTML =
            player.interactionAsset.dialogue[dialogueIndex]
          return
        }

        // finish conversation
        player.isInteracting = false
        player.interactionAsset.dialogueIndex = 0
        document.querySelector('#characterDialogueBox').style.display = 'none'

        break
    }
    return
  }

  switch (e.key) {
    case ' ':
      if (!player.interactionAsset) return

      // beginning the conversation
      const firstMessage = player.interactionAsset.dialogue[0]
      document.querySelector('#characterDialogueBox').innerHTML = firstMessage
      document.querySelector('#characterDialogueBox').style.display = 'flex'
      player.isInteracting = true
      break
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break

    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break

    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
})

class Tree {
  constructor(position, type){
      this.position = position;
      this.type = type;
  }
}

let clicked = false
canvas.addEventListener('click', (e) => {
  if (treePlantingModeActive) {
    console.log("Planting tree...")
    
    // Get the position of the click relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const treePositionX = player.position.x - background.position.x + offset.x;
    const treePositionY = player.position.y - background.position.y + offset.y;


    console.log(`Planting tree at: ${treePositionX}, ${treePositionY}`); // Debugging
    trees.push(new Tree({treePositionX, treePositionY}, selectedTreeType));
    updateInventory();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    console.log(`Mouse clicked at: ${mouseX}, ${mouseY}`)

    // Create a new tree sprite at the clicked position
    const tree = new Sprite({
      position: {
        x: mouseX,
        y: mouseY
      },
      image: treeTypes[selectedTreeType].image,
      scale: 0.5
    });
    movables.push(tree);
    renderables.push(tree);

}
  if (!clicked) {
    audio.Map.play()
    clicked = true
  }
})

//Add an event listener for tree types select
window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
      selectedTreeType = 'oak';
      console.log('Selected tree type: oak');
    }
    if (e.key === '2'){
      selectedTreeType = 'apple';
      console.log('Selected tree type: apple');
    } 
    if (e.key === '3') {
      selectedTreeType = 'cherry';
      console.log('Selected tree type: cherry');
    }
})

function updateInventory() {
  const inventoryDiv = document.getElementById('inventory');
  inventoryDiv.innerHTML = ''; // Clear previous inventory

  trees.forEach((tree, index) => {
    const treeDiv = document.createElement('div');
    treeDiv.textContent = `Tree ${index + 1}: ${tree.type}`;
    treeDiv.style.marginBottom = '5px';
    treeDiv.style.padding = '5px';
    treeDiv.style.border = '1px solid #ccc';
    treeDiv.style.backgroundColor = '#f9f9f9';
    inventoryDiv.appendChild(treeDiv);
  });
}


