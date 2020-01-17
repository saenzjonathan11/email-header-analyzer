// function initMap() {
//     let latitude = 0, longitude = 0;
//     // The location of Uluru
//     var uluru = {lat: latitude, lng: longitude};
//     // The map, centered at Uluru
//     var map = new google.maps.Map(
//         document.getElementById('map'), {zoom: 4, center: uluru});
//     // The marker, positioned at Uluru
//     var marker = new google.maps.Marker({position: uluru, map: map});
// }

// Initialize and add the map
function initMap(latitude = 42, longitude = 32) {
    console.log("initMap");
// function initMap() {
//     let latitude = 42, longitude = 32;
    // The location of Uluru
    var uluru = {lat: latitude, lng: longitude};
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 5, center: uluru});
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({position: uluru, map: map});
}

var newArray = [];

// gets email header and parses the text for all the ip Address
function parse() {
    var text = document.getElementById("textToParse").value; 
    var regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
    var regex2 = /Message-ID:\s+([<'])(.*?)([>'])/g
    var regex3 = /([<].*?[>])/g
    ipAll = text.match(regex);
    // remove duplicates ip addresses
    publicIPs = Array.from(new Set(ipAll));
    messageID = text.match(regex2);
    messageID = messageID[messageID.length-1];
    messageID = messageID.substring(13, messageID.length-1);
    console.log(messageID);
    console.log(publicIPs);
    var messageIDDiv = document.createElement("DIV");
    messageIDDiv.setAttribute("class", "messageID");
    document.body.appendChild(messageIDDiv);
    messageIDDiv.innerHTML = "Message:ID :" + messageID;
    // document.getElementsByClassName("messageID").textContent = messageID;
    if (!text || 0 === text.length) {
        if (document.getElementById('ipTable')) {
            document.getElementById('ipTable').remove();
        }
        if (document.getElementById('map')) {
            document.getElementById('map').remove();
            document.getElementById('footer').remove();
        }
        return;
    } else {

        // prevents previous table displaying 
        if (document.getElementById("ipTable")) {
            document.getElementById("ipTable").remove();
        }

        if (!document.getElementById("map")) {
            var map = document.createElement("DIV");
            var footer = document.createElement("DIV");
            map.setAttribute("id", "map");
            footer.setAttribute("id", "footer");
            document.body.appendChild(map); 
            document.body.appendChild(footer);
        }


        var ipTable = document.createElement("TABLE");
        ipTable.setAttribute("id", "ipTable");
        document.getElementById("dataTable").appendChild(ipTable);

        var tableHead = document.createElement("THEAD");
        tableHead.setAttribute("id", "ipTableHead");
        document.getElementById("ipTable").appendChild(tableHead); 

        var tableHeader = document.createElement("TR");
        tableHeader.setAttribute("id", "tableHeader");
        document.getElementById("ipTableHead").appendChild(tableHeader); 

        let headerNames = ["IP address(s)", "3rd Party Anaylzer", "Country", "Region", "Flag"];
        for (let i = 0; i < headerNames.length; ++i) {
            var th = document.createElement("th");
            tableHeader.appendChild(th);
            var header = document.createTextNode(headerNames[i]);
            th.appendChild(header);
        }

        var tableBody = document.createElement("TBODY");
        tableBody.setAttribute("id", "ipTableBody");
        document.getElementById("ipTable").appendChild(tableBody); 
       
        for (let i = 0; i < publicIPs.length; ++i) {
            runRequest(publicIPs[i]);
        }

        // getElementById("messageID").appendChild(messageID);

        // var lat = 0; lng = 0;
        // for (let i = 0; i < publicIPs.length; ++i) {
        //     let url = 'http://api.ipapi.com/' + publicIPs[i] + '?access_key=149b8e5e90715dc7185f92575e3e82c5';
        //     let request = new XMLHttpRequest();
        //     request.responseType = 'json';
        //     request.open('GET', url);
        //     request.onload = function() {
        //     let data = request.response;
        //         if (data['type']) {
        //             if(typeof(data['latitude']) === 'number' && typeof(data['longitude']) === 'number') {
        //                 lat = data['latitude'];
        //                 lng = data['longitude'];
        //                 initMap(lat, lng);
        //                 renderTable(data);
        //             }
        //         }
        //     }
        //     request.send();
        //     console.log(lat + " - " + lng);
        // }
        // console.log(lat + " " + lng);

    }
}

function runRequest(uniqueIP) {
    // console.log(uniqueIP);
    var lat = 0; lng = 0;
    let url = 'http://api.ipapi.com/' + uniqueIP + '?access_key=149b8e5e90715dc7185f92575e3e82c5';
    let request = new XMLHttpRequest();
    // request.addEventListener("load", reqListener);
    request.responseType = 'json';
    request.open('GET', url);
    request.onload = function() {
        let data = request.response;
        console.log(data);
        if (data['type']) {
            if(typeof(data['latitude']) === 'number' && typeof(data['longitude']) === 'number') {
                lat = data['latitude'];
                lng = data['longitude'];
                initMap(lat, lng);
                // newArray.push(data);
                renderTable(data);
            }
        }
    }
    request.send();
    // console.log(lat + " - " + lng);
}

// function reqListener () {
//   console.log(this.responseText);
// }

function renderTable(data) {

    let numCols = 5;

    ip = data['ip'];
    let url2 = 'https://www.virustotal.com/vtapi/v2/ip-address/report?apikey=a084c74b1c2c65e9cc351b26ad193ff2b83d2a3359850e298af64442a22b7627&ip=' + ip;
    let request2 = new XMLHttpRequest();
    request2.responseType = 'json';
    request2.open('GET', url2);
    request2.onload = function() {
        let data = request2.response;
        // console.log(data);
        console.log("%%%%%");
    }
    request2.send();

    party = "virusTotal&Talos";
    country = data['country_name'];
    region = data['region_name'];
    countryCode = data['country_code'];
    flagURL = data['location']['country_flag'];
    let tableData = [ip, party, country, region, countryCode];

    if (!region) {
        tableData[3] = 'N/A';
    }

    let tr = document.createElement("TR");
    document.getElementById("ipTableBody").appendChild(tr); 

    for (let i = 0; i < numCols; ++i) {
            let col = document.createTextNode(tableData[i]);
            let td = document.createElement("TD");
        if (i === 4) {
            let elem = document.createElement("img");
            elem.setAttribute("src", flagURL);
            elem.setAttribute("height", "13");
            elem.setAttribute("width", "18");
            tr.appendChild(td);
            td.appendChild(elem);
        } else {
            tr.appendChild(td);
            td.appendChild(col);
        }
    }

    return;
}

function reqListener () {
    console.log(this.responseText);
}

function transferFailed(evt) {
    console.log("An error occurred while transferring the file.");
}