var personas = [];

// Green 123, 194, 83

var green = [123, 194, 83];
var red = [221, 65, 49];
var blue = [1, 79, 131];
var yellow = [249, 223, 60];
var orange = [255, 199, 102]; // [243, 119, 107];

var black = [25, 85, 143];

var openness = [];
var conscientiousness = [];
var agreeableness = [];
var extraversion = [];
var neuroticism = [];

var mode = "time";

var datapath;

var randomScalingFactor = function () {
  return Math.round(Math.random() * 100)
};

function toggleChart() {

  if (mode === "time") {
    mode = "persona";
  } else {
    mode = "time";
  }

  drawCharts();

  // console.log('toggle');
}

function makeRGB(color, opacity) {
  var rgb = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + opacity + ')';
  return rgb;
}

function basicLineChart(color) {

  var lineChartData = {
    datasets: [{
      label: "My First dataset",
      fillColor: makeRGB(color, 0.2),
      strokeColor: makeRGB(color, 1),
      pointColor: makeRGB(color, 1),
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: makeRGB(color, 1)

    }]
  }

  return lineChartData;
}

function process(persona, factor, collection) {
  var value = factor.percentile.toFixed(2) * 100;

  factor.children.forEach(function (trait) {

    var traitdata = {
      'name': persona.title,
      // 'year': personas[persona.data.id].start,
      'value': trait.percentile.toFixed(2) * 100
    };

    if (subfactors[trait.name] != undefined) {

      subfactors[trait.name].push(traitdata);
    }
  })

  var data = {
    'name': persona.title,
    // 'year': personas[persona.data.id].start,
    'value': value
  };

  collection.push(data);
}

function compare(a, b) {
  if (a.year < b.year)
    return -1;
  else if (a.year > b.year)
    return 1;
  else
    return 0;
}

function orderData(data) {

  var sorted = data.sort(compare);

  var sortedCount = 0;

  var orderedData = new Object();
  orderedData.labels = [];
  orderedData.data = [];

  sorted.forEach(function (element) {

    var labelcount = sortedCount + 1;

    console.log('labelcount = ' + labelcount)

    console.log(personas[labelcount]);

    if (mode === "time") {
      if (labelcount < 9) {
        orderedData.labels[sortedCount] = personas[labelcount].start;
      }
    } else {
      if (labelcount < 9) {
        orderedData.labels[sortedCount] = personas[labelcount].era.substring(0, 18);
      }
    }

    orderedData.data[sortedCount] = element.value;
    sortedCount++;
  });

  return orderedData;
}

function buildLineData(data, color) {

  var ordered = orderData(data);

  var lineData = basicLineChart(color);

  lineData.labels = ordered.labels;
  lineData.datasets[0].data = ordered.data;

  return lineData;
}


function addChart(anchor, data) {

  var portrait = window.matchMedia("(min-width: 320px) and (max-width: 480px)");
  var iphonex = window.matchMedia("(min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3)");

  var openness = document.getElementById(anchor);

  openness.innerHTML = "";

  var opennessChart = document.createElement('canvas');

  var chartwidth = 300;
  var chartheight = 300;

  if (portrait.matches) {
    chartwidth = 700;
    chartheight = 700;
    console.log('mobile portrait mode');
  }

  if (iphonex.matches) {
    chartwidth = 700;
    chartheight = 700;
    console.log('iphonex mode');
  }

  opennessChart.height = chartheight;
  openness.style.height = chartheight + 'px';
  opennessChart.width = chartwidth;
  openness.style.width = chartwidth + 'px';


  // opennessChart.width = 400;


  openness.appendChild(opennessChart);

  var ctx = opennessChart.getContext("2d");

  if (mode === "time") {

    var chart = new Chart(ctx).Line(data, {
      scaleOverride: true,
      scaleSteps: 10,
      scaleStepWidth: 10,
      scaleStartValue: 0,
      scaleShowVerticalLines: false
    }, {
      options: {
        legend: {
          labels: {
            fontColor: "white",
            fontSize: 18
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: "white",
              fontSize: 18,
              stepSize: 1,
              beginAtZero: true
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: "white",
              fontSize: 14,
              stepSize: 1,
              beginAtZero: true
            }
          }]
        }
      }
    });
  } else {
    var chart = new Chart(ctx).Bar(data, {
      scaleOverride: true,
      scaleSteps: 10,
      scaleStepWidth: 10,
      scaleStartValue: 0,
      scaleShowVerticalLines: false
    });
  }
}

