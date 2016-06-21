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

  this.insertOrUpdate = function (item, RowKey, callback) {
    // use entityGenerator to set types
    // NOTE: RowKey must be a string type, even though
    // it contains a GUID in this example.
    var itemDescriptor = {
      PartitionKey: entityGen.String(partitionKey),
      RowKey: entityGen.String(RowKey),
      name: entityGen.String(item.name),
      geoLocation: entityGen.String(item.geoLocation),
      sprinklerIp: entityGen.String(item.sprinklerIp),
      heatIp: entityGen.String(item.heatIp),
      ventIp: entityGen.String(item.ventIp),
    };
    storageClient.insertOrReplaceEntity(tableName, itemDescriptor, function (error, result, response) {
      callback(error, RowKey);
    });
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

  addItem: function(item, callback) {
    this.insertOrUpdate(item, uuid(), callback);
  },

  updateItem: function(item, id, callback) {
    this.insertOrUpdate(item, id, callback);
  },

  deleteItem: function(id, callback) {
    self = this;
    var itemDescriptor = {
      PartitionKey: entityGen.String(this.partitionKey),
      RowKey: entityGen.String(id),
    };
    self.storageClient.deleteEntity(this.tableName, itemDescriptor, function entitiesQueried(error, result) {
      if(error) {
        callback(error);
      } else {
        callback(null, result.entries);
      }
    });
  }

}