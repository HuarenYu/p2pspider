'use strict';

module.exports = function(sequelize, DataTypes) {
  var Magnet = sequelize.define('Magnet', {
    infohash: DataTypes.STRING,
    name: DataTypes.STRING(512),
    files: DataTypes.TEXT,
    length: DataTypes.BIGINT,
    peer_counter: DataTypes.INTEGER
  }, {
    tableName: 't_magnets',
    indexs: [
        {
            unique: true,
            fields: ['infohash']
        }
    ]
  });
  return Magnet;
};
