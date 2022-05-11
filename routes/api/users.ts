import express from "express";
import * as usersController from "../../controllers/usersController";

const router = express.Router();

router.route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .put(usersController.updateUser)
  .delete(usersController.deleteUser);

  router.route('/get_token')
    .post(usersController.getUserToken)

    router.route('/:id')
      .get(usersController.getUser)

export = router;