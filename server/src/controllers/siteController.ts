import { Request, Response } from 'express';
import GlobalSettings from '../models/GlobalSettings';

// @desc    Get global settings
// @route   GET /api/settings
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await GlobalSettings.findOne();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = await GlobalSettings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
