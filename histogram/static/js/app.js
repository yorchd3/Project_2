var url = "./data/samples.json";

// declare initiation function
// select dropdown
// use D3 to get json from data source
// access the data
// create dropdown option for each sample id

function init() {

  d3.json(url).then((response) => {

    var namesArr = response.names;
    var metArr = response.metadata;
    var samplesArr = response.samples;

    namesArr.forEach(testSub => {
      d3.select("#selDataset").append("option").text(`${testSub}`);
    });

    var newSample = namesArr[0];
    let metObj = metArr.filter(obj => obj.id == newSample);
    let samplesObj = samplesArr.filter(obj => obj.id == newSample);
    
    var myObj = {};
    myObj.id = newSample;
    myObj.metadata = metObj[0];
    myObj.samples = samplesObj[0];
    
    updateVisuals(myObj);

  });

}

// declare sampleSelected function
// select dropdown
// event handler: on change of select attr "value" do the following
// use D3 to get data
// access data
// updateVisuals

function sampleSelected(inputValue) {

  // var dropdownMenu = d3.select("#selDataset");
  d3.json(url).then((response) => {

    var namesArr = response.names;
    var metArr = response.metadata;
    var samplesArr = response.samples;

    let namesObj = namesArr.filter(obj => obj.id == inputValue);
    let metObj = metArr.filter(obj => obj.id == inputValue);
    let samplesObj = samplesArr.filter(obj => obj.id == inputValue);
    
    var myObj = {};
    myObj.id = namesObj[0];
    myObj.metadata = metObj[0];
    myObj.samples = samplesObj[0];
    
    updateVisuals(myObj);

});

}

//initialize page with first sample
init();

// declare updateVisuals function to be hoisted by init or sampleSelected
// bar chart
// bubble chart
// metadata

function updateVisuals(myObj) {

  var otuArr = myObj.samples.otu_ids.slice(0,10);
  var otuStrArr = [];
  otuArr.map(otu => {
    var strOTU = `OTU ${String(otu)}`;
    otuStrArr.push(strOTU);
  });
  
  var barTrace = {
    type: "bar",
    x: myObj.samples.sample_values.slice(0,10),
    y: otuStrArr,
    labels: myObj.samples.otu_ids.slice(0,10),
    text: myObj.samples.otu_labels.slice(0,10),
    orientation: "h"
  }

  var barData = [barTrace];

  var barLayout = {
    title: `Top 10 OTUs in Subject ${myObj.id}`,
    xaxis: {title:"OTU Population (arb.)"},
    yaxis: {title:""},
    bargap: 0.1
  }

  Plotly.newPlot("bar", barData, barLayout);

  var bubTrace = {
    x: myObj.samples.otu_ids,
    y: myObj.samples.sample_values,
    mode: "markers",
    marker: {
      size: myObj.samples.sample_values,
      colorscale: "Rainbow",
      color: myObj.samples.otu_ids,
      line: {
        color: "000000",
        width: "0.5"
      }
    },
    text: myObj.samples.otu_labels
  }

  var bubData = [bubTrace];

  var bubLayout = {
  title: "OTU Bubble Chart",
  showlegend: false
  }

  Plotly.newPlot("bubble", bubData, bubLayout);

  
  var metaDiv = d3.select("#sample-metadata");

  metaDiv.selectAll("ul").remove();
  
  metaDiv.append("ul").attr("id", "meta-ul");

  var metUl = d3.select("#meta-ul");

  Object.keys(myObj.metadata).forEach(property => metUl.append("li").text(`${property}: ${myObj.metadata[property]}`));

}

var bins = ["A","B","C","D","F"];
var y = [];
for (var i = 0; i < 500; i ++) {
	bins[i] = Math.random();
}

var trace = {
    x: bins,
    type: "histogram",
    opacity: 0.75,
    name:"trace name",
    autobinx: false,
    histnorm: "count",
    marker: {
      color: "#adff2f",
      line: {
        color: "#000000",
        width: 1.5
      }
    } 
  };
var data = [trace];
var layout = {
  bargap: 2, 
  bargroupgap: 2.5, 
  // barmode: "overlay", 
  title: "Sample Plot Title Here", 
  xaxis: {title: "Sample xaxis title"}, 
  yaxis: {title: "Sample yaxis title"}
};
Plotly.newPlot("histogram", data);