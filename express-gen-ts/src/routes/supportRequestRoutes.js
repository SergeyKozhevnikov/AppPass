"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supportRequestController_1 = require("@src/controllers/supportRequestController");
function ensureAuth(req, res, next) {
  if (req.user) {
    next();
  }
  else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
const router = express_1.default.Router();
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
router.post('/', ensureAuth, asyncHandler(supportRequestController_1.createSupportRequest));
exports.default = router;