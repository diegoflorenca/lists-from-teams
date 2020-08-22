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
