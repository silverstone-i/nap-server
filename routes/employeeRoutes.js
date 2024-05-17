'./routes/employeesRoute.js'

/**
*
* Copyright © 2024-present, Ian Silverstone
*
* See the LICENSE file at the top-level directory of this distribution
* for licensing information.
*
* Removal or modification of this copyright notice is prohibited.
*/

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../db/dbConfig');

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const employees = await db.any('SELECT * FROM employees');
    res.status(200).send(employees);
  } catch (error) {
    console.error('Error fetching employees:', error.message, error.stack);
    res.status(500).send('Error fetching employees');
  }
});

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await db.one('SELECT * FROM employees WHERE id = $1', [id]);
    res.status(200).send(employee);
  } catch (error) {
    console.error('Error fetching employee:', error.message, error.stack);
    res.status(500).send('Error fetching employee');
  }
});

router.post('/', /*passport.authenticate('jwt', { session: false }),*/ async (req, res) => {
  const dto = req.body;
  dto.created_by = req.user.email;
  try {
   await db.employees.insert( dto );
   res
     .status(201)
     .send({ message: 'Employee added successfully - employee email: ' + dto.email});
  } catch (error) {
    console.error('Error adding employee:', error.message, error.stack);
    res.status(500).send('Error adding employee: ' + error.message);
  }
}); 

router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { name, email, phone, title } = req.body;
  const { id } = req.params;
  if (!name || !email || !phone || !title) {
    return res.status(400).send({ message: 'Missing required fields' });
  }
  try {
    await db.none('UPDATE employees SET name = $1, email = $2, phone = $3, title = $4 WHERE id = $5', [name, email, phone, title, id]);
    console.log(`Employee updated with ID: ${id}`);
    res.status(200).send({ message: 'Employee updated successfully', employeeId: id });
  } catch (error) {
    console.error('Error updating employee:', error.message, error.stack);
    res.status(500).send('Error updating employee');
  }
});

module.exports = router;

