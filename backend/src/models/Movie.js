const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    genre: {
      type: [String],
      required: [true, 'Genre is required'],
      enum: [
        'Action',
        'Comedy',
        'Drama',
        'Horror',
        'Romance',
        'Sci-Fi',
        'Thriller',
        'Animation',
        'Documentary',
        'Fantasy',
        'Crime',
        'Mystery',
        'Adventure',
        'Biography',
        'Family',
      ],
    },
    releaseYear: {
      type: Number,
      required: [true, 'Release year is required'],
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 5, 'Year is too far in the future'],
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be below 0'],
      max: [10, 'Rating cannot exceed 10'],
      default: 0,
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
    },
    backdropImage: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    cast: [
      {
        name: { type: String, required: true },
        character: { type: String, default: '' },
        photo: { type: String, default: '' },
      },
    ],
    director: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewRelease: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: 'English',
    },
    maturityRating: {
      type: String,
      enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-MA', 'TV-14', 'TV-G'],
      default: 'PG-13',
    },
    ageRestriction: {
      type: Number,
      default: 13,
    },
  },
  { timestamps: true }
);

// Index for search
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ isFeatured: 1 });
movieSchema.index({ isTrending: 1 });
movieSchema.index({ releaseYear: -1 });

module.exports = mongoose.model('Movie', movieSchema);
