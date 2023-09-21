'use strict';
const {
  Model, ValidationError
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    static associate(models) {
      Album.hasMany(models.Song,{
        foreignKey : 'albumId'
      })
    }
  }
  Album.init({
    name: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull: false,
        notEmpty : false,
        isString(value){
          if(typeof value !== 'string') throw new ValidationError('name harus string');
        },
        len : {
          args:  [5,18],
          msg: 'Panjang karakter minimal 5 dan maksimal 18',
        }
      }
    },
    year : {
      type :DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notNull : false,
        notEmpty:  false,
        isInt : {
          msg : 'year harus integer',
        },
        min : {
          args : [2013],
          msg: 'Tahun album minimal 2013',
        }
      },
    }
  }, {
    sequelize,
    modelName: 'Album',
  });
  return Album;
};