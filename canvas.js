;(function () {
  const radius = 30
  const colors = [
    '255,160,122',
    '250,128,114',
    '233,150,122',
    '240,128,128',
    '205,92,92',
    '220,20,60',
    '178,34,34',
    '255,0,0',
    '139,0,0',
    '255,127,80',
    '255,99,71',
    '255,69,0',
    '255,215,0',
    '255,165,0',
    '255,140,0',
    '255,255,224',
    '255,250,205',
    '250,250,210',
    '255,239,213',
    '255,228,181',
    '255,218,185',
    '238,232,170',
    '240,230,140',
    '189,183,107',
    '255,255,0',
    '124,252,0',
    '127,255,0',
    '50,205,50',
    '0.255.0',
    '34,139,34',
    '0,128,0',
    '0,100,0',
    '173,255,47',
    '154,205,50',
    '0,255,127',
    '0,250,154',
    '144,238,144',
    '152,251,152',
    '143,188,143',
    '60,179,113',
    '46,139,87',
    '128,128,0',
    '85,107,47',
    '107,142,35',
    '224,255,255',
    '0,255,255',
    '0,255,255',
    '127,255,212',
    '102,205,170',
    '175,238,238',
    '64,224,208',
    '72,209,204',
    '0,206,209',
    '32,178,170',
    '95,158,160',
    '0,139,139',
    '0,128,128',
    '176,224,230',
    '173,216,230',
    '135,206,250',
    '135,206,235',
    '0,191,255',
    '176,196,222',
    '30,144,255',
    '100,149,237',
    '70,130,180',
    '65,105,225',
    '0,0,255',
    '0,0,205',
    '0,0,139',
    '0,0,128',
    '25,25,112',
    '123,104,238',
    '106,90,205',
    '72,61,139',
    '230,230,250',
    '216,191,216',
    '221,160,221',
    '238,130,238',
    '218,112,214',
    '255,0,255',
    '255,0,255',
    '186,85,211',
    '147,112,219',
    '138,43,226',
    '148,0,211',
    '153,50,204',
    '139,0,139',
    '128,0,128',
    '75,0,130',
    '255,192,203',
    '255,182,193',
    '255,105,180',
    '255,20,147',
    '219,112,147',
    '199,21,133',
    '255,255,255',
    '255,250,250',
    '240,255,240',
    '245,255,250',
    '240,255,255',
    '240,248,255',
    '248,248,255',
    '245,245,245',
    '255,245,238',
    '245,245,220',
    '253,245,230',
    '255,250,240',
    '255,255,240',
    '250,235,215',
    '250,240,230',
    '255,240,245',
    '255,228,225',
    '220,220,220',
    '211,211,211',
    '192,192,192',
    '169,169,169',
    '128,128,128',
    '105,105,105',
    '119,136,153',
    '112,128,144',
    '47,79,79',
    '0,0,0',
    '255,248,220',
    '255,235,205',
    '255,228,196',
    '255,222,173',
    '245,222,179',
    '222,184,135',
    '210,180,140',
    '188,143,143',
    '244,164,96',
    '218,165,32',
    '205,133,63',
    '210,105,30',
    '139,69,19',
    '160,82,45',
    '165,42,42',
    '128,0,0',
  ]
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lettersList = letters.split('')

  function getNextLetter(letter) {
    const index = lettersList.findIndex((l) => letter === l)

    if (!lettersList[index + 1]) {
      const lastLength = lettersList[lettersList.length - 1].length

      letters.split('').forEach((l) => {
        lettersList.push(l.repeat(lastLength + 1))
      })
    }

    return lettersList[index + 1]
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function setTextStyle(ctx, size = 20) {
    ctx.font = `bold ${size}px sans-serif`
    ctx.fillStyle = '#202020'
    ctx.textAlign = 'center'
  }

  function getColor(color, active) {
    return `rgba(${color}, ${active ? 1 : 0.1})`
  }

  function Link(start, end, from, to, colorFrom, colorTo) {
    this.rectSize = { width: 70, height: 40 }
    this.from = from
    this.to = to
    this.colorFrom = colorFrom
    this.colorTo = colorTo
    this.includeInPath = true

    this.setCoords({ start, end })
  }

  Link.prototype.setCoords = function ({ start, end }) {
    if (start) {
      this.startX = start.x
      this.startY = start.y
    }

    if (end) {
      this.endX = end.x
      this.endY = end.y
    }

    this.rectX = (this.startX + this.endX) / 2 - this.rectSize.width / 2
    this.rectY = (this.startY + this.endY) / 2 - this.rectSize.height / 2

    this.distance = Math.ceil(
      Math.sqrt(Math.abs(this.startX - this.endX) ** 2 + Math.abs(this.startY - this.endY) ** 2)
    )
  }

  Link.prototype.changeDirection = function () {
    const colorFrom = this.colorFrom
    this.colorFrom = this.colorTo
    this.colorTo = colorFrom

    const from = this.from
    this.from = this.to
    this.to = from

    this.setCoords({
      start: { x: this.endX, y: this.endY },
      end: { x: this.startX, y: this.startY },
    })
  }

  Link.prototype.draw = function (ctx) {
    this.drawLine(ctx)
    this.drawCursor(ctx)
    this.drawText(ctx)
  }

  Link.prototype.drawCursor = function (ctx) {
    ctx.beginPath()
    ctx.fillStyle = getColor(this.colorFrom, this.includeInPath)
    ctx.fillRect(this.rectX, this.rectY, this.rectSize.width, this.rectSize.height)
  }

  Link.prototype.drawText = function (ctx) {
    setTextStyle(ctx, 16)
    const x = (this.startX + this.endX) / 2
    const y = (this.startY + this.endY) / 2 - 2
    ctx.fillText(`${this.from}→${this.to}`, x, y)
    ctx.fillText(`dist: ${this.distance}`, x, y + 18)
  }

  Link.prototype.drawLine = function (ctx) {
    ctx.beginPath()
    ctx.strokeStyle = getColor(this.colorFrom, this.includeInPath)
    ctx.moveTo(this.startX, this.startY)
    ctx.lineTo(this.endX, this.endY)
    ctx.stroke()
  }

  Link.prototype.setIsIncludeInPath = function () {
    this.includeInPath = true
  }

  Link.prototype.setIsNotIncludeInPath = function () {
    this.includeInPath = false
  }

  function Circle(x, y, name) {
    this.x = x
    this.y = y
    this.name = name
    this.radius = radius
    this.color = colors[getRandomNumber(0, colors.length - 1)]
    this.active = false
    this.includeInPath = true
  }

  Circle.prototype.setCoords = function ({ x, y }) {
    this.x = x
    this.y = y
  }

  Circle.prototype.draw = function (ctx) {
    this.drawCircle(ctx)
    this.drawText(ctx)
    if (this.active) {
      this.drawBorder(ctx)
    }
  }

  Circle.prototype.drawCircle = function (ctx) {
    ctx.beginPath()
    ctx.fillStyle = getColor(this.color, this.includeInPath)
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
    ctx.fill()
  }

  Circle.prototype.drawBorder = function (ctx) {
    ctx.beginPath()
    ctx.strokeStyle = '#f5f5f5'
    ctx.arc(this.x, this.y, this.radius + 3, 0, 2 * Math.PI, false)
    ctx.stroke()
  }

  Circle.prototype.drawText = function (ctx) {
    setTextStyle(ctx)
    ctx.fillText(this.name, this.x, this.y + this.radius / 2 - 6)
  }

  Circle.prototype.setActive = function () {
    this.active = true
  }

  Circle.prototype.setInactive = function () {
    this.active = false
  }

  Circle.prototype.setIsIncludeInPath = function () {
    this.includeInPath = true
  }

  Circle.prototype.setIsNotIncludeInPath = function () {
    this.includeInPath = false
  }

  function onToggleContextMenu({ menu, x, y }, forceClose) {
    if (forceClose || menu.style.display !== 'none') {
      menu.style.display = 'none'
      return
    }

    menu.style.display = 'block'
    menu.style.left = x
    menu.style.top = y
  }

  function Statuses() {
    const statuses = {
      addLink: null,
      moveCircle: null,
    }

    return {
      getStatus(name) {
        return statuses[name]
      },
      setStatus(name, params) {
        return (statuses[name] = params)
      },
      resetStatus(name) {
        return (statuses[name] = null)
      },
      isStatus(name) {
        return statuses[name] !== null
      },
    }
  }

  function addNode(circles, x, y) {
    const lastElement = circles[circles.length - 1]
    const name = getNextLetter(lastElement ? lastElement.name : '')
    circles.push(new Circle(x, y, name))
  }

  function draw(ctx, circles, links, width, height) {
    ctx.clearRect(0, 0, width, height)
    links.forEach((item) => item.draw(ctx))
    circles.forEach((item) => item.draw(ctx))
  }

  function findCircleByCoords(circles, coords) {
    const { x, y } = coords
    return circles.find(
      (el) =>
        el.x + el.radius > x && el.x - el.radius < x && el.y + el.radius > y && el.y - el.radius < y
    )
  }

  function findLinkByCoords(links, coords) {
    const { x, y } = coords
    return links.find(
      (el) =>
        el.rectX < x &&
        el.rectX + el.rectSize.width > x &&
        el.rectY < y &&
        el.rectY + el.rectSize.height > y
    )
  }

  function isLinked(links, currentName, checkName) {
    return links.some(
      (item) =>
        (item.from === currentName && item.to === checkName) ||
        (item.from === checkName && item.to === currentName)
    )
  }

  function createCanvas({ circles, links, statuses, canvasContext, circleContext, linkContext }) {
    const canvas = document.getElementById('canvas')
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    canvas.style.background = '#202020'
    const context = canvas.getContext('2d')
    const { height, width } = canvas.getBoundingClientRect()

    canvas.addEventListener('click', function (event) {
      onToggleContextMenu({ menu: circleContext }, true)
      onToggleContextMenu({ menu: canvasContext }, true)
      onToggleContextMenu({ menu: linkContext }, true)

      if (statuses.isStatus('addLink')) {
        const element = findCircleByCoords(circles, { x: event.x, y: event.y })

        if (element) {
          const { x, y, name, color } = element
          const { startCoords, startName, startColor } = statuses.getStatus('addLink')

          links.push(new Link(startCoords, { x, y }, startName, name, startColor, color))
          circles.forEach((el) => el.setInactive())
          draw(context, circles, links, width, height)
          statuses.resetStatus('addLink')
        }

        return
      }

      const element = findLinkByCoords(links, { x: event.x, y: event.y })

      if (element) {
        element.changeDirection()
        draw(context, circles, links, width, height)
      }
    })

    canvas.addEventListener('mousedown', function (event) {
      if (event.button !== 0) {
        return
      }

      if (!statuses.isStatus('addLink')) {
        const element = findCircleByCoords(circles, { x: event.x, y: event.y })

        if (element) {
          statuses.setStatus('moveCircle', true)
        }
      }
    })

    canvas.addEventListener('mousemove', function (event) {
      if (event.button !== 0) {
        return
      }

      if (statuses.isStatus('moveCircle')) {
        const element = findCircleByCoords(circles, { x: event.x, y: event.y })
        const coords = { x: event.x, y: event.y }
        element.setCoords(coords)

        links.forEach((link) => {
          if (link.from === element.name) {
            link.setCoords({ start: coords })
          }

          if (link.to === element.name) {
            link.setCoords({ end: coords })
          }
        })

        draw(context, circles, links, width, height)
      }
    })

    canvas.addEventListener('mouseup', function () {
      if (event.button !== 0) {
        return
      }

      if (statuses.isStatus('moveCircle')) {
        statuses.resetStatus('moveCircle')
        draw(context, circles, links, width, height)
      }
    })

    canvas.addEventListener('contextmenu', function (event) {
      event.preventDefault()

      const circle = findCircleByCoords(circles, { x: event.x, y: event.y })
      const link = findLinkByCoords(links, { x: event.x, y: event.y })

      onToggleContextMenu({ menu: circleContext }, true)
      onToggleContextMenu({ menu: canvasContext }, true)
      onToggleContextMenu({ menu: linkContext }, true)

      if (circle) {
        onToggleContextMenu({ menu: circleContext, x: event.x, y: event.y })
      } else if (link) {
        onToggleContextMenu({ menu: linkContext, x: event.x, y: event.y })
      } else {
        onToggleContextMenu({ menu: canvasContext, x: event.x, y: event.y })
      }
    })

    return { context, height, width }
  }

  function main() {
    const statuses = Statuses()
    const canvasContext = document.getElementById('canvasContext')
    const circleContext = document.getElementById('circleContext')
    const linkContext = document.getElementById('linkContext')
    const addNodeButton = document.getElementById('addNode')
    const removeNodeButton = document.getElementById('removeNode')
    const addLinkButton = document.getElementById('addLink')
    const removeLinkButton = document.getElementById('removeLink')
    const findButton = document.getElementById('find')
    const startInput = document.getElementById('start')
    const endInput = document.getElementById('end')
    const resultInput = document.getElementById('result')
    let circles = []
    let links = []

    const { context, height, width } = createCanvas({
      circles,
      links,
      statuses,
      canvasContext,
      circleContext,
      linkContext,
    })

    addNodeButton.addEventListener('click', function () {
      const { x, y } = canvasContext.getBoundingClientRect()
      addNode(circles, x, y)
      draw(context, circles, links, width, height)
      onToggleContextMenu({ menu: canvasContext })
    })

    removeNodeButton.addEventListener('click', function () {
      const { x, y } = circleContext.getBoundingClientRect()
      const element = findCircleByCoords(circles, { x, y })
      const circleName = element.name

      for (let i = links.length - 1; i >= 0; i--) {
        const item = links[i]
        if (item.from === circleName || item.to === circleName) {
          links.splice(i, 1)
        }
      }

      circles.splice(
        circles.findIndex((el) => el === element),
        1
      )

      draw(context, circles, links, width, height)
      onToggleContextMenu({ menu: circleContext })
    })

    addLinkButton.addEventListener('click', function () {
      const { x, y } = circleContext.getBoundingClientRect()
      const element = findCircleByCoords(circles, { x, y })

      const elements = circles.filter(
        (el) => el !== element && !isLinked(links, element.name, el.name)
      )

      if (elements.length > 0) {
        elements.forEach((el) => el.setActive())
        draw(context, circles, links, width, height)
        statuses.setStatus('addLink', {
          startCoords: { x: element.x, y: element.y },
          startName: element.name,
          startColor: element.color,
        })
      }

      onToggleContextMenu({ menu: circleContext })
    })

    removeLinkButton.addEventListener('click', function () {
      const { x, y } = linkContext.getBoundingClientRect()
      const element = findLinkByCoords(links, { x, y })

      links.splice(
        links.findIndex((el) => el === element),
        1
      )

      draw(context, circles, links, width, height)

      onToggleContextMenu({ menu: linkContext })
    })

    findButton.addEventListener('click', function () {
      const data = {}

      links.forEach((link) => {
        const { from, to, distance } = link

        if (!data[from]) {
          data[from] = {}
        }

        data[from][to] = distance
      })

      links.forEach(link => link.setIsIncludeInPath())
      circles.forEach(circle => circle.setIsIncludeInPath())

      const start = startInput.value.toUpperCase()
      const end = endInput.value.toUpperCase()
      const result = window.findPath(data, start, end)

      resultInput.innerHTML = result.join('→')

      links.forEach((link) => {
        const findIndex = result.findIndex(item => item === link.from)
        if (!(result[findIndex] === link.from && result[findIndex + 1] === link.to)) {
          link.setIsNotIncludeInPath()
        }
      })
      circles.forEach((circle) => {
        if (!result.includes(circle.name)) {
          circle.setIsNotIncludeInPath()
        }
      })

      draw(context, circles, links, width, height)
    })

    circles.push(
      new Circle(width / 2, height / 2, lettersList[0]),
      new Circle(width / 3, height / 3, lettersList[1]),
      new Circle(width / 1.5, height / 4, lettersList[2])
    )

    links.push(
      new Link(
        { x: circles[0].x, y: circles[0].y },
        { x: circles[1].x, y: circles[1].y },
        circles[0].name,
        circles[1].name,
        circles[0].color,
        circles[1].color
      ),
      new Link(
        { x: circles[1].x, y: circles[1].y },
        { x: circles[2].x, y: circles[2].y },
        circles[1].name,
        circles[2].name,
        circles[1].color,
        circles[2].color
      )
    )

    draw(context, circles, links, width, height)
  }

  window.addEventListener('load', main)
})()
