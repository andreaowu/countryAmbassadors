// returns a set of URLs for existing USA Ambassadors
function getExistingAmbs() {
  return new Set(currAmbsSheet.getDataRange().getValues().filter(row => !!parseInt(row[0])).map(row => String(row[3])));
}

// returns alphabetically by state, city, ambassador name
function comparator(a, b) {
  const aLocation = a[1];
  const bLocation = b[1];
  const aCommaInd = aLocation.indexOf(',');
  const bCommaInd = bLocation.indexOf(',');
  const aState = aLocation.substring(aCommaInd + 2, aCommaInd + 4);
  const bState = bLocation.substring(bCommaInd + 2, bCommaInd + 4);
  const aCity = aLocation.substring(0, aCommaInd);
  const bCity = bLocation.substring(0, bCommaInd);
  if (aState == bState) {
    if (aCity == bCity) {
      return a[0] < b[0] ? -1 : 1;
    }
    return aCity < bCity ? -1 : 1;
  }
  return aState < bState ? -1 : 1;
}

// locations: 2D list of ['amb name', 'city, state', 'url']
function sortByStateCity(locations) {
  locations.sort((a, b) => comparator(a, b));
  return locations;
}

// adds new row to country spreadsheet
function addRow(index, ambNum, ambs) {
  currAmbsSheet.insertRowBefore(index);
  currAmbsSheet.getRange(index, 1).setValue(ambNum).setBackground(index % 2 == 0 ? bgColorSecondary : bgColorPrimary);
  for (let i = 1; i < itemsPerRow; i++) {
    currAmbsSheet.getRange(index, i + 1).setValue(ambs[i - 1]).setBackground(index % 2 == 0 ? bgColorSecondary : bgColorPrimary);
  }
}

// updates row for amb # and background color
function updateRow(index, ambNum) {
  currAmbsSheet.getRange(index, 1).setValue(ambNum).setBackground(index % 2 == 0 ? bgColorSecondary : bgColorPrimary);
  for (let i = 0; i < itemsPerRow; i++) {
    currAmbsSheet.getRange(index, i + 1).setBackground(index % 2 == 0 ? bgColorSecondary : bgColorPrimary);
  }
}

// sorts given ambs list from startRow into existing ambs list, returns row after lastly added row
function mergeSort(startRow, ambNum, ambs) {
  let index = startRow;
  let values = currAmbsSheet.getRange(index, 1, 1, itemsPerRow).getValues();

  while (values[0][0] != '') {
    if (ambs.length > 0 && comparator(values[0].slice(1, itemsPerRow), ambs[0]) > 0) {
      addRow(index, ambNum + 1, ambs[0]);
      ambs.splice(0, 1);
      index--;
    }

    // sets the # and row color per amb just in case previous ones got changed
    updateRow(index, ambNum);

    index++;
    ambNum++;
    values = currAmbsSheet.getRange(index, 1, 1, itemsPerRow).getValues();
  }

  // add to end
  while (ambs.length > 0) {
    addRow(index, ambNum, ambs[0]);
    ambs.splice(0, 1);
    index++;
    ambNum++;
  }
  return [index + 2, ambNum]; // should make a class for this
}

function getNewAmbassadors() {
  const ambTypeToAmbMapping = {country: [], city: [], nomadic: []};
  const currAmbs = getExistingAmbs();

  // row: [country, ambassador type (country, nomadic), name, city, URL]
  allAmbsSheet.getDataRange().getValues().filter(row => row[itemToIndexMapping['country']] == 'United States' && !currAmbs.has(row[itemToIndexMapping['url']])).forEach(row => {
    newAmbsSheet.appendRow(row);

  // add ['name', 'city', 'url'] to ambTypeToAmbMapping according to amb type
  ambTypeToAmbMapping[row[itemToIndexMapping['type']].toLowerCase().includes(nomadic) ? nomadic : (row[itemToIndexMapping['type']].toLowerCase().includes(country) ? country : city)].push([row[itemToIndexMapping['name']], row[itemToIndexMapping['city']], row[itemToIndexMapping['url']]]);
  });

  // sort all amb type lists
  Object.keys(ambTypeToAmbMapping).forEach(key => {
    sortByStateCity(ambTypeToAmbMapping[key]);
  });

  // merge sorted lists for nomadic, country, and city ambassadors, in that order
  let rowAmbNum = mergeSort(firstRow, 1, ambTypeToAmbMapping[nomadic]);
  rowAmbNum = mergeSort(rowAmbNum[0], rowAmbNum[1], ambTypeToAmbMapping[country]);
  mergeSort(rowAmbNum[0], rowAmbNum[1], ambTypeToAmbMapping[city]);
}
