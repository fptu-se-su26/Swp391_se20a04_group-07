const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ParentStudent = sequelize.define('ParentStudent', {
  parent_id:    { type: DataTypes.UUID, primaryKey: true },
  student_id:   { type: DataTypes.UUID, primaryKey: true },
  relationship: DataTypes.STRING(50),
  is_primary:   { type: DataTypes.BOOLEAN, defaultValue: false },
  approved_at:  DataTypes.DATE,
}, { tableName: 'ParentStudent', timestamps: false });

module.exports = ParentStudent;
