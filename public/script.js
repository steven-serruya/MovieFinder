import config from "./config.js"; // Adjust the path if necessary

const tmdbKey = config.MY_API_KEY;
console.log(tmdbKey);
const tmdbBaseUrl = "https://api.themoviedb.org/3";
const playBtn = document.getElementById("playBtn");
const form = document.getElementById("form");
const select = document.getElementById("genres");

// Load liked and disliked movies from local storage
const myLikedMovies = loadLikedMovies();
console.log(myLikedMovies);
const myDislikedMovies = loadDislikedMovies();

if (myLikedMovies) {
  myLikedMovies.forEach((movie) => createLikedMovie(movie));
}

if (myDislikedMovies) {
  myDislikedMovies.forEach((movie) => createDislikedMovie(movie));
}

// API calls
const getGenres = async () => {
  const genreRequestEndpoint = "/genre/movie/list";
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = tmdbBaseUrl + genreRequestEndpoint + requestParams;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const genres = jsonResponse.genres;
      return genres;
    }
  } catch (error) {
    console.log(error);
  }
};

const searchPerson = async () => {
  const searchPersonEndpoint = "/search/person";
  const castInput = getCastValue();
  const requestParams = `?api_key=${tmdbKey}&query=${castInput}`;
  const urlToFetch = tmdbBaseUrl + searchPersonEndpoint + requestParams;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const person = jsonResponse.results;
      return person;
    }
  } catch (error) {
    console.log(error);
  }
};

const getMovies = async () => {
  const selectedGenre = getSelectedGenre();
  const rating = getRatingValue();
  const randomPage = getRandomPage();
  const discoverMovieEndpoint = "/discover/movie";
  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}&vote_average.gte=${rating}&page=${randomPage}`;
  const urlToFetch = tmdbBaseUrl + discoverMovieEndpoint + requestParams;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const movies = jsonResponse.results;
      return movies;
    }
  } catch (error) {
    console.log(error);
  }
};

const getMoviesWithActor = async (person) => {
  const selectedGenre = getSelectedGenre();
  const rating = getRatingValue();
  const castChoice = getCastChoice(person);
  const discoverMovieEndpoint = "/discover/movie";
  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}&with_cast=${castChoice}&vote_average.gte=${rating}`;
  const urlToFetch = tmdbBaseUrl + discoverMovieEndpoint + requestParams;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const movies = jsonResponse.results;
      return movies;
    }
  } catch (error) {
    console.log(error);
  }
};

const getMovieInfo = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `/movie/${movieId}`;
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = tmdbBaseUrl + movieEndpoint + requestParams;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const movieInfo = await response.json();
      return movieInfo;
    }
  } catch (error) {
    console.log(error);
  }
};

const getCast = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `/movie/${movieId}/credits`;
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = tmdbBaseUrl + movieEndpoint + requestParams;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const movieCast = await response.json();
      const actorsNames = movieCast.cast
        .map((actor) => actor.name.trim())
        .slice(0, 5)
        .join(", ");
      return actorsNames;
    }
  } catch (error) {
    console.log(error);
  }
};

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovies = async (person) => {
  let movies;
  if (person.length !== 0) {
    movies = await getMoviesWithActor(person);
  } else {
    movies = await getMovies();
  }
  let randomMovie1 = getRandomMovie(movies);
  let randomMovie2 = getRandomMovie(movies);
  console.log(movies); // Check the content of movies array

  // Ensure that the two movies are different
  while (randomMovie1.id === randomMovie2.id) {
    randomMovie2 = getRandomMovie(movies);
  }

  const info1 = await getMovieInfo(randomMovie1);
  const cast1 = await getCast(randomMovie1);
  const info2 = await getMovieInfo(randomMovie2);
  const cast2 = await getCast(randomMovie2);

  displayMovies(info1, cast1, info2, cast2); // New function to handle two movies
};

getGenres().then(populateGenreDropdown);

playBtn.addEventListener("click", () => {
  searchPerson().then(showRandomMovies); // Instead of showRandomMovie
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchPerson().then(showRandomMovies); // Instead of showRandomMovie
});
