const cvs = document.querySelector('canvas')
cvs.width = innerWidth
cvs.height = innerHeight
const ctx = cvs.getContext('2d')

function BounceBall (x, y, radius, blur, vy, vx = 3, color = 'white') {
  const g = 9.81 * 0.1
  this.x = x
  this.y = y
  this.vy = vy
  this.vx = vx
  this.t = 1
  this.radius = radius
  this.blur = blur
  this.color = color
  this.direction = true // true for downward, false for upward
  this.stopBouncing = false
  this.bounce = function bounce () {
    if (this.stopBouncing) {
      return
    }
    // requestAnimationFrame(() => this.bounce())
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.shadowColor = this.color
    ctx.shadowBlur = this.blur
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
    if (this.direction) {
      if (this.y >= innerHeight - this.radius) {
        if (Math.abs(this.vy) < 2) {
          this.stopBouncing = true
          this.vy = 0
        } else {
          this.radius = this.radius / 5 * 4
          if (this.radius < 1) this.radius = 1
          this.blur = this.blur / 5 * 4
          this.vy = -this.vy
          this.direction = false
          this.t = 0
        }
      }
    } else {
      if (this.vy >= 0) {
        this.vy = -this.vy
        this.direction = true
        this.t = 0
      }
    }
    if (!this.stopBouncing) {
      this.vy = this.direction ? g * this.t : this.vy + g * this.t
      this.t++
      this.y += this.vy
      if (this.y > innerHeight - this.radius) {
        this.y = innerHeight - this.radius
      }
    }
    this.x += this.vx
  }
}

function random (base) {
  return Math.floor(Math.random() * base)
}

function randomParam () {
  const radius = Math.random() * 90 + 10
  const blur = 2 * radius
  const x = Math.random() * (innerWidth - radius * 2) + radius 
  const y = 0
  const vy = random(10)
  let vx = random(10)
  if (x > innerWidth / 2) {
    vx = -vx
  }
  const color = `rgba(${random(256)}, ${random(256)}, ${random(256)}, ${Math.random()})`
  return [x, y, radius, blur, vy, vx, color]
}

const balls = []
for (let i = 0; i < 20; i++) {
  balls[i] = new BounceBall(...randomParam())
}

function animate() {
  requestAnimationFrame(animate)
  ctx.clearRect(0, 0, innerWidth, innerHeight)
  ctx.fillStyle = 'gray'
  ctx.fillRect(0, 0, innerWidth, innerHeight)
  for (let i = 0, len = balls.length; i < len; i++) {
    if (balls[i].stopBouncing) {
      balls.splice(i, 1, new BounceBall(...randomParam()))
    }
    balls[i].bounce()
  }
}
animate()