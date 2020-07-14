const fs = require('fs');
const http = require('http');
const path = require('path');
const moment = require('moment')

// dataset comes from https://covidtracking.com/data/download

const USDataURL = 'https://covidtracking.com/api/v1/us/daily.csv';
const USStateDataURL = 'https://covidtracking.com/api/v1/states/daily.csv';

const outputDir = path.join(__dirname, 'src','data');

// make data directory
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

const processData = (key, data) => {
    if(key === 'date') {
        const year = data.substr(0, 4);
        const month = data.substr(4, 2);
        const day = data.substr(6, 2);
        const dateString = `${month}-${day}-${year}`;
        const date = moment(dateString, "MM-DD-YYYY").format('x');
        return date;
    } else {
        // if is a number, convert to number
        if(!(isNaN(data))){
            data = +data;
        }
        return data;
    }
}

const downloadFile = (url) => {
    return require('child_process').execFileSync('curl', ['--silent', '-L', url], {encoding: 'utf8', maxBuffer:1024 * 1024 * 8});
}

const getAverage = (data, numDays) => {
    const numPoints = numDays < data.length ? numDays : data.length;
    const rangeArr = data.slice(-numPoints)
    let total = 0;
    for(let i = 0; i < rangeArr.length; i++){
        total += rangeArr[i];
    }

    const avg = Math.avg(total / rangeArr.length);
    return avg;
}

const convertCSVToJSON = (csv) => {
    const csvLines = csv.split(/\r?\n/);

    // get and remove the header
    const headersString = csvLines.shift();
    const headers = headersString.split(',')
    // console.log(headers)
    const isStateData = headers.includes('state');

    const statesObj = {};
    const outputArray = [];
    for(let i = 0; i < csvLines.length; i++){
        let obj = {};
        const csvLineArr = csvLines[i].split(',');
        for( let k = 0; k < headers.length; k++){
            const key = headers[k];
            obj[key] = processData(key, csvLineArr[k])
        }
        obj['positiveRate'] = 100 / (obj['negativeIncrease'] + obj['positiveIncrease']) * obj['positiveIncrease'];
        obj['normalizedIncrease'] = obj['positiveRate'] / 1 * obj['positiveIncrease']

        if(isStateData){
            const state =  csvLineArr[headers.indexOf('state')];
            if(!(state in statesObj)){
                statesObj[state] = [];
            }
            statesObj[state].push(obj);
        } else {
            outputArray.push(obj);
        }
    }

    if(isStateData){
        let reversedObj = {};
        for(key in statesObj){
            reversedObj[key] = statesObj[key].reverse()
        }
        return reversedObj;
    } else {
        return outputArray.reverse();
    }
}

// first process all of USA
console.log('Getting USA Data');
const US_JSON = convertCSVToJSON(downloadFile(USDataURL));
// console.log(US_JSON)
fs.writeFileSync(path.join(outputDir, 'us.json'), JSON.stringify(US_JSON, null, 2));

// Process states
console.log('Getting State Data');
const STATES_JSON = convertCSVToJSON(downloadFile(USStateDataURL));
// console.log(STATES_JSON)
fs.writeFileSync(path.join(outputDir, 'states.json'), JSON.stringify(STATES_JSON, null, 2));

console.log('Done')



