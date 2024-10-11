/*

Rich Web Applications
Objective: Lab 4
Author: Roxana Pohodnicaru / C21446942

*/


// function that clears previous content displayed
function clearContent() {

    // selects div content
    const contentDiv = document.getElementById('content');

    // sets div to empty string
    contentDiv.innerHTML = '';
}


// function to display data in table
function displayDataTable(students) {

    const contentDiv = document.getElementById('content');

    // table element
    const table = document.createElement('table');

    // table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['Name', 'Surname', 'ID'];

    // for each header
    headers.forEach(headerText => {

        // create new table header
        const th = document.createElement('th');

        // set text content of header cell to current header text
        th.textContent = headerText;

        // append header cell to current header row
        headerRow.appendChild(th);
    });

    // add header row to table
    thead.appendChild(headerRow);

    // add header to main table
    table.appendChild(thead);

    // table for body
    const tbody = document.createElement('tbody');

    students.forEach(student => {

        // create new row for current student
        const row = document.createElement('tr');

        // create cell for student name
        const nameCell = document.createElement('td');

        // assign name to cell
        nameCell.textContent = student.name;

        // append cell to current row
        row.appendChild(nameCell);

        // create cell for student surname
        const surnameCell = document.createElement('td');

        // assign surname to cell
        surnameCell.textContent = student.surname;

        // append cell to current row
        row.appendChild(surnameCell);

        // create cell for student id
        const idCell = document.createElement('td');

        // assign student id to cell
        idCell.textContent = student.id;

        // append cell to current row
        row.appendChild(idCell);

        // append current row to content div
        tbody.appendChild(row);
    });

    // append body to main table
    table.appendChild(tbody);

    // append table to content div
    contentDiv.appendChild(table);
}

// function to process student data
// split full names into first name + surname
function processStudentData(students) {

    return students.map(student => {

        // split based on space
        const nameParts = student.name.split(' ');

        // firstname
        const name = nameParts[0];

        // surname (handles more than 1 worded surname)
        const surname = nameParts.slice(1).join(' ');

        // student object
        return {
            name: name,
            surname: surname,
            id: student.id
        };
    });
}


// Synchronous XMLHttpRequest Implementation
function loadDataSync() {

    // clear any previous content
    clearContent();

    try {
        
        const referenceRequest = new XMLHttpRequest();
    
        // fetch reference.json synchronously
        referenceRequest.open('GET', 'data/reference.json', false);

        // send request
        referenceRequest.send(null);

        // check for successful response status
        if (referenceRequest.status !== 200) {

            throw new Error(`Failed to load reference.json: ${referenceRequest.statusText}`);
        }

        // parse JSON response to get reference data
        const referenceData = JSON.parse(referenceRequest.responseText);

        // get location of first data file
        let currentDataLocation = referenceData.data_location;

        const allStudents = [];
        
        const data1Request = new XMLHttpRequest();

        // fetch data1.json
        // uses location from reference.json
        data1Request.open('GET', `data/${currentDataLocation}`, false);

        // send request
        data1Request.send(null);

        // check for successful response status
        if (data1Request.status !== 200) {

            throw new Error(`Failed to load ${currentDataLocation}: ${data1Request.statusText}`);
        }

        // parse data1.json response
        const data1 = JSON.parse(data1Request.responseText);

        // process data
        const processedData1 = processStudentData(data1.data);

        // add data to allStudents array
        allStudents.push(...processedData1);

        // get location of second data file
        currentDataLocation = data1.data_location;

        const data2Request = new XMLHttpRequest();

        // fetch data2.json
        data2Request.open('GET', `data/${currentDataLocation}`, false);

        // send request
        data2Request.send(null);

        // check for successful response status
        if (data2Request.status !== 200) {

            throw new Error(`Failed to load ${currentDataLocation}: ${data2Request.statusText}`);
        }

        // parse data2.json response
        const data2 = JSON.parse(data2Request.responseText);

        // process data
        const processedData2 = processStudentData(data2.data);

        // add data to allStudents array
        allStudents.push(...processedData2);

        const data3Request = new XMLHttpRequest();

        // fetch data3.json (known name)
        data3Request.open('GET', `data/data3.json`, false);

        // send request
        data3Request.send(null);

        // check for successful response status
        if (data3Request.status !== 200) {

            throw new Error(`Failed to load data3.json: ${data3Request.statusText}`);
        }

        // parse data3.json response
        const data3 = JSON.parse(data3Request.responseText);

        // process data
        const processedData3 = processStudentData(data3.data);

        // add data to allStudents array
        allStudents.push(...processedData3);

        // display combined data in table
        displayDataTable(allStudents);

    // handle any errors
    } catch (error) {

        // content div where error will be displayed
        const contentDiv = document.getElementById('content');
        
        // set content div to show error message
        contentDiv.innerHTML = `<p>Error: ${error.message}</p>`;

        // log to console
        console.error(error);
    }
}


