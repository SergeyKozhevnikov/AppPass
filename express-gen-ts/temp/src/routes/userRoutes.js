"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const router = express_1.default.Router();
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
router.get('/', asyncHandler(usersController_1.getUsers));
router.get('/:id', asyncHandler(usersController_1.getUser));
router.post('/', asyncHandler(usersController_1.createUser));
router.patch('/:id', asyncHandler(usersController_1.updateUser));
router.delete('/:id', asyncHandler(usersController_1.deleteUser));
exports.default = router;
