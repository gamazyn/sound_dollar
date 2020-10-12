//Criar variável para carregar arquivo
let data;

//Tocar automaticamente o som
let index = 0;
let trigger = 0;
let autoplay = false;

//Configurando tamanho do som
let totalLenght = 50000;
let tick;
let osc;

//min e max da tabela
let compraMin;
let compraMax;
let vendaMin;
let vendaMax;

function preload() {
  //Carregando a tabela em CSV localmente
  data = loadTable('assets/dollar_variation_v2.csv', 'csv', 'header');
  //data = loadTable('assets/housing.csv', 'csv', 'header');

  drop = loadSound('assets/drop.wav');
}

function setup() {
  //Contando colunas
  print('total de ' + data.getRowCount() + ' linhas na tabela');
  print('total de ' + data.getColumnCount() + ' colunas na tabela');

  //Duração da nota
  tick = totalLenght / data.getRowCount();

  //Calculando Max e Min
  compraMax = max(data.getColumn('cotacaoCompra'));
  compraMin = min(data.getColumn('cotacaoCompra'));

  vendaMax = max(data.getColumn('cotacaoVenda'));
  vendaMin = min(data.getColumn('cotacaoVenda'));

  //Verificando os valores obtidos:
  // console.log('Duração: ' + tick);
  // console.log('Valor de Compra Máximo: ' + compraMax);
  // console.log('Valor de Compra Mínimo: ' + compraMin);
  // console.log('Valor de Venda Máximo: ' + vendaMax);
  // console.log('Valor de Venda Mínimo: ' + vendaMin);

  //Osciladores iniciando mudos
  osc1 = new p5.SinOsc();
  osc2 = new p5.SawOsc();

  osc1.start();
  osc1.amp(0);
  osc2.start();
  osc2.amp(0);
}
//Função para tocar a nota
function playNote(position, duration, osc, lower, upper) {
  midi = round(map(position, lower, upper, 57, 93));

  osc.freq(midiToFreq(midi));

  // Fade it in
  osc.fade(0.5, 0.2);

  // If we sest a duration, fade it out
  if (duration) {
    setTimeout(function () {
      osc.fade(0, 0.2);
    }, duration - 50);
  }
}

function draw() {
  if (autoplay && millis() > trigger) {
    playNote(data.get(index, 'cotacaoCompra'), 400, osc1, compraMin, compraMax);
    playNote(data.get(index, 'cotacaoVenda'), 400, osc2, vendaMax, vendaMin);

    let vol = random(0.4, 1.0);
    console.log(vol);
    masterVolume(vol);

    trigger = millis() + tick;

    if (index % 500 == 0) {
      console.log('DDDRRRRROOOOOPPPPPPPPP... the dollar!');
      drop.play();
    }
    // Move to the next note
    index++;
    // We're at the end, stop autoplaying.
  } else if (index >= data.getRowCount()) {
    autoplay = false;
    osc1.stop();
    osc2.stop();
  }
}

function mouseClicked() {
  if (autoplay === false) {
    autoplay = true;
  } else {
    autoplay = false;
  }
}
