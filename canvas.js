;(function () {
  const colors = [
    'lightsalmon',
    'salmon',
    'darksalmon',
    'lightcoral',
    'indianred',
    'crimson',
    'firebrick',
    'red',
    'darkred',
    'coral',
    'tomato',
    'orangered',
    'gold',
    'orange',
    'darkorange',
    'lightyellow',
    'lemonchiffon',
    'lightgoldenrodyellow',
    'papayawhip',
    'moccasin',
    'peachpuff',
    'palegoldenrod',
    'khaki',
    'darkkhaki',
    'yellow',
    'lawngreen',
    'chartreuse',
    'limegreen',
    'lime',
    'forestgreen',
    'green',
    'darkgreen',
    'greenyellow',
    'yellowgreen',
    'springgreen',
    'mediumspringgreen',
    'lightgreen',
    'palegreen',
    'darkseagreen',
    'mediumseagreen',
    'seagreen',
    'olive',
    'darkolivegreen',
    'olivedrab',
    'lightcyan',
    'cyan',
    'aqua',
    'aquamarine',
    'mediumaquamarine',
    'paleturquoise',
    'turquoise',
    'mediumturquoise',
    'darkturquoise',
    'lightseagreen',
    'cadetblue',
    'darkcyan',
    'teal',
    'powderblue',
    'lightblue',
    'lightskyblue',
    'skyblue',
    'deepskyblue',
    'lightsteelblue',
    'dodgerblue',
    'cornflowerblue',
    'steelblue',
    'royalblue',
    'blue',
    'mediumblue',
    'darkblue',
    'navy',
    'midnightblue',
    'mediumslateblue',
    'slateblue',
    'darkslateblue',
    'lavender',
    'thistle',
    'plum',
    'violet',
    'orchid',
    'fuchsia',
    'magenta',
    'mediumorchid',
    'mediumpurple',
    'blueviolet',
    'darkviolet',
    'darkorchid',
    'darkmagenta',
    'purple',
    'indigo',
    'pink',
    'lightpink',
    'hotpink',
    'deeppink',
    'palevioletred',
    'mediumvioletred',
    'white',
    'snow',
    'honeydew',
    'mintcream',
    'azure',
    'aliceblue',
    'ghostwhite',
    'whitesmoke',
    'seashell',
    'beige',
    'oldlace',
    'floralwhite',
    'ivory',
    'antiquewhite',
    'linen',
    'lavenderblush',
    'mistyrose',
    'gainsboro',
    'lightgray',
    'silver',
    'darkgray',
    'gray',
    'dimgray',
    'lightslategray',
    'slategray',
    'darkslategray',
    'black',
    'cornsilk',
    'blanchedalmond',
    'bisque',
    'navajowhite',
    'wheat',
    'burlywood',
    'tan',
    'rosybrown',
    'sandybrown',
    'goldenrod',
    'peru',
    'chocolate',
    'saddlebrown',
    'sienna',
    'brown',
    'maroon',
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

  function Link(start, end, from, to, colorFrom, colorTo) {
    this.rectSize = { width: 70, height: 40 }
    this.from = from
    this.to = to
    this.colorFrom = colorFrom
    this.colorTo = colorTo

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
    ctx.fillStyle = this.colorFrom
    ctx.fillRect(this.rectX, this.rectY, this.rectSize.width, this.rectSize.height)
  }

  Link.prototype.drawText = function (ctx) {
    setTextStyle(ctx, 16)
    const x = (this.startX + this.endX) / 2
    const y = (this.startY + this.endY) / 2 - 2
    ctx.fillText(`${this.from}→${this.to}`, x, y)
    const distance = Math.ceil(
      Math.sqrt(Math.abs(this.startX - this.endX) ** 2 + Math.abs(this.startY - this.endY) ** 2)
    )
    ctx.fillText(`dist: ${distance}`, x, y + 18)
  }

  Link.prototype.drawLine = function (ctx) {
    ctx.beginPath()
    ctx.strokeStyle = this.colorFrom
    ctx.moveTo(this.startX, this.startY)
    ctx.lineTo(this.endX, this.endY)
    ctx.stroke()
  }

  function Circle(x, y, name) {
    this.x = x
    this.y = y
    this.name = name
    this.radius = 30
    this.color = colors[getRandomNumber(0, colors.length - 1)]
    this.active = false
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
    ctx.fillStyle = this.color
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

    circles.push(
      new Circle(width / 2, height / 2, lettersList[0]),
      new Circle(width / 3, height / 3, lettersList[1])
    )
    links.push(
      new Link(
        { x: circles[0].x, y: circles[0].y },
        { x: circles[1].x, y: circles[1].y },
        circles[0].name,
        circles[1].name,
        circles[0].color,
        circles[1].color
      )
    )

    draw(context, circles, links, width, height)
  }

  window.addEventListener('load', main)
})()
