;(function (Module) {
  const CPP_INT_INF = 2147483647
  const testData = {
    o: {
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
      f: 3,
    },
    d: {
      f: 1,
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
      } else if (node !== startNode) {
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

  function findPath(data, startNode, endNode) {
    const graph = getGraph(data)
    const costs = getCosts(data, startNode)
    const parents = getParents(data, startNode, endNode)

    const vector = Module.dijkstra(graph, costs, parents, endNode)
    const result = []

    for (let i = 0; i < vector.size(); i++) {
      result.push(vector.get(i))
    }

    return result
  }

  function main() {
    window.findPath = findPath
  }

  window.addEventListener('load', main)
})(Module)
