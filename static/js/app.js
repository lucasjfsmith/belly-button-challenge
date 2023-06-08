// Use d3 to read samples
const sampleUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let samplesPromise = d3.json(sampleUrl);

// Print data to console
samplesPromise.then(data => console.log(data));

// Create a variable for the dropdown menu
let dropdownMenu = d3.select("#selDataset") 

function populateDropdown(data){
    for (i=0; i < data.names.length; i++) {
        let newOption = dropdownMenu.append("option");
        newOption.attr("value", data.names[i]);
        newOption.text(data.names[i]);
    };
    dropdownMenu.attr("value", dropdownMenu.node().value);
};

function currentSample(data) {
    let sample = {};
    for (i=0; i<data.samples.length; i++) {
        if (dropdownMenu.attr("value") == data.samples[i].id) {
            sample = data.samples[i];
        };
    };
    return sample
};

function populateDemographics(data) {
    let subjectMetadata = {};
    for (i=0; i<data.metadata.length; i++) {
        if (dropdownMenu.attr("value") == String(data.metadata[i].id)) {
            subjectMetadata = data.metadata[i];
        };
    };
    console.log(subjectMetadata);
    let metadataKeys = Object.keys(subjectMetadata);
    let metadataValues = Object.values(subjectMetadata);

    let demographicString = "";
    for (i=0; i<metadataKeys.length; i++) {
        let key = metadataKeys[i];
        let value = metadataValues[i];
        
        let newString = `${metadataKeys[i]}: ${metadataValues[i]}<br>`;
        demographicString += newString;
    };

    d3.select("#sample-metadata").html(demographicString);
    
};

function init(data) {
    // POPULATE DROPDOWN
    populateDropdown(data);

    // POPULATE DEMOGRAPHICS
    populateDemographics(data);

    // Get the current sample based on the dropdown
    let sample = currentSample(data);
    console.log(sample);

    // CREATE BAR CHART

    // Put samples into an array of objects
    let samplesArray = [];
    for (i=0; i<sample.otu_ids.length; i++) {
        let newSample = {};
        newSample.otu_id = `OTU ${String(sample.otu_ids[i])}`;
        newSample.sample_value = sample.sample_values[i];
        newSample.otu_label = sample.otu_labels[i];
        samplesArray.push(newSample)

    };
    console.log(samplesArray);

    // Get the top 10 values based on sample_value then order those in ascending order for Plotly
    let topTenSamples = samplesArray.sort(function(a,b) {
        return b.sample_value - a.sample_value;
    }).slice(0,10).reverse();
    console.log(topTenSamples);

    // Build trace of top ten sample values
    let trace = {
        x: topTenSamples.map(sample => sample.sample_value),
        y: topTenSamples.map(sample => sample.otu_id),
        text: topTenSamples.map(sample => sample.otu_label),
        type: 'bar',
        orientation: 'h'
    };
    
    let layout = {
        title: `Top 10 Sample Values for Subject ${dropdownMenu.attr("value")}`
    }

    let traceData = [trace];
    Plotly.newPlot("bar", traceData, layout);

};

samplesPromise.then(init);
