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
      sentence: listSentences[i],
      outVertices = {},
      inVertices = {}
    }
    for (var j = 0; j < listSentences.length(); j++) {
      if (i === j) continue;
    }
    graph.push(node);
  }
}











//A comment to hold the line.
