import express from 'express';
import {
  createPass,
  getAllPasses,
  getPassById,
  updatePass,
  deletePass } from '../controllers/passController';
import type { Request, Response, NextFunction } from "express"

const router = express.Router();

type RequestHandler = (req: Request, res: Response, next?: NextFunction) => Promise<void> | void

const asyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// Маршруты для пропусков
router.post("/", asyncHandler(createPass))
router.get("/", asyncHandler(getAllPasses))
router.get("/:id", asyncHandler(getPassById))
router.put("/:id", asyncHandler(updatePass))
router.delete("/:id", asyncHandler(deletePass))

export default router;
