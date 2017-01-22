//An investigation of text summarizing methods.
//here we go over "TextRank", which is a text based analogue for page rank,
//with weighted edges and the same idea of connection and importance.

function sentenceSimilarity(text1, text2) {
  var tokens1 = text1.split(" ");
  var tokens2 = text2.split(" ");
  var matches = findMatchesInStringArrays(tokens1, tokens2);
  return matches.length() / (Math.log(tokens1.length()) + Math.log(tokens2.length()));
}

function createGraphFromSentences(listSentences) {
  var graph = [];
  for (var i = 0; i < listSentences.length(); i++) {
    var node = {
      importance: 1.0,
      sentence: listSentences[i],
      neighbors = {}
    }
    for (var j = 0; j < listSentences.length(); j++) {
      if (i === j) continue;
      var sentenceSimilarity = sentenceSimilarity(listSentences[i], listSentences[j]);
      node.neighbors[j] = sentenceSimilarity;
    }
    graph.push(node);
  }
  return graph;
}

function iterateTextrankGraph(graph, d=0.85) {
  var newImportances = [];
  for (var i = 0; i < graph.length(); i++) {
    var nodeI = graph[i];

    var sum = 0;
    var nodeIAdj = Object.keys(nodeI.neighbors);
    for (var j = 0; j < nodeIAdj.length; j++) {
      var nodeJ = graph[nodeIAdj[j]];
      var weightIJ = nodeI.neighbors[nodeIAdj[j]];

      var nodeJAdj = Object.keys(nodeJ.neighbors);
      var jkSum = 0;
      for (var k = 0; k < nodeJAdj.length; k++) {
        var weightJK = nodeJ.neighbors[nodeJAdj[k]];
        jkSum += weightJK;
      }

      sum += weightIJ * nodeJ.importance / jkSum;
    }

    var newScore = (1-d) + d*sum;
    newImportances.push(newScore);
  }
  for (var i = 0; i < graph.length(); i++) {
    graph[i].importance = newImportances[i];
  }
  return graph;
}












//A comment to hold the line.
