import { Request, Response } from 'express';
import Event from '../models/Event';

// @desc    Get all events
// @route   GET /api/events
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
export const createEvent = async (req: Request, res: Response) => {
  try {
    const event = new Event(req.body);
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (event) {
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
