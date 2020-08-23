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
  //console.log(startedTime.format(format), endedTime.format(format));

  // Sort names array in alphabetic order
  names.sort();

  showResultHandler(names, meetingDate, startedTime, endedTime);
};

const showResultHandler = (names, meetingDate, started, ended) => {
  const dateEl = document.querySelector('.date');
  const startEl = document.querySelector('.start');
  const endEl = document.querySelector('.end');
  const ulEl = document.querySelector('ul');

  dateEl.innerHTML = meetingDate;
  startEl.innerHTML = started;
  endEl.innerHTML = ended;

  names.forEach((name) => {
    const li = document.createElement('li');
    const nameText = document.createTextNode(name);
    li.appendChild(nameText);
    ulEl.appendChild(li);
  });
};
