const express = require('express')
const projects = require('../helpers/projectModel')
const actions = require('../helpers/actionModel')

const router = express.Router()

router.get('/', (req, res) => {
  projects
    .get()
    .then(projectList => {
      console.log(projectList)
      res.status(200).json(projectList)
    })
    .catch(err => {
      res.status(500).json({
        messgae: 'Request error ' + err.message
      });
    });
});

router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

router.post('/', validateProject, (req, res) => {
  projects
    .insert(req.body)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(err => {
      res.status(500).json({
        message: 'Request error ' + err.message
      });
    });
});

router.delete('/:id', validateProjectId, (req, res) => {
  projects
  .remove(req.params.id)
  .then(project => {
    res.status(200).json(project);
  })
  .catch(err => {
    res.status(500).json({
      message: 'Request error ' + err.message
    });
  });
});

router.put('/:id', [validateProjectId, validateProject], (req, res) => {
  projects
  .update(req.params.id, req.body)
  .then(project => {
    res.status(200).json(project);
  })
  .catch(err => {
    res.status(500).json({
      message: 'Request error ' + err.message
    });
  });
});

router.post('/:id/actions', [validateProjectId, validateAction], (req, res) => {
  const actionInfo = { ...req.body, project_id: req.params.id };
  actions
    .insert(actionInfo)
    .then(action => {
      res.status(201).json(action);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'Error: could not add post. ' + err.message });
    });
});


// VALIDATION


function validateProjectId(req, res, next) {
  projects
    .get(req.params.id)
    .then(project => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(404).json({ message: 'Project does not exist.' });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Request error ' + err.message
      });
    });
}

function validateProject(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: 'Missing project data' });
  } else if (!req.body.name || !req.body.description) {
    res.status(400).json({ message: 'Name and description are required' });
  } else {
    next();
  }
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