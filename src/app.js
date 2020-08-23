// Store all data to be converted in a excel file
const tableStructure = [];

const changeFileHandler = (e) => {
  // Take the file from event.target
  const file = e.target.files[0];
  // If file is empty alert a message
  if (!file) {
    return alert('File is missing!');
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = e.target.result;
    dataHandler(data);
  };
  reader.readAsText(file);
};

const dataHandler = (rawData) => {
  // Separate each row by the break line \n and remove the first row
  let data = rawData.split(/\n/g).slice(1);

  // Remove empty lines
  const table = data.filter((line) => line.length != 0);

  // Empty array to store all names
  const names = [];
  let meetingDate = '';

  const format = 'hh:mm:ss';
  let startedTime = moment('23:59:59', format);
  let endedTime = moment('00:00:00', format);

  // Split table columns
  table.forEach((row) => {
    const columns = row.split(/\t/);

    // Check if this name already exists into names array
    const hasName = names.some((element) => element === columns[0]);

    // If name doesn't exist insert push it into names array
    if (!hasName) {
      names.push(columns[0]);
    }

    // Split the last column into date and time
    const dateArray = columns[2].split(/\s/);
    // Store meeting date
    meetingDate = dateArray[0];

    // Check the start and end time of the meeting
    let thisTime = moment(dateArray[1], format);
    if (thisTime.isBefore(startedTime)) {
      startedTime = thisTime;
    } else if (thisTime.isAfter(endedTime)) {
      endedTime = thisTime;
    }
  });

  // Sort names array in alphabetic order
  names.sort();

  showResultHandler(names, meetingDate, startedTime, endedTime);
};

const showResultHandler = (names, meetingDate, started, ended) => {
  const dateEl = document.querySelector('.date');
  const startEl = document.querySelector('.start');
  const endEl = document.querySelector('.end');
  const ulEl = document.querySelector('ul');
  const participantsEl = document.querySelector('.participants');

  // Show the download button
  downloadButton.style.display = 'block';

  const start = `Início: ${started.format('HH:mm')}`;
  const end = `Término: ${ended.format('HH:mm')}`;

  dateEl.innerHTML = `Data da Reunião: ${meetingDate}`;
  startEl.innerHTML = start;
  endEl.innerHTML = end;

  // Save this information into tableStructure variable for the table header
  tableStructure.push(['Data da Reunião:', meetingDate]);
  tableStructure.push([start, end]);
  tableStructure.push(['Presentes:']);

  names.forEach((name) => {
    const formatedName = nameFormatHandler(name);
    const li = document.createElement('li');
    const nameText = document.createTextNode(formatedName);
    li.appendChild(nameText);
    ulEl.appendChild(li);
    // Insert this name into tableStructure
    tableStructure.push([formatedName]);
  });

  // Print total of participants
  participantsEl.innerHTML = `Total de Participantes: ${names.length}`;

  // Total of names in the names array is equal to the total of participants of the meeting
  tableStructure.push(['Participantes', names.length]);
};

const createSheetHandler = () => {
  // Credits: TK from https://redstapler.co/sheetjs-tutorial-create-xlsx/
  let wb = XLSX.utils.book_new();
  // Save the current date
  currentDate = moment(new Date()).format('YYYY,MM,DD');
  wb.Props = {
    Title: 'Lista de Presença - Reunião Teams',
    subject: 'Gerada Automaticamente',
    Author: 'Diego Felipe Florença',
    CreateDate: currentDate,
  };
  wb.SheetNames.push('Lista de Presença');
  // Build the table structure
  let ws_data = tableStructure;
  let ws = XLSX.utils.aoa_to_sheet(ws_data);
  wb.Sheets['Lista de Presença'] = ws;

  // Exporting
  let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  // File download
  saveToFileHandler('chamada-', wbout);
};

// Convert the binary data into octet
const convertToOctet = (s) => {
  // convert s to arrayBuffer
  let buf = new ArrayBuffer(s.length);
  // Create uint8array as viewer
  let view = new Uint8Array(buf);
  for (var i = 0; i < s.length; i++) {
    // Convert to octet
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
};

const saveToFileHandler = (name, wbout) => {
  const rnd = Math.floor(Math.random(100) * 100);
  const hash = moment(new Date()).format('MMDD') + '-' + rnd + '.xlsx';
  const fileName = name + hash;
  saveAs(
    new Blob([convertToOctet(wbout)], { type: 'application/octet-stream' }),
    fileName
  );
};

// Change the names case (First Letter)
const nameFormatHandler = (nome) => {
  // credits: Leo Caracciolo from https://pt.stackoverflow.com/questions/334820/javascript-valida%C3%A7%C3%A3o-de-nome-e-sobrenome-com-letras-mai%C3%BAsculas-no-in%C3%ADcio
  nome = nome.toLowerCase().replace(/(?:^|\s)\S/g, function (capitalize) {
    return capitalize.toUpperCase();
  });

  var PreposM = ['Da', 'De', 'Do', 'Das', 'Dos', 'A', 'E'];
  var prepos = ['da', 'de', 'do', 'das', 'dos', 'a', 'e'];

  for (var i = PreposM.length - 1; i >= 0; i--) {
    nome = nome.replace(
      RegExp(
        '\\b' + PreposM[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b',
        'g'
      ),
      prepos[i]
    );
  }

  return nome;
};
