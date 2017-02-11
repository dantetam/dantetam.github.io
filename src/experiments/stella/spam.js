//Kernel perceptron SVM

function featurizeSpam(texts) {
  var results = [];
  for (var i = 0; i < texts.length; i++) {
    results.push(findWordMapForText(texts[i]));
  }
  return results;
}

/*
function trainKernel(texts, binaryTextLabels, kernelFunc=dotProduct) {
  var vectors = featurizeSpam(texts);
  var alpha = [];
  for (var i = 0; i < vectors.length; i++) {
    alpha.push(0);
  }
  for (var iter = 0; iter < 100; iter++) {
    for (var j = 0; j < vectors.length; j++) {
      var xi = vectors[i], xj = vectors[j], yi = binaryTextLabels[i], yj = binaryTextLabels[j];

      var sum = 0;
      for (var i = 0; i < vectors.length; i++) {
        sum += alpha[i] * yi * kernelFunc(xi, xj);
      }

      var yhat = Math.sign(sum);
      if (yhat !== yj) {
        alpha[j]++;
      }
    }
  }
  return {
    alpha: alpha,
    test: function() {

    }
  };
}
*/

function trainKernel(texts, binaryTextLabels) {
  var vectors = featurizeSpam(texts);
  var alpha = [];
  for (var i = 0; i < vectors.length; i++) {
    alpha.push(0);
  }
  for (var iter = 0; iter < 10; iter++) {
    for (var j = 0; j < vectors.length; j++) {
      var xi = vectors[i], xj = vectors[j], yi = binaryTextLabels[i], yj = binaryTextLabels[j];

      var sum = 0;
      for (var i = 0; i < vectors.length; i++) {
        sum += alpha[i] * yi * sentenceSimilarity(texts[i], texts[j]);
      }

      var yhat = Math.sign(sum);
      if (yhat !== yj) {
        alpha[j]++;
      }
    }
  }
  return {
    alpha: alpha,
    trainingSubset: vectors,
    test: function(sample) {
      var featurizedSample = featurizeSpam([sample])[0];
      var sum = 0;
      for (var i = 0; i < trainingSubset.length; i++) {
        sum += alpha[i] * trainingSubset[i] * sentenceSimilarity(sample, featurizedSample);
      }
      return Math.sign(sum);
    }
  };
}













//A comment to hold the line.
