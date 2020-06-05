#include <iostream>
#include <map>
#include <string>
#include <vector>

using namespace std;

string find_lowest_node(std::map<std::string, int> costs, std::vector<string> processed)
{
  // lowest_cost = float('inf')
  //   lowest_node = None

  //   for node in costs:
  //       cost = costs[node]
  //       if cost < lowest_cost and node not in processed:
  //           lowest_node = node
  //           lowest_cost = cost
  //   return lowest_node
  int lowest_cods = std::numeric_limits<int>::max();
  string lowest_node = "";
  map<string, int>::iterator it;
  for (it = costs.begin(); it != costs.end(); ++it) {
    cout << it->first << ", " << it->second << '\n';
  }

  return lowest_node;
}

int main(int argc, char **argv)
{
  std::map<std::string, std::map<string, int> > graph;

  // graph["start"] = {};
  graph["start"]["a"] = 10;
  // graph["a"] = {};
  graph["a"]["b"] = 20;
  // graph["b"] = {};
  graph["b"]["c"] = 1;
  graph["b"]["end"] = 30;
  // graph["c"] = {};
  graph["c"]["a"] = 1;
  // graph["end"] = {};

  std::map<std::string, int> costs;

  costs["a"] = 10;
  costs["b"] = std::numeric_limits<int>::max();
  costs["c"] = std::numeric_limits<int>::max();
  costs["f"] = std::numeric_limits<int>::max();

  std::map<std::string, std::string> parents;

  parents["A"] = "start";
  parents["F"] = "";

  std::vector<string> processed;

  find_lowest_node(costs, processed);
}