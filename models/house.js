var azure = require('azure-storage');
var uuid = require('node-uuid');
var entityGen = azure.TableUtilities.entityGenerator;

module.exports = House;

function House(storageClient, tableName, partitionKey) {
  this.storageClient = storageClient;
  this.tableName = tableName;
  this.partitionKey = partitionKey;
  this.storageClient.createTableIfNotExists(tableName, function(error, result, response){
    if(error){
      throw(error);
    }
  });

  this.createItem = function (item, RowKey) {
    // use entityGenerator to set types
    // NOTE: RowKey must be a string type, even though
    // it contains a GUID in this example.
    var itemDescriptor = {
      PartitionKey: entityGen.String(partitionKey),
      RowKey: entityGen.String(RowKey),
      name: entityGen.String(item.name),
      geo_location: entityGen.String(item.geo_location),
      sprinkler_ip: entityGen.String(item.sprinkler_ip),
      heat_ip: entityGen.String(item.heat_ip),
      vent_ip: entityGen.String(item.vent_ip),
    };

    return itemDescriptor;
  }
};


House.prototype = {
  find: function(query, callback) {
    self = this;
    self.storageClient.queryEntities(this.tableName, query, null, function entitiesQueried(error, result) {
      if(error) {
        callback(error);
      } else {
        callback(null, result.entries);
      }
    });
  },

  retrieve: function(id, callback) {
    self = this;
    self.storageClient.retrieveEntity(self.tableName, self.partitionKey, id, function entitiesQueried(error, result) {
      if(error) {
        callback(error);
      } else {
        callback(null, result);
      }
    });
  },

  addItem: function(item, callback) {
    var RowKey = uuid();
    var item = this.createItem(item, RowKey);
    this.storageClient.insertEntity(this.tableName, item, function (error, result, response) {
      callback(error, RowKey);
    });
  },

  updateItem: function(item, id, callback) {
    var item = this.createItem(item, id);
    this.storageClient.replaceEntity(this.tableName, item, function (error, result, response) {
      callback(error);
    });
  },

  deleteItem: function(id, callback) {
    self = this;
    var itemDescriptor = {
      PartitionKey: entityGen.String(this.partitionKey),
      RowKey: entityGen.String(id),
    };
    self.storageClient.deleteEntity(this.tableName, itemDescriptor, function entitiesQueried(error, result, response) {
      callback(error, result);
    });
  }

}