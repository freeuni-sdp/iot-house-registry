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
      if(error) {
        res.status(500);
        res.send(error);
      }
      res.json(items);
    });
  },

  showHouse: function(req, res) {
    self = this;
    self.house.retrieve(req.params.id, function itemsFound(error, items) {
      if(error) {
        res.status(500);
        res.send(error);
      }
      res.json(items);
    });
  },

  addHouse: function(req,res) {
    var self = this;
    var item = req.body;
    self.house.addItem(item, function (error, RowKey) {
      if(error) {
        res.status(500);
        res.send(error);
      }
      res.status(201);
      res.location("houses/"+RowKey);
      res.send();
    });
  },

  updateHouse: function(req,res) {
    var self = this;
    var item = req.body.item;
    self.house.updateItem(item, req.params.id, function (error) {
      if(error) {
        res.status(error.statusCode);
        res.send(error);
      }
      res.send();
    });
  },

  deleteHouse: function(req,res) {
    var self = this;
    self.house.deleteItem(req.params.id, function (error, result) {
      res.status(result.statusCode);
      if(error) {
        res.send(error);
      } else {
        res.send();
      }
    });
  }

}