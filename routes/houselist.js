var azure = require('azure-storage');

module.exports = HouseList;

function HouseList(house) {
  this.house = house;
}

HouseList.prototype = {
  showHouses: function(req, res) {
    self = this;
    var query = new azure.TableQuery()
      .select();
    self.house.find(query, function itemsFound(error, items) {
      res.send(JSON.stringify(items));
    });
  },

  addHouse: function(req,res) {
    var self = this;
    var item = req.body.item;
    self.house.addItem(item, function (error, RowKey) {
      if(error) {
        throw error;
      }
      res.status(201);
      res.location(RowKey);
      res.send();
    });
  },

  updateHouse: function(req,res) {
    var self = this;
    var item = req.body.item;
    self.house.updateItem(item, req.params.id, function (error) {
      if(error) {
        throw error;
      }
      res.status(200);
      res.send();
    });
  },

  deleteHouse: function(req,res) {
    var self = this;
    self.house.deleteItem(req.params.id, function (error) {
      if(error) {
        res.status(error.statusCode);
      } else {
        res.status(200);
      }
      res.send();
    });
  }

}