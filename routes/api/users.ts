import express from "express";
import * as usersController from "../../controllers/usersController";

const router = express.Router();

router.route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .put(usersController.updateUser)

  router.route('/:id')
    .get(usersController.getUser)
    .delete(usersController.deleteUser);

export = router;