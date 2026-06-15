const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Movie = require('../models/Movie');

const movies = [
  {
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    releaseYear: 2010,
    duration: 148,
    rating: 8.8,
    thumbnail: 'https://picsum.photos/seed/inception/400/600',
    backdropImage: 'https://picsum.photos/seed/inception-bg/1280/720',
    videoUrl: '',
    trailerUrl: '',
    cast: [
      { name: 'Leonardo DiCaprio', character: 'Cobb' },
      { name: 'Joseph Gordon-Levitt', character: 'Arthur' },
      { name: 'Elliot Page', character: 'Ariadne' },
      { name: 'Tom Hardy', character: 'Eames' },
    ],
    director: 'Christopher Nolan',
    isFeatured: true,
    isTrending: true,
    isNewRelease: false,
    views: 125000,
    language: 'English',
    maturityRating: 'PG-13',
  },
  {
    title: 'The Dark Knight',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: ['Action', 'Crime', 'Drama'],
    releaseYear: 2008,
    duration: 152,
    rating: 9.0,
    thumbnail: 'https://picsum.photos/seed/darkknight/400/600',
    backdropImage: 'https://picsum.photos/seed/darkknight-bg/1280/720',
    videoUrl: '',
    trailerUrl: '',
    cast: [
      { name: 'Christian Bale', character: 'Bruce Wayne / Batman' },
      { name: 'Heath Ledger', character: 'Joker' },
      { name: 'Aaron Eckhart', character: 'Harvey Dent' },
      { name: 'Michael Caine', character: 'Alfred' },
    ],
    director: 'Christopher Nolan',
    isFeatured: true,
    isTrending: true,
    isNewRelease: false,
    views: 200000,
    language: 'English',
    maturityRating: 'PG-13',
  },
  {
    title: 'Interstellar',
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    releaseYear: 2014,
    duration: 169,
    rating: 8.6,
    thumbnail: 'https://picsum.photos/seed/interstellar/400/600',
    backdropImage: 'https://picsum.photos/seed/interstellar-bg/1280/720',
    videoUrl: '',
    trailerUrl: '',
    cast: [
      { name: 'Matthew McConaughey', character: 'Cooper' },
      { name: 'Anne Hathaway', character: 'Brand' },
      { name: 'Jessica Chastain', character: 'Murph' },
    ],
    director: 'Christopher Nolan',
    isFeatured: false,
    isTrending: true,
    isNewRelease: false,
    views: 180000,
    language: 'English',
    maturityRating: 'PG-13',
  },
  {
    title: 'The Shawshank Redemption',
    description:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    genre: ['Drama'],
    releaseYear: 1994,
    duration: 142,
    rating: 9.3,
    thumbnail: 'https://picsum.photos/seed/shawshank/400/600',
    backdropImage: 'https://picsum.photos/seed/shawshank-bg/1280/720',
    videoUrl: '',
    trailerUrl: '',
    cast: [
      { name: 'Tim Robbins', character: 'Andy Dufresne' },
      { name: 'Morgan Freeman', character: 'Ellis Boyd "Red" Redding' },
    ],
    director: 'Frank Darabont',
    isFeatured: false,
    isTrending: false,
    isNewRelease: false,
    views: 95000,
    language: 'English',
    maturityRating: 'R',
  },
  {
    title: 'Avengers: Endgame',
    description:
      'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\'s actions and restore balance to the universe.',
    genre: ['Action', 'Adventure', 'Drama'],
    releaseYear: 2019,
    duration: 181,
    rating: 8.4,
    thumbnail: 'https://picsum.photos/seed/endgame/400/600',
    backdropImage: 'https://picsum.photos/seed/endgame-bg/1280/720',
    videoUrl: '',
    trailerUrl: '',
    cast: [
      { name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man' },
      { name: 'Chris Evans', character: 'Steve Rogers / Captain America' },
      { name: 'Mark Ruffalo', character: 'Bruce Banner / Hulk' },
      { name: 'Chris Hemsworth', character: 'Thor' },
    ],
    director: 'Anthony and Joe Russo',
    isFeatured: true,
    isTrending: true,
    isNewRelease: false,
    views: 350000,
    language: 'English',
    maturityRating: 'PG-13',
  },
  {
    title: 'The Mask',
    description:
      'Bank clerk Stanley Ipkiss is transformed into a manic superhero when he wears a mysterious mask.',
    genre: ['Comedy', 'Fantasy', 'Romance'],
    releaseYear: 1994,
    duration: 101,
    rating: 6.9,
    thumbnail: 'https://picsum.photos/seed/themask/400/600',
    backdropImage: 'https://picsum.photos/seed/themask-bg/1280/720',
    videoUrl: '',
    trailerUrl: '',
    cast: [
      { name: 'Jim Carrey', character: 'Stanley Ipkiss / The Mask' },
      { name: 'Cameron Diaz', character: 'Tina Carlyle' },
    ],
    director: 'Chuck Russell',
    isFeatured: false,
    isTrending: false,
    isNewRelease: false,
    views: 75000,
    language: 'English',
    maturityRating: 'PG-13',
  },
  {
    title: 'Dune',
    description:
      'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
    genre: ['Action', 'Adventure', 'Drama', 'Sci-Fi'],
    releaseYear: 2021,
    duration: 155,
    rating: 8.0,
    thumbnail: 'https://picsum.photos/seed/dune2021/400/600',
    backdropImage: 'https://picsum.photos/seed/dune2021-bg/1280/720',
    videoUrl: '',
    trailerUrl: '',
    cast: [
      { name: 'Timothée Chalamet', character: 'Paul Atreides' },
      { name: 'Rebecca Ferguson', character: 'Lady Jessica' },
      { name: 'Zendaya', character: 'Chani' },
      { name: 'Oscar Isaac', character: 'Duke Leto Atreides' },
    ],
    director: 'Denis Villeneuve',
    isFeatured: false,
    isTrending: true,
    isNewRelease: false,
    views: 145000,
    language: 'English',
    maturityRating: 'PG-13',
  },
  {
    title: 'Oppenheimer',
    description:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    genre: ['Biography', 'Drama', 'History'],
    releaseYear: 2023,
    duration: 180,
    rating: 8.9,
    thumbnail: 'https://picsum.photos/seed/oppenheimer/400/600',
    backdropImage: 'https://picsum.photos/seed/oppenheimer-bg/1280/720',
    videoUrl: '',
    trailerUrl: '',
    cast: [
      { name: 'Cillian Murphy', character: 'J. Robert Oppenheimer' },
      { name: 'Emily Blunt', character: 'Katherine "Kitty" Oppenheimer' },
      { name: 'Matt Damon', character: 'Gen. Leslie Groves Jr.' },
      { name: 'Robert Downey Jr.', character: 'Lewis Strauss' },
    ],
    director: 'Christopher Nolan',
    isFeatured: true,
    isTrending: true,
    isNewRelease: true,
    views: 220000,
    language: 'English',
    maturityRating: 'R',
  },
  {
    title: 'Spider-Man: No Way Home',
    description:
      'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
    genre: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
    releaseYear: 2021,
    duration: 148,
    rating: 8.3,
    thumbnail: 'https://picsum.photos/seed/spiderman-nwh/400/600',
    backdropImage: 'https://picsum.photos/seed/spiderman-nwh-bg/1280/720',
    videoUrl: '',
    trailerUrl: '',
    cast: [
      { name: 'Tom Holland', character: 'Peter Parker / Spider-Man' },
      { name: 'Zendaya', character: 'MJ' },
      { name: 'Benedict Cumberbatch', character: 'Doctor Strange' },
    ],
    director: 'Jon Watts',
    isFeatured: false,
    isTrending: true,
    isNewRelease: false,
    views: 280000,
    language: 'English',
    maturityRating: 'PG-13',
  },
  {
    title: 'The Grand Budapest Hotel',
    description:
      'A writer encounters the owner of an aging European hotel between the wars and learns of his early years serving as a lobby boy in the hotel\'s glorious years under an exceptional concierge.',
    genre: ['Adventure', 'Comedy', 'Crime'],
    releaseYear: 2014,
    duration: 99,
    rating: 8.1,
    thumbnail: 'https://picsum.photos/seed/grandbudapest/400/600',
    backdropImage: 'https://picsum.photos/seed/grandbudapest-bg/1280/720',
    videoUrl: '',
    trailerUrl: '',
    cast: [
      { name: 'Ralph Fiennes', character: 'M. Gustave H.' },
      { name: 'Tony Revolori', character: 'Zero Moustafa' },
      { name: 'Saoirse Ronan', character: 'Agatha' },
    ],
    director: 'Wes Anderson',
    isFeatured: false,
    isTrending: false,
    isNewRelease: false,
    views: 55000,
    language: 'English',
    maturityRating: 'R',
  },
  {
    title: 'Parasite',
    description:
      'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    genre: ['Comedy', 'Drama', 'Thriller'],
    releaseYear: 2019,
    duration: 132,
    rating: 8.5,
    thumbnail: 'https://picsum.photos/seed/parasite/400/600',
    backdropImage: 'https://picsum.photos/seed/parasite-bg/1280/720',
    videoUrl: '',
    trailerUrl: '',
    cast: [
      { name: 'Song Kang-ho', character: 'Kim Ki-taek' },
      { name: 'Lee Sun-kyun', character: 'Park Dong-ik' },
      { name: 'Cho Yeo-jeong', character: 'Choi Yeon-gyo' },
    ],
    director: 'Bong Joon-ho',
    isFeatured: false,
    isTrending: false,
    isNewRelease: false,
    views: 88000,
    language: 'Korean',
    maturityRating: 'R',
  },
  {
    title: 'Everything Everywhere All at Once',
    description:
      'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what\'s important to her by connecting with the lives she could have led in other universes.',
    genre: ['Action', 'Adventure', 'Comedy', 'Sci-Fi'],
    releaseYear: 2022,
    duration: 139,
    rating: 8.0,
    thumbnail: 'https://picsum.photos/seed/eeaao/400/600',
    backdropImage: 'https://picsum.photos/seed/eeaao-bg/1280/720',
    videoUrl: '',
    trailerUrl: '',
    cast: [
      { name: 'Michelle Yeoh', character: 'Evelyn Wang' },
      { name: 'Ke Huy Quan', character: 'Waymond Wang' },
      { name: 'Jamie Lee Curtis', character: 'Deirdre Beaubeirdra' },
    ],
    director: 'Daniel Kwan, Daniel Scheinert',
    isFeatured: false,
    isTrending: true,
    isNewRelease: true,
    views: 112000,
    language: 'English',
    maturityRating: 'R',
  },
];

const seedDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/netflix-clone';
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Movie.deleteMany({});
    console.log('🗑️  Cleared existing movies');

    await Movie.insertMany(movies);
    console.log(`🎬 Seeded ${movies.length} movies`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();
