// Select your input type file and store it in a variable
const input = document.getElementById('fileinput');

// This will upload the file after having read it
const upload = (file) => {
  fetch('http://localhost/3000/uploads', {
    // Your POST endpoint
    method: 'POST',
    headers: {
      // Content-Type may need to be completely **omitted**
      // or you may need something
      'Content-Type': 'You will perhaps need to define a content-type here',
    },
    body: file, // This is your file object
  })
    .then(
      (response) => response.json() // if the response is a JSON object
    )
    .then(
      (success) => console.log(success) // Handle the success response object
    )
    .catch(
      (error) => console.log(error) // Handle the error response object
    );
};

// Event handler executed when a file is selected
const onSelectFile = () => upload(input.files[0]);

// ##########################################################

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    var contents = e.target.result;
    displayContents(contents);
  };
  reader.readAsText(file);
}

function displayContents(contents) {
  var element = document.getElementById('file-content');
  element.textContent = contents;
}

document
  .getElementById('file-input')
  .addEventListener('change', readSingleFile, false);
{
  /* <input type="file" id="file-input" />
<h3>Contents of the file:</h3>
<pre id="file-content"></pre> */
}
//https://stackoverflow.com/questions/3582671/how-to-open-a-local-disk-file-with-javascript

// ###############################################
//CONVERT UTF-16 TO UTF-8
//Braindead decoder that assumes fully valid input
function decodeUTF16LE(utf16Str) {
  var cp = [];
  for (var i = 0; i < utf16Str.length; i += 2) {
    cp.push(utf16Str.charCodeAt(i) | (utf16Str.charCodeAt(i + 1) << 8));
  }
  return String.fromCharCode.apply(String, cp);
}

// ###############################################
//FIRST WORKING TEST

async function getData(file) {
  const fullTable = data.split(/\n/g).slice(1);

  // Remove blank lines
  var table = fullTable.filter((value) => Object.keys(value).length !== 0);

  const list = [];
  let date = '';
  let participants = 0;
  let start = '99:99:99';
  let end = '00:00:00';

  table.forEach((row) => {
    const columns = row.split(/\t/);
    const name = columns[0];
    // const activity = columns[1];
    const dateStr = columns[2].split(/\s/g);
    date = dateStr[0];
    const hour = dateStr[1];

    let startTime = start.split(':');
    let endTime = end.split(':');
    let a = hour.split(':'); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    let thisSeconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

    let startSeconds =
      +startTime[0] * 60 * 60 + +startTime[1] * 60 + +startTime[2];
    let endSeconds = +endTime[0] * 60 * 60 + +endTime[1] * 60 + +endTime[2];

    if (thisSeconds < startSeconds) {
      start = hour;
    }
    if (thisSeconds > endSeconds) {
      end = hour;
    }

    const hasName = list.some((element) => element === name);

    if (!hasName) {
      list.push(name);
      participants++;
    }
  });

  list.sort();

  const tableElement = document.createElement('table');

  list.forEach((name) => {
    const trElement = document.createElement('tr');
    // Name
    const tdName = document.createElement('td');
    const nameText = document.createTextNode(name);
    tdName.appendChild(nameText);
    trElement.appendChild(tdName);

    tableElement.appendChild(trElement);
  });

  const body = document.querySelector('body');
  body.appendChild(tableElement);

  const h2 = document.querySelector('h2');
  const h2Text = document.createTextNode(
    `Data da reunião: ${date} - Início ${start} Fim ${end}`
  );
  h2.appendChild(h2Text);

  const h3Element = document.createElement('h3');
  const h3Text = document.createTextNode(
    `Total de participantes: ${participants}`
  );
  h3Element.appendChild(h3Text);
  body.appendChild(h3Element);
}
