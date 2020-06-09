;(function (Module) {
  const CPP_INT_INF = 2147483647
  const testData = {
    start: {
      a: 5,
      b: 2,
    },
    a: {
      c: 4,
      d: 2,
    },
    b: {
      a: 8,
      d: 7,
    },
    c: {
      d: 6,
      end: 3,
    },
    d: {
      end: 1,
    },
  }

  function getGraph(struct) {
    const graph = new Module.map$string$$map$string$$int$$()

    Object.keys(struct).forEach((pointKey) => {
      const siblings = struct[pointKey]
      const siblingsMap = new Module.map$string$$int$()

      Object.keys(siblings).forEach((siblingKey) => {
        siblingsMap.set(siblingKey, siblings[siblingKey])
      })

      graph.set(pointKey, siblingsMap)
    })

    return graph
  }

  function getAllNodes(struct) {
    return Object.keys(struct)
      .reduce((prev, key) => [...prev, key, ...Object.keys(struct[key])], [])
      .filter((value, index, self) => {
        return self.indexOf(value) === index
      })
  }

  function getCosts(struct, startNode) {
    const costs = new Module.map$string$$int$()
    const nodes = getAllNodes(struct)

    nodes.forEach(node => {
      if (struct[startNode][node]) {
        costs.set(node, struct[startNode][node])
      } else {
        costs.set(node, CPP_INT_INF)
      }
    })
    return costs
  }

  function getParents(struct, startNode, endNode) {
    const parents = new Module.map$string$$string$()
    const nodes = getAllNodes(struct)
    nodes.forEach(node => {
      if (struct[startNode][node]) {
        parents.set(node, startNode)
      }
    })

    parents.set(endNode, '')

    return parents
  }

  function main() {
    const startNode = 'start'
    const endNode = 'end'
    const graph = getGraph(testData)
    const costs = getCosts(testData, startNode)
    const parents = getParents(testData, startNode, endNode)

    const vector = Module.dijkstra(graph, costs, parents)

    for (let i = 0; i < vector.size(); i++) {
      console.log(vector.get(i))
    }
  }

  window.addEventListener('load', main)
})(Module)
