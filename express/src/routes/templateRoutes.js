const express = require("express");
const router = express.Router();
const api = require("../middleware/auth");
const templateController = require("../controllers/template/templateController");

router.get("/templates/public/:id", templateController.getOne);
router.get("/templates/active", templateController.getActive);
router.get("/templates/:id", api, templateController.getOne);
router.get("/templates", api, templateController.getAll);
router.post("/templates", api, templateController.create);
router.put("/templates/:id", api, templateController.update);
router.delete("/templates/:id", api, templateController.remove);
router.patch("/templates/:id/activate", api, templateController.activate);

module.exports = router;
