export const getListMovies = (size, movies) => movies.filter((movie, index) => index < size);

export const randomBanner = (movies) => movies[Math.floor(Math.random() * movies.length)];