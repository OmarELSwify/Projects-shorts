const { sin, cos, min, max, PI: π, abs } = Math

const noop =_=>_

const random = (max = 1, min = 0) => {
  return min + (Math.random() * (max - min))
}

const maybeNegative = (number) => {
  return random() >= .5 ? number : -number
}

const array = (length, mapper = noop) => {
  return [...Array(length).keys()].map(mapper)
}

const Settings = {
  width: 1200,
  height: 1200,
  bgStyle: '#000',
  pathStopTime: 60 * 1000,
  get sourceStyle() {
    return 'transparent'
    if (random() >= .75) {
      return 'black'
    }
    if (random() >= .66) {
      return 'red'
    }
    if (random() >= .5) {
      return 'yellow'
    }
    return 'mediumspringgreen'
  },
  increaseSourceCount() {
    return this.sourceCount += 0.0001
  },
  resetSourceCount() {
    this.sourceCount = 15800
  },
  get sourceXMin() {
    return 0.5 + (cos(this.increaseSourceCount())) * 0.2
  },
  get sourceXMax() {
    return 0.5 + (cos(this.increaseSourceCount()) + 0.01) * 0.2
  },
  get sourceYMin() {
    return 0.5 + (sin(this.increaseSourceCount())) * 0.2
  },
  get sourceYMax() {
    return 0.5 + (sin(this.increaseSourceCount()) + 0.01) * 0.2
  },
  sourceSize: 2,
  pathSize: 1.2,
  speedFactor: 1,
  get pathSpeed() {
    this.speedFactor *= 1.005
    if (this.speedFactor > 120) {
      this.speedFactor = 1
    }
    return 10 / this.speedFactor
  },
}

const createPath = ({ x, y, angle, thickness, speed }) => {
  return {
    startX: x,
    startY: y,
    endX: x,
    endY: y,
    angle,
    thickness,
    style() {
      const verticalMove = abs(this.endY - this.startY)
      const horizontalMove = abs(this.endX - this.startX)
      if (verticalMove > 0.35 || horizontalMove > 0.35) {
        if (random() >= .75) {
          return 'rgba(200, 150, 250, 0.05)'
        }
        if (random() >= .66) {
          return 'rgba(250, 200, 255, 0.05)'
        }
        if (random() >= .5) {
          return 'rgba(225, 120, 200, 0.05)'
        }
        return 'rgba(255, 127, 255, 0.05)'
      }
      if (verticalMove > 0.3 || horizontalMove > 0.3) {
        if (random() >= .75) {
          return 'rgba(150, 150, 250, 0.05)'
        }
        if (random() >= .66) {
          return 'rgba(50, 200, 255, 0.05)'
        }
        if (random() >= .5) {
          return 'rgba(25, 120, 200, 0.05)'
        }
        return 'rgba(0, 200, 255, 0.05)'
      }
      if (verticalMove > 0.2 || horizontalMove > 0.2) {
        if (random() >= .75) {
          return 'rgba(150, 250, 120, 0.05)'
        }
        if (random() >= .66) {
          return 'rgba(50, 255, 127, 0.05)'
        }
        if (random() >= .5) {
          return 'rgba(25, 200, 120, 0.05)'
        }
        return 'rgba(0, 255, 255, 0.05)'
      }
      if (verticalMove > 0.05 || horizontalMove > 0.05) {
        if (random() >= .75) {
          return 'rgba(250, 150, 90, 0.05)'
        }
        if (random() >= .66) {
          return 'rgba(250, 240, 90, 0.05)'
        }
        if (random() >= .5) {
          return 'rgba(250, 240, 120, 0.05)'
        }
        return 'rgba(80, 255, 90, 0.05)'
      }
      if (verticalMove > 0.01 || horizontalMove > 0.01) {
        if (random() >= .75) {
          return 'rgba(255, 100, 90, 0.05)'
        }
        if (random() >= .66) {
          return 'rgba(255, 180, 90, 0.05)'
        }
        if (random() >= .5) {
          return 'rgba(255, 200, 120, 0.05)'
        }
        return 'rgba(127, 255, 90, 0.05)'
      }
      return 'rgba(255, 150, 0, 0.05)'
      if (random() >= .75) {
        return 'rgba(127, 0, 255, 0.05)'
      }
      if (random() >= .66) {
        return 'rgba(0, 127, 127, 0.05)'
      }
      if (random() >= .5) {
        return 'rgba(127, 127, 255, 0.05)'
      }
      return 'rgba(0, 127, 255, 0.05)'
    },
    forward() {
      this.endX += ((sin(angle) * speed) / Settings.width)
      this.endY += ((cos(angle) * speed) / Settings.height)
    }
  }
}

const State = {
  init() {
    Settings.resetSourceCount()
    this.sources = array(Settings.sourceCount, i => [
      random(Settings.sourceXMax, Settings.sourceXMin),
      random(Settings.sourceYMax, Settings.sourceYMin)
    ])
    this.paths = this.sources.map(([x, y]) => {
      return createPath({
        x,
        y,
        angle: random(π * 4),
        thickness: Settings.pathSize,
        speed: Settings.pathSpeed
      })
    })
    this.start = Date.now()
  }
}

const draw = (ctx) => {
  State.sources.forEach(([x, y]) => {
    ctx.fillStyle = Settings.sourceStyle
    ctx.fillRect(
      x * Settings.width,
      y * Settings.height,
      Settings.sourceSize,
      Settings.sourceSize
    )
  })
  State.paths.forEach((path, i) => {
    if (Date.now() - State.start >= Settings.pathStopTime) {
      return
    }
    ctx.fillStyle = path.style()
    ctx.fillRect(
      path.endX * Settings.width,
      path.endY * Settings.height,
      path.thickness,
      path.thickness
    )
    path.forward()
  })
  return requestAnimationFrame(() => {
    draw(ctx)
  })
}

const init = (ctx) => {
  ctx.fillStyle = Settings.bgStyle
  ctx.fillRect(0, 0, Settings.width, Settings.height)
  State.init()
  canvas.classList.toggle('reset')
  setTimeout(() => {
    canvas.classList.toggle('reset')
  }, 1000 / 60)
}

const canvas = document.querySelector('canvas')
canvas.width = Settings.width
canvas.height = Settings.height
const ctx = canvas.getContext('2d')
init(ctx)
draw(ctx)

canvas.addEventListener('click', () => init(ctx))