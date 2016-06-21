var bodyParser = require('body-parser')
var express = require('express');
var app = express();

app.use(bodyParser.json())


var azure = require('azure-storage');
var nconf = require('nconf');
nconf.env()
     .file({ file: 'config.json', search: true });
var tableName = nconf.get("TABLE_NAME");
var partitionKey = nconf.get("PARTITION_KEY");
var accountName = nconf.get("STORAGE_NAME");
var accountKey = nconf.get("STORAGE_KEY");

var HouseList = require('./routes/houselist');
var House = require('./models/house');
var house = new House(azure.createTableService(accountName, accountKey), tableName, partitionKey);
var houseList = new HouseList(house);

app.get('/', houseList.showHouses.bind(houseList));
app.post('/', houseList.addHouse.bind(houseList));
app.put('/:id', houseList.updateHouse.bind(houseList));
app.delete('/:id', houseList.deleteHouse.bind(houseList));

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});