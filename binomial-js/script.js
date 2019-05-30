 function factorial(x){
  if (x === 0){
    return 1;
  }
  return x * factorial(x-1);
}

function getData(){
  var data = [];
  data[0] = document.getElementById('xr').value;
  data[1] = document.getElementById('pr').value;
  data[2] = document.getElementById('xr1').value;
  data[3] = document.getElementById('xr2').value;
  console.log(data); // Check the console for the values for every click.
  return data;
}

function plot(){
  var y1 = [];
  var y2 = [];
  var y3 ;
  var z1 = [];
  var z2 = [];
  var z3 ;
  var i ;
  var j ;
  var xd1 = getData();
  x = parseInt(xd1[0],10);
  x1 = parseInt(xd1[2],10);
  x2 = parseInt(xd1[3],10);
  p = parseFloat(xd1[1]);
  y3 = 0.;
  z3 = 0.;
  for (i=0; i < x+1; i++) {
    y1[i] = i
    y2[i] = factorial(x) / (factorial(i) * factorial(x-i)) * p**i * (1.-p)**(x-i);
    if (i> x1-1 && i < x2 +1){
      z2[i] = factorial(x) / (factorial(i) * factorial(x-i)) * p**i * (1.-p)**(x-i);
      z3 = z3 + z2[i]
    }
    else {
      z2[i] = 0
    }
  }
  var trace1 =
  {
    x: y1,
    y: y2,
    type: 'bar'
  };

  var trace2 =
  {
    x: y1,
    y: z2,
    type: 'bar',
    hoverinfo: 'none',
  };
  var data = [trace1, trace2];
  var layout = {
    title: 'P('+x1+'...'+x2 +')= '+z3,
    barmode: 'overlay',
    showlegend: false,
    autosize: false,
    width: 650,
    height: 400,
    margin: {
    l: 80,
    r: 80,
    b: 80,
    t: 80,
    pad: 4
    },
    font: {
    size: 18,
    color: '#7f7f7f'
  },
paper_bgcolor: '#EBEBEB',
plot_bgcolor: '#EBEBEB',
};

Plotly.newPlot('myDiv', data, layout);
}