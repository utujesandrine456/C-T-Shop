const express = require("express")
let UserModel= require("../models/user.model")

const router = express.Router();

router.post("/", async (request, response) => {
  const user = new UserModel(request.body);

  try {
    await user.save();
    response.status(201).send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});
router.get("/", async (request, response) => {
    try {
     const users = await UserModel.find({});
      response.status(200).send(users);
    } catch (error) {
      response.status(500).send({ error });
    }
  });
  router.get("/:id", async (request, response) => {
    try {
      const user = await UserModel.findOne({ _id: request.params.id });
      response.send(user);
    } catch (error) {
      response.status(500).send({ error });
    }
  });
  router.put("/:id", async (request, response) => {
    try {
      const user = await UserModel.findByIdAndUpdate(
        request.params.id,
        request.body
      );
      await user.save();
      response.send(user);
    } catch (error) {
      response.status(500).send({ error });
    }
  });
  router.delete("/:id", async (request, response) => {
    try {
      const user = await UserModel.findByIdAndDelete(request.params.id);
      if (!user) {
        return response.status(404).send("Item wasn't found");
      }
      response.status(200).send({message:"Item removed successfully"});
    } catch (error) {
      response.status(500).send({ error });
    }
  });

module.exports= router;