// Asynchronous XMLHttpRequest with Callbacks Implementation
function loadDataAsyncCallbacks() {

    // clear any previous content
    clearContent();

    const allStudents = [];

    const referenceRequest = new XMLHttpRequest();

    // fetch reference.json asynchronously
    referenceRequest.open('GET', 'data/reference.json', true);

    // event handler for request
    referenceRequest.onreadystatechange = function() {

        // check if request is complete
        if (referenceRequest.readyState === 4) {

            // if request is successful
            if (referenceRequest.status === 200) {
                try {
                    
                    // parse json response from reference.json
                    const referenceData = JSON.parse(referenceRequest.responseText);

                    // get location of data1.json
                    const data1Location = referenceData.data_location;

                    // fetch data1.json
                    fetchDataAsyncCallbacks(`data/${data1Location}`, function(data1) {

                        // process data from data1.json
                        const processedData1 = processStudentData(data1.data);

                        // add data to allStudents array
                        allStudents.push(...processedData1);

                        // get location of data2.json
                        const data2Location = data1.data_location;

                        // fetch data2.json
                        fetchDataAsyncCallbacks(`data/${data2Location}`, function(data2) {

                            // process data from data2.json
                            const processedData2 = processStudentData(data2.data);

                            // add data to allStudents array
                            allStudents.push(...processedData2);

                            // fetch data3.json (known name)
                            fetchDataAsyncCallbacks('data/data3.json', function(data3) {

                                // process data from data3.json
                                const processedData3 = processStudentData(data3.data);

                                // add data to allStudents array
                                allStudents.push(...processedData3);

                                // display combined data in table
                                displayDataTable(allStudents);
                            });
                        });
                    });

                // handle json parsing
                } catch (error) {
                    displayError(error);
                }
            } else {
                // handle errors for failed request for reference.json
                displayError(new Error(`Failed to load reference.json: ${referenceRequest.statusText}`));
            }
        }
    };
    // send request
    referenceRequest.send(null);
}

// function to fetch data asynchronously with callbacks
function fetchDataAsyncCallbacks(url, callback) {

    // create new instance of request
    const xhr = new XMLHttpRequest();

    // asynchronous GET request
    xhr.open('GET', url, true);

    // event handler for request
    xhr.onreadystatechange = function() {

        // if request has completed
        if (xhr.readyState === 4) {

            // if request was successful
            if (xhr.status === 200) {

                try {
                    // parse json response
                    const data = JSON.parse(xhr.responseText);

                    // callback function with parsed data
                    callback(data);
                
                // error if parsing fails
                } catch (error) {
                    displayError(error);
                }

            // error if request failed
            } else {
                displayError(new Error(`Failed to load ${url}: ${xhr.statusText}`));
            }
        }
    };

    // send request
    xhr.send(null);
}

// function to display errors
function displayError(error) {

    // content div where error will be displayed
    const contentDiv = document.getElementById('content');

    // set content div to show error message
    contentDiv.innerHTML = `<p>Error: ${error.message}</p>`;

    // log to console
    console.error(error);
}


// Fetch API with Promises Implementation
function loadDataFetch() {

    // clear previous content
    clearContent();

    const allStudents = [];

    // fetch reference.json
    fetch('data/reference.json')
        
        // handle response from fetch call
        .then(response => {

            // check if response is not ok
            if (!response.ok) {

                // error message if fetch failed
                throw new Error(`Failed to load reference.json: ${response.statusText}`);
            }

            // parse response
            return response.json();
        })

        // process the refence data returned from previous promise
        .then(referenceData => {

            // extract location of first data file from reference
            const data1Location = referenceData.data_location;

            // fetch first data file using extracted location
            return fetch(`data/${data1Location}`);
        })

        // handle response for data1.json
        .then(response => {

            // check if response is not ok
            if (!response.ok) {

                // error message if fetch failed
                throw new Error(`Failed to load data1.json: ${response.statusText}`);
            }

            // parse response
            return response.json();
        })

        // process data from data1.json
        .then(data1 => {

            // process student data from data1.json
            const processedData1 = processStudentData(data1.data);

            // add data to allStudents array
            allStudents.push(...processedData1);

            // extract location of data2.json from data1.json
            const data2Location = data1.data_location;

            // fetch data2.json using extracted location
            return fetch(`data/${data2Location}`);
        })

        // handle response for data2.json
        .then(response => {

            // check if response is not ok
            if (!response.ok) {

                // error message if fetch failed
                throw new Error(`Failed to load data2.json: ${response.statusText}`);
            }

            // parse response
            return response.json();
        })

        // process data from data2.json
        .then(data2 => {

            // process student data from data2.json
            const processedData2 = processStudentData(data2.data);

            // add data to allStudents array
            allStudents.push(...processedData2);

            // fetch data3.json (known name)
            return fetch('data/data3.json');
        })

        // handle response for data3.json
        .then(response => {

            // check if response is not okay
            if (!response.ok) {

                // error message if fetch failed
                throw new Error(`Failed to load data3.json: ${response.statusText}`);
            }

            // parse response
            return response.json();
        })

        // process data from data3.json
        .then(data3 => {

            // process student data from data3.json
            const processedData3 = processStudentData(data3.data);

            // add data to allStudents array
            allStudents.push(...processedData3);

            // display combined data in table
            displayDataTable(allStudents);
        })

        // handle any errors with fetching
        .catch(error => {
            
            displayError(error);
        });
}


// Event Listeners
// Synchronous XMLHttpRequest Button
document.getElementById('syncButton').addEventListener('click', loadDataSync);

// Asynchronous XMLHttpRequest with Callbacks Button
document.getElementById('asyncCallbackButton').addEventListener('click', loadDataAsyncCallbacks);

// Fetch API with Promises Button
document.getElementById('fetchButton').addEventListener('click', loadDataFetch);