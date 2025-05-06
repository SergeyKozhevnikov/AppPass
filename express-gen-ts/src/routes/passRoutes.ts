import express from 'express';
import {
  createPass,
  getAllPasses,
  getPassById,
  updatePass,
  deletePass } from '../controllers/passController';

const router = express.Router();

// Маршруты для пропусков
router.post('/', createPass);
router.get('/', getAllPasses);
router.get('/:id', getPassById);
router.put('/:id', updatePass);
router.delete('/:id', deletePass);

export default router;
