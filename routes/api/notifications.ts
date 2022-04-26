import express from "express";
import { newNotification } from "../../controllers/notificationsController";

const router = express.Router();

router.route('/')
  .post(newNotification)

export = router;