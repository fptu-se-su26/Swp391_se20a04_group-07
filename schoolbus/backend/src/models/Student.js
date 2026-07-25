const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  student_id:    { type: DataTypes.STRING(20),  allowNull: false, unique: true },
  full_name:     { type: DataTypes.STRING(100), allowNull: false },
  dob:           { type: DataTypes.DATEONLY,    allowNull: false },
  gender:        { type: DataTypes.STRING(10),  allowNull: false },
  class_id:      { type: DataTypes.UUID,        allowNull: false },
  student_email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  student_phone: DataTypes.STRING(20),
  parent_name:   { type: DataTypes.STRING(100), allowNull: false },
  parent_gmail:  { type: DataTypes.STRING(150), allowNull: false, unique: true },
  home_address:  DataTypes.STRING(300),
  home_lat:      DataTypes.DECIMAL(10, 8),
  home_lng:      DataTypes.DECIMAL(11, 8),
  bus_route_id:  DataTypes.UUID,
  bus_stop_id:   DataTypes.UUID,
  status:        { type: DataTypes.STRING(20), defaultValue: 'active' },
}, { tableName: 'Students', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Student;
