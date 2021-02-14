const today = new Date();
const spreadsheetId = "1IVogjtMPgXc4iqUi-Nsm_6Wj4U1WoSX96llqzpUY0JU"; // https://docs.google.com/spreadsheets/d/1IVogjtMPgXc4iqUi-Nsm_6Wj4U1WoSX96llqzpUY0JU/edit#gid=498092680
const allAmbsSheet = SpreadsheetApp.openById(spreadsheetId).getSheets()[0];
const usaAmbs = SpreadsheetApp.getActiveSpreadsheet().getSheets();
const currAmbsSheet = usaAmbs[0];
const newAmbsSheet = usaAmbs[1];
const firstRow = 3;
const itemsPerRow = 4;
const bgColorPrimary = "white";
const bgColorSecondary = "#f9f0e6";

const nomadic = "nomadic";
const country = "country";
const city = "city";

// should use a class for this instead of an array with indices
const itemToIndexMapping = {
  'country': 0,
  'type': 1, 
  'name': 2, 
  'city': 3, 
  'url': 4
}
