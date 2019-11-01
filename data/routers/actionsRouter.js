const express = require('express')
const actions = require('../helpers/actionModel')

const router = express.Router()

router.get('/', (req, res) => {
  actions
    .get()
    .then(action => {
      res.status(200).json(action);
    })
    .catch(err => {
      res.status(500).json({
        message: 'Request error ' + err.message
      });
    });
});

router.get('/:id', validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

router.delete('/:id', validateActionId, (req, res) => {
  actions
    .remove(req.params.id)
    .then(actionToRemove => {
      res.status(200).json(actionToRemove);
    })
    .catch(err => {
      res.status(500).json({
        message: 'Request error ' + err.message
      });
    });
});

router.put('/:id', [validateActionId, validateAction], (req, res) => {
  actions
    .update(req.params.id, req.body)
    .then(actionToUpdate => {
      res.status(200).json(actionToUpdate);
    })
    .catch(err => {
      res.status(500).json({
        message: 'your request could not be processed ' + err.message
      });
    });
});

function validateActionId(req, res, next) {
  actions
    .get(req.params.id)
    .then(action => {
      if (!action) {
        res.status(404).json({ message: 'Action does not exist' });
      } else {
        req.action = action;
        next();
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Your request could not be processed: ' + err.message
      });
    });
}

function validateAction(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: 'Missing Action data' });
  } else if (!req.body.notes || !req.body.description) {
    res.status(400).json({ message: 'Notes and description are required' });
  } else {
    next();
  }
}

module.exports = router;