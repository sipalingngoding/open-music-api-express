'use strict';
const {
  Model, ValidationError
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    static associate(models) {
      Song.belongsTo(models.Album,{
        foreignKey : 'albumId',
        onDelete : 'CASCADE',
        onUpdate : 'CASCADE',
      })
    }
  }
  Song.init({
    title: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : false,
        notEmpty : false,
        isString(value){
          if(typeof value !== 'string') throw new ValidationError('title harus string');
        },
        len : {
          args : [5,15],
          msg : 'panjang title minimal 5 dan maksimal 15'
        }
      },
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
          msg: 'Tahun song minimal 2013',
        }
      },
    },
    genre: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : false,
        notEmpty : false,
        isIn:{
          args : [['klasik','tradisional','blues','pop','country','reggae']],
          msg : 'genre music tidak boleh diluar music tradisional, blues, pop, klasik, country, reggae'
        }
      },
    },
    performer: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : false,
        notEmpty : false,
        isString(value){
          if(typeof value !== 'string') throw new ValidationError('performer harus string');
        },
      },
    },
    duration : {
      type :DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notNull : false,
        notEmpty:  false,
        isInt : {
          msg : 'duration harus integer',
        },
      },
    },
    albumId : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Song',
  });
  return Song;
};