class NeuralNetwork {
  constructor(neuronCounts){
    // neuronCounts eh o numero de neuronios que tera em cada nivel
    this.levels = [];
    for(let i=0; i < neuronCounts.length-1; i++){
      this.levels.push(new Level(
        neuronCounts[i], neuronCounts[i+1]
      ));
    }
  }

  static feedForward(givenInputs, network){
    let outputs = Level.feedForward(givenInputs, network.levels[0])
    for(let i=1; i < network.levels.length; i++){
      outputs = Level.feedForward(outputs,network.levels[i]);
    }
    return outputs;
  }

  static mutate(network, amount=1){
    network.levels.forEach(level => {
      for(let i=0; i<level.biases.length; i++){
        level.biases[i] = lerp(level.biases[i], Math.random()*2-1, amount)
      }
      for(let i=0; i<level.weights.length; i++){
        for(let j=0; j < level.weights[i].length; j++){
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random()*2-1, 
            amount
          )
        }
      }
    });
  }
}


// nivel da camada da rede neural
class Level {
  constructor(inputCount, outputCount){
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount); // cada neuronio tera um desvio, o qual sera acionado quando estiver acima de um determinado valor
    this.weights = []; // cada conexao tera um peso
    for(let i = 0; i < inputCount; i++){
      this.weights[i] = new Array(outputCount); 
    }

    // para comecar vamos criar uma fauncao random para o nosso cerebro
    Level.#randomize(this);
  }

  static #randomize(level){
    // definindo pesos aleatorios para cada conexao da entrada e saida
    for(let i=0; i < level.inputs.length; i++){
      for(let j=0; j< level.outputs.length; j++){
        level.weights[i][j] = Math.random()*2-1; // varia de -1 a 1
      }
    }

    // agora para os desvios (biases)
    for(let i=0; i < level.biases.length; i++){
      level.biases[i] = Math.random()*2-1; 
    }
  }

  static feedForward(givenInputs, level){
    for(let i=0; i < level.inputs.length; i++){
      level.inputs[i] = givenInputs[i];
    }

    // esse loop fara um calculo para as saidas com base nos dados da entrada
    for(let i=0; i < level.outputs.length; i++){
      let sum = 0;

      // percorendo todas as entradas
      for(let j=0; j < level.inputs.length; j++){
        // a soma sera um produto entre a entrada e o peso da entrada com a saida
        sum+=level.inputs[j]*level.weights[j][i];
      }

      // agora verificamos se a soma é maior que o desvio
      if(sum > level.biases[i]){
        level.outputs[i] = 1;
      }
      else {
        level.outputs[i] = 0;
      }
    }
    return level.outputs;
  }
}