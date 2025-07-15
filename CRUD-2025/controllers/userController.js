const express = require("express");

const router = express.Router();

const uuid = require("uuid");

let users = require("../models/users");


router.get("/", (req, res) => {
  res.json(users);
});


router.get("/:id", (req, res) => {
  const found = users.some(user => user.id === parseInt(req.params.id));
  if (found) {
      res.json(users.filter(user => user.id === parseInt(req.params.id)));
  } else {
    res.sendStatus(404);
    res.json({message:`No record found by id ${req.params.id}`})
  }
});

router.post("/", (req, res) => {
  const newUser = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email
};

if (!newUser.name || !newUser.email) {
    return res.json({statusCode:400,message:"fields name and email can't be empty"});
}
  users.push(newUser);
  res.json(users);
});




router.put("/:id", (req, res) => {
  const found = users.some(user => user.id === parseInt(req.params.id));
  if (found) {
    const updateUser = req.body;
    users.forEach(user => {
      if (user.id === parseInt(req.params.id)) {

        user.name = updateUser.name ? updateUser.name : user.name;

        user.email = updateUser.email ? updateUser.email : user.email;

        res.json({status:200, message: "User updated", user });

      }

    });

  } else {

    res.json({statusCode:400,message:"Invalid request"});

  }

});



router.delete("/:id", (req, res) => {
  const found = users.some(user => user.id === parseInt(req.params.id))
  if (found) {
    users = users.filter(user => user.id !== parseInt(req.params.id))
    res.json({
      status:200,
      message: "User deleted",
      users

    });

  } else {

    res.json({statusCode:400,message:"invalid request or record to be removed doesn't exist"});

  }

});



module.exports = router;
