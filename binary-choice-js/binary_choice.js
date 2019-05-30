function getData(){
  var data = [];
  data[0] = document.getElementById('rmu1').value;
  data[1] = document.getElementById('rmu2').value;
  data[2] = document.getElementById('rk').value;
  data[3] = document.getElementById('rtheta1').value;
  data[4] = document.getElementById('rtheta2').value;
  data[5] = document.getElementById('rtime').value;
  data[6] = document.getElementById('rreals').value;
  data[7] = document.getElementById('rn').value;
  data[8] = document.getElementById('ralpha1').value;
  data[9] = document.getElementById('ralpha2').value;
  data[10] = document.getElementById('rm').value;
  console.log(data); // Check the console for the values for every click.
  return data;
}

function count(arr) {
  return arr.reduce((a,b) => (a[b] = a[b] + 1 || 1) && a, {})
}

function intime(mu1, mu2, k, theta1, theta2, N, time, alpha1, alpha2, m){
  var x1;
  var x2;
  var x1b;
  var x2b;
  var N;
  x1 = 0;
  x2 = 0;
  x1b = 0;
  x2b = 0;
  for (i = 0; i <time; i++){
    for (j = 1; j < N + 1; j++){
      if(Math.random()<0.5){
        if(Math.random() <= mu1){
          x1 = x1 + 1
          N = N - 1
        }
      }
      else{
        if(Math.random() <= mu2){
          x2 = x2 + 1
          N = N -1
        }
      }
    }
    for (j = 1; j < x1b + 1; j++){
      if(Math.random() <= theta1/(k**m+(alpha1*(x1-1))**m)){
        x1 = x1 - 1
        N = N + 1
      }
    }
    for (j = 1; j < x2b + 1; j++){
      if(Math.random() <= theta2/(k**m+(alpha2*(x2-1))**m)){
        x2 = x2 - 1
        N = N + 1
      }
    }
    x1b = x1
    x2b = x2
  }
  return [x1, x2]
}

function monte_carlo(){
  var xd1 = getData();
  mu1 = parseFloat(xd1[0]);
  mu2 = parseFloat(xd1[1]);
  k = parseFloat(xd1[2]);
  theta1 = parseFloat(xd1[3]);
  theta2 = parseFloat(xd1[4]);
  time = parseInt(xd1[5], 10);
  reals = parseInt(xd1[6], 10);
  N = parseInt(xd1[7], 10);
  alpha1 = parseFloat(xd1[8]);
  alpha2 = parseFloat(xd1[9]);
  m = parseFloat(xd1[10]);
  N1 = N ;
  var y1 = [];
  var y2 = [];
  var y3 = [];
  for (i1=0; i1<reals; i1++){
    [ax1, ax2] = intime(mu1, mu2, k, theta1, theta2, N, time, alpha1, alpha2, m);
    y1[i1] = ax1;
    y2[i1] = ax2;
    y3[i1] = N1 - ax1 - ax2;
  }
  var Nx0 = []
  var Nx1 = []
  var Nx2 = []
  var Nx3 = []
  for (ii=0; ii<= N1; ii++){
    Nx0[ii] = ii
    Nx1[ii] = count(y1)[ii]
    Nx2[ii] = count(y2)[ii]
    Nx3[ii] = count(y3)[ii]
    if (typeof Nx1[ii] !== "number") {
      Nx1[ii]= 0;
    }
    if (typeof Nx2[ii] !== "number") {
      Nx2[ii]= 0;
    }
    if (typeof Nx3[ii] !== "number") {
      Nx3[ii]= 0;
    }
  }
  return [y1, y2, y3, Nx0, Nx1, Nx2, Nx3]
}

function standardDeviation(values){
  var avg = average(values);
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  var avgSquareDiff = average(squareDiffs);
  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);
  var avg = sum / data.length;
  return avg;
}

function plot(){
  Plotly.purge('myDiv');
  [y1, y2, y3, Nx0, Nx1, Nx2, Nx3]= monte_carlo()
  var shelter1 = {
    name: "Shelter 1",
    x: Nx0,
    y: Nx1,
    type: "bar"
  };
  var shelter2 = {
    name: "Shelter 2",
    x: Nx0,
    y: Nx2,
    type: "bar"
  };
  var outside = {
    name: "Outside",
    x: Nx0,
    y: Nx3,
    type: "bar"
  };
  var data =[shelter1, shelter2, outside];
  var layout = {
    barmode:"group",
    paper_bgcolor: '#EBEBEB',
    plot_bgcolor: '#EBEBEB',
    xaxis: {
    title: 'Number of individuals',
    titlefont: {
      family: 'Arial',
      size: 18,
      color: '#2e383a'
    }
  },
  yaxis: {
    title: 'Number of realisations',
    titlefont: {
      family: 'Arial',
      size: 18,
      color: '#2e383a'
    }
  }
  };
  Plotly.newPlot('myDiv', data, layout);
}

function plotstats(){
  Plotly.purge('myDiv');
  [y1, y2, y3, Nx0, Nx1, Nx2, Nx3]= monte_carlo()
  var data = [{
    name: "",
    x: ['Shelter 1', 'Shelter 2', 'Outside'],
    y: [average(y1), average(y2), average(y3)],
    name: 'Control',
    error_y: {
      type: 'data',
      array: [standardDeviation(y1), standardDeviation(y2), standardDeviation(y3)],
      visible: true
    },
    type: 'bar'
  }];
  var layout = {
    paper_bgcolor: '#EBEBEB',
    plot_bgcolor: '#EBEBEB',
        xaxis: {
    title: '',
    titlefont: {
      family: 'Arial',
      size: 18,
      color: '#2e383a'
    }
  },
  yaxis: {
    title: 'Mean +/- std',
    titlefont: {
      family: 'Arial',
      size: 18,
      color: '#2e383a'
    }
  }
  };
  Plotly.newPlot('myDiv', data, layout);
}

function showdata(){
  Plotly.purge('myDiv');
  [y1, y2, y3, Nx0, Nx1, Nx2, Nx3]= monte_carlo()
  var values = [
  Nx0, Nx1, Nx2, Nx3
  ];
  var data = [{
    type: 'table',
    header: {
     values: [['Number of individuals'], ['Shelter 1'], ['Shelter 2'], ['Outside']],
     align: ["left", "center"],
     line: {width: 1, color: '#EBEBEB'},
     fill: {color: '#61686c'},
     font: {family: "Arial", size: 18, color: "white"}
   },
   cells: {
    values: values,
    height: 40,
    align: ["left", "center"],
    line: {color: "#EBEBEB", width: 1},
    fill: {color: ['#61686c', '#EBEBEB']},
    font: {family: "Arial", size: 18, color: ["white", "#61686c", "#61686c"]}
  }
}]
var layout = {
  paper_bgcolor: '#EBEBEB',
  plot_bgcolor: '#EBEBEB',
};
Plotly.plot('myDiv', data, layout);
}

function getsampleDataForCSV() {
  [y1, y2, y3, Nx0, Nx1, Nx2, Nx3]= monte_carlo();
  var rows = [];
  for (i = 0; i < reals; i++) {
    var thisData = [
    i+1,
    y1[i],
    y2[i],
    y3[i],
    y1[i]+y2[i]+y3[i]
    ];
    rows.push(thisData);
  }
  return rows
}

function downloaddata(){
  var sampleData = getsampleDataForCSV();
  return csvGenerator.exportCSV("simulation", sampleData, ["Simulation number", "Shelter 1", "Shelter 2", "Outside", "Total"]);
}

