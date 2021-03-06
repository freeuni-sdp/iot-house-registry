require ('newrelic');
var bodyParser = require('body-parser'),
	express = require('express'),
	router  = express.Router(),
	app = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


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

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});