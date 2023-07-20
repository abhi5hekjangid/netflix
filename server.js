const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // You can choose any available port


const apiKey = '38fbd1866d739e92780eae3792f81f3e'
const apiEndPoint = 'https://api.themoviedb.org/3'
const imgPath = 'https://image.tmdb.org/t/p/original'
const youtubeApiKey = 'AIzaSyACR7ch7qB2uH9ZIpxQNI285wFAVU7GsWY'
const youtubeURL = 'https://www.youtube.com/watch?v='
const apiPaths = {
    fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (id) => `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending: `${apiEndPoint}/trending/movie/day?api_key=${apiKey}`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtubeApiKey}`,
    fetchSearchedResults: (id) => `${apiEndPoint}/search/movie?api_key=${apiKey}&query=${id}`,
    fetchAllCategoriesTv: `${apiEndPoint}/genre/tv/list?api_key=${apiKey}`,
    fetchTvList: (id) => `${apiEndPoint}/discover/tv?api_key=${apiKey}&with_genres=${id}`,
    fetchTrendingTv: `${apiEndPoint}/trending/tv/day?api_key=${apiKey}`,
    fetchMoviesNew: `${apiEndPoint}/movie/now_playing?api_key=${apiKey}`,
    fetchMoviesPopular: `${apiEndPoint}/movie/top_rated?api_key=${apiKey}`,
    fetchTvTopRated: `${apiEndPoint}/tv/top_rated?api_key=${apiKey}`,
    fetchTvPopular: `${apiEndPoint}/tv/popular?api_key=${apiKey}`,
    fetchAllLanguages: `https://api.themoviedb.org/3/configuration/languages?api_key=${apiKey}`,
    fetchMoviesListByLang: (id) => `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_original_language=${id}`,
    fetchTvListByLang: (id) => `${apiEndPoint}/discover/tv?api_key=${apiKey}&with_original_language=${id}`,
}

// console.log(apiPaths.fetchMoviesNew,apiPaths.fetchMoviesPopular);
// Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Parse incoming JSON data
app.use(bodyParser.json());

// Handle requests to the root URL ('/') with the index.html file
app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
    res.render('index');
});


// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Authenticate the user in MongoDB based on the provided credentials
      // (Replace 'User' with your actual MongoDB collection name)
    //   const user = await User.findOne({ username, password });
  
      if (username=="sss" && password=="sss") {
        // Successful login
        // You can also create a JSON Web Token (JWT) here and send it back to the frontend for authentication in subsequent requests
        res.sendFile(path.join(__dirname, 'public', 'home.html'));
        res.status(200).json({ message: 'Login successful' });
      } else {
        // Failed login
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// fetch all categories
app.get('/api/categories', async (req, res) => {
    try {
        const response = await axios.get(apiPaths.fetchAllCategories);
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories from the external API' });
    }
});

// fetch all categories tv
app.get('/api/tv/categories', async (req, res) => {
    try {
        const response = await axios.get(apiPaths.fetchAllCategoriesTv);
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories from the external API' });
    }
});

// fetch trending 
app.get('/api/trending', async (req, res) => {
    try {
        const response = await axios.get(apiPaths.fetchTrending);
        const data = response.data;
        res.json(data);
        // console.table(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories from the external API' });
    }
});


// fetch trending  tv
app.get('/api/tv/trending', async (req, res) => {
    try {
        const response = await axios.get(apiPaths.fetchTrendingTv);
        const data = response.data;
        res.json(data);
        // console.table(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories from the external API' });
    }
});

// API endpoint to fetch movies by category ID
app.get('/api/movies/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const response = await axios.get(apiPaths.fetchMoviesList(categoryId));
        const movies = response.data;
        res.json(movies); // Send the data back to the client as a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch movies from the external API' });
    }
});

// API endpoint to fetch tv by category ID
app.get('/api/tv/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const response = await axios.get(apiPaths.fetchTvList(categoryId));
        const movies = response.data;
        res.json(movies); // Send the data back to the client as a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch movies from the external API' });
    }
});

// API endpoint to fetch youtube video by name
app.get('/api/youtube/:movieName', async (req, res) => {
    const movieName = req.params.movieName;
    try {
        const response = await axios.get(apiPaths.searchOnYoutube(movieName));
        const movie = response.data;
        // console.log(movie);
        res.json(movie); // Send the data back to the client as a JSON response
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Failed to fetch movies from the external API' });
    }
});

// API endpoint to fetch searched results
app.get('/api/search/:searchedValue', async (req, res) => {
    const searchedValue = req.params.searchedValue;
    try {
        const response = await axios.get(apiPaths.fetchSearchedResults(searchedValue));
        const movies = response.data;
        // console.log(movie);
        res.json(movies); // Send the data back to the client as a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch movies from the external API' });
    }
});



// fetch popular movies 
app.get('/movies/popular', async (req, res) => {
    // console.log("movies popular");
    try {
        const response = await axios.get(apiPaths.fetchMoviesPopular);
        const data = response.data;
        res.json(data);
        // console.table(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories from the external API' });
    }
});

// fetch new movies 
app.get('/movies/new', async (req, res) => {
    try {
        // console.log("movies new");
        const response = await axios.get(apiPaths.fetchMoviesNew);
        const data = response.data;
        res.json(data);
        // console.table(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories from the external API' });
    }
});

// fetch popular movies 
app.get('/tv/popular', async (req, res) => {
    try {
        const response = await axios.get(apiPaths.fetchTvPopular);
        const data = response.data;
        res.json(data);
        // console.table(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories from the external API' });
    }
});

// fetch new tv 
app.get('/tv/topRated', async (req, res) => {
    try {
        const response = await axios.get(apiPaths.fetchTvTopRated);
        const data = response.data;
        res.json(data);
        // console.table(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories from the external API' });
    }
});

// fetch all languages 
app.get('/api/allLang', async (req, res) => {
    try {
        const response = await axios.get(apiPaths.fetchAllLanguages);
        const data = response.data;
        res.json(data);
        // console.table(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories from the external API' });
    }
});

// fetch movies by languages 
app.get('/api/movieByLang/:lang', async (req, res) => {
    const lang = req.params.lang;
    // console.log(lang);
    try {
        const response = await axios.get(apiPaths.fetchMoviesListByLang(lang));
        const data = response.data;
        res.json(data);
        // console.table(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories from the external API' });
    }
});
// fetch tv by languages 
app.get('/api/tvByLang/:lang', async (req, res) => {
    const lang = req.params.lang;
    try {
        const response = await axios.get(apiPaths.fetchTvListByLang(lang));
        const data = response.data;
        res.json(data);
        // console.table(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories from the external API' });
    }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