var subfactors = [];

function addOption(select, name) {
  var option = document.createElement('option');
  option.value = name;
  option.innerHTML = name;
  select.appendChild(option);

  subfactors[name] = [];
}

function buildPicker(factor) {

  factor.children.forEach(function (name) {

    switch (factor.name) {

      case "Openness":
        var select = document.getElementById('openness-select');
        addOption(select, name.name);
        break;

      case "Conscientiousness":
        var select = document.getElementById('conscientiousness-select');
        addOption(select, name.name);
        break;

      case "Agreeableness":
        var select = document.getElementById('agreeableness-select');
        addOption(select, name.name);
        break;

      case "Extraversion":
        var select = document.getElementById('extraversion-select');
        addOption(select, name.name);
        break;

      case "Emotional range":
        var select = document.getElementById('neuroticism-select');
        addOption(select, name.name);
        break;
    }
  })
}

function drawCharts() {
  opennessTrait()
  conscientiousnessTrait()
  agreeablenessTrait()
  extraversionTrait()
  neuroticismTrait()
}

function compareOrder(a, b) {
  if (a.order < b.order)
    return -1;
  else if (a.order > b.order)
    return 1;
  else
    return 0;
}

function readCombinedData() {

  var url = datapath;

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var data = JSON.parse(xmlhttp.responseText);

      console.log(data[0]);

      var personaCount = 0;

      var factors = data[0].analysis.personality;

      for (var f = 0; f < factors.length; f++) {
        buildPicker(factors[f]);
      }

      var sorted = data.sort(compareOrder);

      sorted.forEach(function (persona) {

        var bigfive = persona.analysis.personality;

        bigfive.forEach(function (factor) {

          switch (factor.name) {

            case "Openness":
              process(persona, factor, openness);
              break;

            case "Conscientiousness":
              process(persona, factor, conscientiousness);
              break;

            case "Agreeableness":
              process(persona, factor, agreeableness);
              break;

            case "Extraversion":
              process(persona, factor, extraversion);
              break;

            case "Emotional range":
              process(persona, factor, neuroticism);
              break;
          }
        });

        personaCount++;
      })

      drawCharts()
    };
  }

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function readPersonaData() {
  var url = datapath;

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var data = JSON.parse(xmlhttp.responseText);

      data.forEach(function (persona) {
        personas[persona.order] = persona;
      });

      readCombinedData();
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function opennessTrait(e) {
  var select = document.getElementById('openness-select');
  if (select.value === 'combined') {
    addChart('openness', buildLineData(openness, black));
  } else {
    addChart('openness', buildLineData(subfactors[select.value], black));
  }
}

function conscientiousnessTrait(e) {
  var select = document.getElementById('conscientiousness-select');
  if (select.value === 'combined') {
    addChart('conscientiousness', buildLineData(conscientiousness, black));
  } else {
    addChart('conscientiousness', buildLineData(subfactors[select.value], black));
  }
}

function agreeablenessTrait(e) {
  var select = document.getElementById('agreeableness-select');
  if (select.value === 'combined') {
    addChart('agreeableness', buildLineData(agreeableness, black));
  } else {
    addChart('agreeableness', buildLineData(subfactors[select.value], black));
  }
}

function extraversionTrait(e) {
  var select = document.getElementById('extraversion-select');
  if (select.value === 'combined') {
    addChart('extraversion', buildLineData(extraversion, black));
  } else {
    addChart('extraversion', buildLineData(subfactors[select.value], black));
  }
}

function neuroticismTrait(e) {
  var select = document.getElementById('neuroticism-select');
  if (select.value === 'combined') {
    addChart('neuroticism', buildLineData(neuroticism, black));
  } else {
    addChart('neuroticism', buildLineData(subfactors[select.value], black));
  }
}

function initialize(path){
  datapath = path;
  readPersonaData();
}

// window.onload = function () {
//   readPersonaData();
// }