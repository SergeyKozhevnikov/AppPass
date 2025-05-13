"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passController_1 = require("../controllers/passController");
const router = express_1.default.Router();
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
router.post("/", asyncHandler(passController_1.createPass));
router.get("/", asyncHandler(passController_1.getAllPasses));
router.get("/:id", asyncHandler(passController_1.getPassById));
router.put("/:id", asyncHandler(passController_1.updatePass));
router.delete("/:id", asyncHandler(passController_1.deletePass));
exports.default = router;
