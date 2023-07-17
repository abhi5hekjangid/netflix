//const
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
}

//boots up the app
function init(){
    // console.log(apiPaths.fetchTrending);
    fetchTrendingMovie();
    fetchAndBuildAllSections();
}

function fetchTrendingMovie(){
    fetchAndBuildMovieSection(apiPaths.fetchTrending,'Trending Now')
    .then(movies =>{
        const randomIdx = parseInt(Math.random() * movies.length)
        buildBannerSection(movies[randomIdx]);
    })
    .catch(err=>console.error(err));
}

function buildBannerSection(movie){
    console.log(movie);
    const bannerContainer = document.getElementById('banner-section');
    bannerContainer.style.backgroundImage = `url(${imgPath}${movie.poster_path})`;

    const div = document.createElement('div');
    div.innerHTML= `
        <h2 class="banner__title">${movie.title}</h2>
        <p class="banner__info">Released on ${movie.release_date}</p>
        <p class="banner__overview">${movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+'...':movie.overview}</p>
        <div class="action-button-cont">
            <button class="action-button"><i class="fa-solid fa-play"></i> &nbsp Play</button>
            <button class="action-button"><i class="fa-solid fa-circle-info"></i> &nbsp More Info</button>
        </div>
    `;
    div.className="banner-content container";
    bannerContainer.append(div);
}
function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
    .then(res=>res.json())
    .then(res=>{
        const categories = res.genres;

        if(Array.isArray(categories) && categories.length){
            categories.forEach(category =>{
                fetchAndBuildMovieSection(
                apiPaths.fetchMoviesList(category.id),
                category.name);
            });            
        }
        console.table(categories);
    })
    .catch(err=>console.log(err));
}

function fetchAndBuildMovieSection(fetchUrl, categoryName){
    console.table(fetchUrl,categoryName);
    return fetch(fetchUrl)
    .then(res=>res.json())
    .then(res=>{
        const movies = res.results;
        if(Array.isArray(movies) && movies.length){
            buildMoviesSection(movies,categoryName);
        }
        return movies;
    })
    .catch(err=>console.log(err));
}

function buildMoviesSection(list,categoryName){
    // console.log(list,categoryName);
    const moviesCont = document.getElementById('movies-cont');
    const moviesListHTML = list.map(item=>{
        // fetch(`https://api.themoviedb.org/3/movie/${item.id}/images?api_key=${apiKey}`)
        // .then(res=>res.json())
        // .then(res=>console.log(res));
        return ` 
        <div class="movie-item" onmouseover="searchMovieTrailer('${item.title}','yt${item.id}')">
            <img class="movie-item-img" src="${imgPath}${item.poster_path}" alt="${item.title}" >
            <iframe width="245px" height="150px" src="" id="yt${item.id}"></iframe>
        </div> 
        `;       
    }).join('');
    // used join to remove ',' from between two img tags

    const moviesSectionHTML = `\
            <h2 class="movies-section-heading">${categoryName}<span class="explore-nudge">Explore All</span> </h2>
            <div class="movies-row">
                ${moviesListHTML}
            </div>
    `;

    const div = document.createElement('div');
    div.className="movies-section";
    div.innerHTML=moviesSectionHTML

    // append HTML into container

    moviesCont.append(div);

    // console.log(moviesSectionHTML)
    /* <div class="movies-section">
            <h2 class="movies-section-heading">Trending Now <span class="explore-nudge">Explore All</span> </h2>
            <div class="movies-row">
                <img class="movie-item" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpX_zNRF5Tp8BOT32LJKmUC7ymC9lPx4hxYw&usqp=CAU" alt="">
                <img class="movie-item" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpX_zNRF5Tp8BOT32LJKmUC7ymC9lPx4hxYw&usqp=CAU" alt="">
                <img class="movie-item" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpX_zNRF5Tp8BOT32LJKmUC7ymC9lPx4hxYw&usqp=CAU" alt="">
            </div>
        </div>*/ 
}

function searchMovieTrailer(movieName, iframeId){
    if (!movieName) return;

    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res=>res.json())
    .then(res=>{
        const bestResult = res.items[0];
        // const ytUrl = `${youtubeURL}${bestResult.id.videoId}`;
        // console.log(ytUrl);
        // window.open(ytUrl,'_blank');
        document.getElementById(iframeId).src= `https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=0&controls=0`;
    })
    .catch(err=>console.log(err));

}
window.addEventListener('load',function(){
    init();
    window.addEventListener('scroll',function(){
        const header = document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('bg_black');
        else header.classList.remove('bg_black');
    })
})
