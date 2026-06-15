const Movie = require('../models/Movie');
const User = require('../models/User');

// @desc    Get all movies with pagination and filtering
// @route   GET /api/movies
// @access  Public
const getAllMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || '-createdAt';

    const filter = {};
    if (req.query.language) filter.language = req.query.language;
    if (req.query.maturityRating) filter.maturityRating = req.query.maturityRating;

    const [movies, total] = await Promise.all([
      Movie.find(filter).sort(sortBy).skip(skip).limit(limit),
      Movie.countDocuments(filter),
    ]);

    res.json({
      movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Get all movies error:', err);
    res.status(500).json({ message: 'Server error fetching movies' });
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Increment views
    await Movie.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ movie });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Movie not found' });
    }
    console.error('Get movie by ID error:', err);
    res.status(500).json({ message: 'Server error fetching movie' });
  }
};

// @desc    Get featured movies
// @route   GET /api/movies/featured
// @access  Public
const getFeaturedMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isFeatured: true }).limit(5).sort('-createdAt');
    res.json({ movies });
  } catch (err) {
    console.error('Get featured movies error:', err);
    res.status(500).json({ message: 'Server error fetching featured movies' });
  }
};

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
const getTrendingMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isTrending: true }).limit(20).sort('-views');
    res.json({ movies });
  } catch (err) {
    console.error('Get trending movies error:', err);
    res.status(500).json({ message: 'Server error fetching trending movies' });
  }
};

// @desc    Get new releases
// @route   GET /api/movies/new-releases
// @access  Public
const getNewReleases = async (req, res) => {
  try {
    const movies = await Movie.find({ isNewRelease: true }).limit(20).sort('-releaseYear');
    res.json({ movies });
  } catch (err) {
    console.error('Get new releases error:', err);
    res.status(500).json({ message: 'Server error fetching new releases' });
  }
};

// @desc    Get movies by genre
// @route   GET /api/movies/genre/:genre
// @access  Public
const getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      Movie.find({ genre: { $in: [genre] } })
        .sort('-rating')
        .skip(skip)
        .limit(limit),
      Movie.countDocuments({ genre: { $in: [genre] } }),
    ]);

    res.json({
      movies,
      genre,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get movies by genre error:', err);
    res.status(500).json({ message: 'Server error fetching movies by genre' });
  }
};

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
const searchMovies = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const movies = await Movie.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { genre: { $in: [new RegExp(q, 'i')] } },
        { cast: { $elemMatch: { name: { $regex: q, $options: 'i' } } } },
        { director: { $regex: q, $options: 'i' } },
      ],
    }).limit(30);

    res.json({ movies, query: q, count: movies.length });
  } catch (err) {
    console.error('Search movies error:', err);
    res.status(500).json({ message: 'Server error searching movies' });
  }
};

// @desc    Add movie to watchlist
// @route   POST /api/movies/:id/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const user = await User.findById(req.user._id);
    if (user.watchlist.includes(req.params.id)) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    user.watchlist.push(req.params.id);
    await user.save();

    res.json({ message: 'Movie added to watchlist', watchlist: user.watchlist });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Movie not found' });
    }
    console.error('Add to watchlist error:', err);
    res.status(500).json({ message: 'Server error updating watchlist' });
  }
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/movies/:id/watchlist
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.watchlist = user.watchlist.filter(
      (id) => id.toString() !== req.params.id
    );
    await user.save();

    res.json({ message: 'Movie removed from watchlist', watchlist: user.watchlist });
  } catch (err) {
    console.error('Remove from watchlist error:', err);
    res.status(500).json({ message: 'Server error updating watchlist' });
  }
};

// @desc    Get user's watchlist
// @route   GET /api/movies/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('watchlist');
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    console.error('Get watchlist error:', err);
    res.status(500).json({ message: 'Server error fetching watchlist' });
  }
};

// @desc    Create a new movie (admin)
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ message: 'Movie created successfully', movie });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Create movie error:', err);
    res.status(500).json({ message: 'Server error creating movie' });
  }
};

// @desc    Update a movie (admin)
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie updated successfully', movie });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Update movie error:', err);
    res.status(500).json({ message: 'Server error updating movie' });
  }
};

// @desc    Delete a movie (admin)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error('Delete movie error:', err);
    res.status(500).json({ message: 'Server error deleting movie' });
  }
};

module.exports = {
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
};
