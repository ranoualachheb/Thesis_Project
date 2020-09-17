const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  name: {
    type: String,
  },
  department : {
     type: String,
  },
  headOfDepartment: {
    type: String,
  },
  numberOfEmployees: {
    type: Number,
  },
  numberOfProjects: {
    type: Number,
  },
});

const Department = mongoose.model('department', departmentSchema);

module.exports = Department;
