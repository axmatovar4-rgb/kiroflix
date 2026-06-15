const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovieById,
  getFeaturedMovies,
  getTrendingMovies,
  getNewReleases,
  getMoviesByGenre,
  searchMovies,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes (order matters - specific routes before parameterized)
router.get('/featured', getFeaturedMovies);
router.get('/trending', getTrendingMovies);
router.get('/new-releases', getNewReleases);
router.get('/search', searchMovies);
router.get('/genre/:genre', getMoviesByGenre);
router.get('/', getAllMovies);
router.get('/:id', getMovieById);

// Protected routes (watchlist)
router.get('/user/watchlist', protect, getWatchlist);
router.post('/:id/watchlist', protect, addToWatchlist);
router.delete('/:id/watchlist', protect, removeFromWatchlist);

// Admin-only routes
router.post('/', protect, adminOnly, createMovie);
router.put('/:id', protect, adminOnly, updateMovie);
router.delete('/:id', protect, adminOnly, deleteMovie);

module.exports = router;
