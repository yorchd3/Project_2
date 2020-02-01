var url = "./data/samples.json";
var url2 = "./data/ESG_Database.json";

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

  d3.json(url2).then((response2) => {

    var tickersArr = Object.keys(response2["Company Name"]);
    // var namesArr = Object.values(response2["Company Name"]);

    tickersArr.forEach(ticker => {
      d3.select("#tickerPicker").append("option").text(`${ticker}`);
    });

    var testComp = tickersArr[0];

    var scoresObj = {};
    scoresObj.agg = Object.values(response2["ESG Risk Score"]);
    scoresObj.env = Object.values(response2["Environment Risk Score"]);
    scoresObj.soc = Object.values(response2["Social Risk Score"]);
    scoresObj.gov = Object.values(response2["Governance Risk Score"]);

    updateESG(testComp, scoresObj);

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

function updateESG(testComp, scoresObj) {

  console.log(testComp);

  var metaDiv2 = d3.select("#company-info");

  metaDiv2.selectAll("ul").remove();

  metaDiv2.append("ul").attr("id", "meta-ul2");

  var metUl2 = d3.select("#meta-ul2");

  metUl2.append("li").text(`Ticker: ${testComp}`);

  Object.keys(scoresObj).forEach(property => metUl2.append("li").text(Object.keys(scoresObj)));

  let aggArr = Object.values(scoresObj.agg);
  let envArr = Object.values(scoresObj.env);
  let socArr = Object.values(scoresObj.soc);
  let govArr = Object.values(scoresObj.gov);

  console.log(`aggArr: ${aggArr}`);
  console.log(`envArr: ${envArr}`);
  console.log(`socArr: ${socArr}`);
  console.log(`govArr: ${govArr}`);

}


/*
ticker

ESG Risk Score
response["ESG Risk Score"] <- object with key-value pairs, key is ticker, value is integer

Environment Risk Score
response["Environment Risk Score"]

Social Risk Score
response["Social Risk Score"]

Governance Risk Score
response["Governance Risk Score"]

*/

//ticker,ESG Risk Score,ESG Risk Score Level,ESG Risk Score Percentile,Environment Risk Score,Social Risk Score,Governance Risk Score,Controversy Level Risk Text
//MMM,35,High,69th percentile,12.6,12.7,9.2,Significant
//AOS,25,Medium,37th percentile,13.6,4.3,7.3,Moderate
//ABT,31,High,57th percentile,3.7,15.3,11.6,Significant
//ABBV,30,High,56th percentile,1,16.5,12.8,Significant
//ABN.AS,86,Severe,98th percentile,90,85,84.0,Significant
//ACN,15,Low,7th percentile,1,8.2,6.2,Moderate
//AC.PA,19,Negligible,16th percentile,7,7,5.0,Moderate
//ATVI,17,Low,10th percentile,0.2,10.5,6.1,Moderate
//AYI,28,Medium,46th percentile,8.5,11.3,8.0,Moderate


var rand_arr1 = [];
for (var i = 0; i < 50; i ++) {
	rand_arr1[i] = Math.random();
}
var rand_arr2 = [];
for (var i = 0; i < 500; i ++) {
	rand_arr2[i] = Math.random();
}

var trace1 = {
    x: rand_arr1,
    type: "histogram",
    opacity: 0.75,
    name:"trace1 sum",
    histfunc: "sum",
    // histnorm: "count",
    marker: {
      color: "#adff2f",
      line: {
        color: "#000000",
        width: 1
      }
    } 
  };
var trace2 = {
    x: rand_arr2,
    type: "histogram",
    opacity: 0.75,
    name:"trace2 avg",
    histfunc: "avg",
    // histnorm: "count",
    marker: {
      color: "#ff009d",
      line: {
        color: "#000000",
        width: 1
      }
    } 
  }; 
var data = [trace1, trace2];
var layout = {
  bargap: 2, 
  bargroupgap: 2.5, 
  barmode: "group", 
  title: "Sample Plot Title Here", 
  xaxis: {title: "Sample xaxis title"}, 
  yaxis: {title: "Sample yaxis title"}
};
Plotly.newPlot("histogram", data, layout);