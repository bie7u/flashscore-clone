import express, { Request, Response } from 'express';
import Match, { IMatch } from '../models/Match';

const router = express.Router();

// Get all matches
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, league, date } = req.query;
    
    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (league) filter.league = league;
    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.startTime = { $gte: startDate, $lt: endDate };
    }

    const matches = await Match.find(filter).sort({ startTime: 1 });
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single match by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new match
router.post('/', async (req: Request, res: Response) => {
  try {
    const matchData = req.body;
    const match = new Match(matchData);
    const savedMatch = await match.save();
    
    // Emit to all connected clients
    const io = req.app.get('io');
    if (io) {
      io.emit('matchCreated', savedMatch);
    }
    
    res.status(201).json(savedMatch);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(400).json({ error: 'Invalid match data' });
  }
});

// Update a match
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    // Emit update to all connected clients
    const io = req.app.get('io');
    if (io) {
      io.emit('matchUpdated', match);
    }
    
    res.json(match);
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(400).json({ error: 'Invalid match data' });
  }
});

// Add event to match
router.post('/:id/events', async (req: Request, res: Response) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    match.events.push(req.body);
    const updatedMatch = await match.save();
    
    // Emit event to all connected clients
    const io = req.app.get('io');
    if (io) {
      io.emit('matchEvent', { matchId: match._id, event: req.body });
    }
    
    res.json(updatedMatch);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(400).json({ error: 'Invalid event data' });
  }
});

// Delete a match
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    // Emit deletion to all connected clients
    const io = req.app.get('io');
    if (io) {
      io.emit('matchDeleted', req.params.id);
    }
    
    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;