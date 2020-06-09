#include <emscripten/bind.h>

using namespace emscripten;

std::vector<std::string> get_final_path(std::map<std::string, std::string> parents, std::string lastNode)
{
  std::vector<std::string> path;
  path.push_back(lastNode);
  std::string previos_node_name = parents[lastNode];

  while (!previos_node_name.empty())
  {
    path.insert(path.begin(), previos_node_name);

    if (parents.find(previos_node_name) != parents.end())
    {
      previos_node_name = parents[previos_node_name];
    }
    else
    {
      previos_node_name = "";
    }
  }

  return path;
}

std::string find_lowest_node(std::map<std::string, int> costs, std::vector<std::string> processed)
{
  int lowest_cost = std::numeric_limits<int>::max();
  std::string lowest_node = "";
  std::map<std::string, int>::iterator node;

  for (node = costs.begin(); node != costs.end(); ++node)
  {
    std::string name = node->first;
    int cost = node->second;
    std::vector<std::string>::iterator processedName = std::find(processed.begin(), processed.end(), name);

    if (cost < lowest_cost && processedName == processed.end())
    {
      lowest_node = name;
      lowest_cost = cost;
    }
  }

  return lowest_node;
}

std::map<std::string, std::string> find_path(
    std::map<std::string, std::map<std::string, int> > graph,
    std::map<std::string, int> costs,
    std::map<std::string, std::string> parents)
{
  std::vector<std::string> processed;

  std::string node = find_lowest_node(costs, processed);

  while (!node.empty())
  {
    int cost = costs[node];
    std::map<std::string, int> neighbors = graph[node];

    std::map<std::string, int>::iterator neighbor;
    for (neighbor = neighbors.begin(); neighbor != neighbors.end(); ++neighbor)
    {
      std::string neighbor_name = neighbor->first;
      int neighbor_cost = neighbor->second;
      int new_cost = cost + neighbor_cost;

      if (costs.find(neighbor_name) != costs.end() && costs[neighbor_name] > new_cost)
      {
        costs[neighbor_name] = new_cost;
        parents[neighbor_name] = node;
      }
    }

    processed.push_back(node);
    node = find_lowest_node(costs, processed);
  }

  return parents;
}

std::vector<std::string> dijkstra(
  std::map<std::string, std::map<std::string, int> > graph,
  std::map<std::string, int> costs,
  std::map<std::string, std::string> parents,
  std::string lastNode
)
{
  std::map<std::string, std::string> result = find_path(graph, costs, parents);
  return get_final_path(result, lastNode);
}

EMSCRIPTEN_BINDINGS(module) {
  function("dijkstra", &dijkstra);

  // register bindings for std::vector<int> and std::map<int, std::string>.
  register_vector<std::string>("vector<string>");
  register_map<std::string, std::string>("map<string, string>");
  register_map<std::string, int>("map<string, int>");
  register_map<std::string, std::map<std::string, int>>("map<string, map<string, int>>");
}