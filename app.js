var bodyParser = require('body-parser'),
	express = require('express'),
	router  = express.Router(),
	app = express();

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

app.use('/houses', router);

router.get('/', houseList.showHouses.bind(houseList));
router.get('/:id', houseList.showHouse.bind(houseList));
router.post('/', houseList.addHouse.bind(houseList));
router.put('/:id', houseList.updateHouse.bind(houseList));
router.delete('/:id', houseList.deleteHouse.bind(houseList));

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});