const express = require('express');
const bodyParser = require('body-parser');
const data = require('./data.json');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(bodyParser.json());

app.post('/check-group', (req, res) => {
  const inputs = req.body;

  const results = [];

  // Process each input
  for (const input of inputs) {
    const { imgUrl, selectedStore } = input;

    // Extract image name from the URL
    const imageName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.lastIndexOf('.'));

    // Modify store name based on the selected store
    let storeName;
    switch (selectedStore) {
      case 'wallmart':
        storeName = 'wallmart';
        break;
      case 'realcanadiansuperstore':
        storeName = 'realcanadiansuperstore';
        break;
      case 'loblaws':
        storeName = 'loblaws';
        break;
      case 'saveonfoods':
        storeName = 'saveonfoods';
        break;
      case 'TNT':
        storeName = 'TNT';
        break;
      case 'nofrills':
        storeName = 'nofrills';
        break;
      default:
        storeName = '';
    }

    // Create the modified string
    const modifiedString = `${imageName}_${storeName}`;

    // Find groups that contain the modified string
    const groupsWithModifiedString = [];
    for (const group in data) {
      if (data[group].includes(modifiedString)) {
        groupsWithModifiedString.push(group);
      }
    }

    results.push({
      imgUrl: imgUrl,
      selectedStore: selectedStore,
      groupsWithModifiedString: groupsWithModifiedString
    });
  }

  // Check if inputs belong to the same group
  const sameGroup = results.every(result => result.groupsWithModifiedString.length > 0);
  const groupsWithInput1 = results[0].groupsWithModifiedString;
  const groupsWithInput2 = results[1].groupsWithModifiedString;

  // Prepare the response
  const response = {
    sameGroup: sameGroup,
    groupsWithInput1: groupsWithInput1,
    groupsWithInput2: groupsWithInput2
  };

  // Send the response
  res.json(response);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
