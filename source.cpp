#include <map>
#include <string>
#include <vector>
#include <algorithm>
#include <iterator>

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

      if (costs[neighbor_name] > new_cost)
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

std::vector<std::string> start()
{
  std::map<std::string, std::map<std::string, int> > graph;

  graph["start"]["a"] = 5;
  graph["start"]["b"] = 2;
  graph["a"]["c"] = 4;
  graph["a"]["d"] = 2;
  graph["b"]["a"] = 8;
  graph["b"]["d"] = 7;
  graph["c"]["d"] = 6;
  graph["c"]["end"] = 3;
  graph["d"]["end"] = 1;

  std::map<std::string, int> costs;

  costs["a"] = 5;
  costs["b"] = 2;
  costs["c"] = std::numeric_limits<int>::max();
  costs["d"] = std::numeric_limits<int>::max();
  costs["end"] = std::numeric_limits<int>::max();

  std::map<std::string, std::string> parents;

  parents["a"] = "start";
  parents["b"] = "start";
  parents["end"] = "";

  std::map<std::string, std::string> result = find_path(graph, costs, parents);
  return get_final_path(result, "end");
}