'./routes/employeesRoute.js';

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
const passport = require('passport');
const db = require('../config/dbConfig');
const isAuthenticated = require('../midlewares/auth-middleware');

router.get('/', async (req, res) => {
  try {
    const employees = await db.any('SELECT * FROM employees');
    res.status(200).send(employees);
  } catch (error) {
    console.error('Error fetching employees:', error.message, error.stack);
    res.status(500).send('Error fetching employees');
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await db.one('SELECT * FROM employees WHERE id = $1', [
      id,
    ]);
    res.status(200).send(employee);
  } catch (error) {
    console.error('Error fetching employee:', error.message, error.stack);
    res.status(500).send('Error fetching employee');
  }
});

// Create a new employee record
router.post('/', isAuthenticated, async (req, res) => {
  const { employee, address, user } = req.body;

  // Add created_by field to each record
  employee.created_by = req.user.name;
  address.created_by = req.user.name;
  user.created_by = req.user.name;

  // RETURN the id of the new employee record
  employee.returning = 'RETURNING id';
  address.returning = 'RETURNING id';

  try {
    const employeeId = await db.employees.insertReturning(employee);

    // Insert address record
    if (address) {
      const addresses = await db.addresses.insertReturning(address);
      const junctionData = addresses.map((addr) => {
        return {
          employee_id: employeeId.id,
          address_id: addr.id,
          created_by: req.user.name,
        };
      });

      await db.employeeAddresses.insert(junctionData);
    }

    //  Add as user if employee is also a user
    if (user) {
      user.employee_id = employeeId.id;
      await db.users.registerUser(user);
    }

    res.status(201).send({ message: 'Employee created successfully' });
  } catch (error) {
    console.error('Error adding employee:', error.message, error.stack);
    res.status(500).send('Error adding employee: ' + error.message);
  }
});

router.put('/:id', async (req, res) => {
  const { name, email, phone, title } = req.body;
  const { id } = req.params;
  if (!name || !email || !phone || !title) {
    return res.status(400).send({ message: 'Missing required fields' });
  }
  try {
    await db.none(
      'UPDATE employees SET name = $1, email = $2, phone = $3, title = $4 WHERE id = $5',
      [name, email, phone, title, id]
    );
    console.log(`Employee updated with ID: ${id}`);
    res
      .status(200)
      .send({ message: 'Employee updated successfully', employeeId: id });
  } catch (error) {
    console.error('Error updating employee:', error.message, error.stack);
    res.status(500).send('Error updating employee');
  }
});

module.exports = router;
