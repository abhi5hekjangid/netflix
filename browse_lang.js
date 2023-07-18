
const apiKey = '38fbd1866d739e92780eae3792f81f3e'
const apiEndPoint = 'https://api.themoviedb.org/3'
const imgPath = 'https://image.tmdb.org/t/p/original'
const youtubeApiKey = 'AIzaSyACR7ch7qB2uH9ZIpxQNI285wFAVU7GsWY'
const youtubeURL = 'https://www.youtube.com/watch?v='
const apiPaths = {
    fetchAllLanguages: `https://api.themoviedb.org/3/configuration/languages?api_key=${apiKey}`,
    fetchMoviesList: (id) => `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_original_language=${id}`,
    fetchTvList: (id) => `${apiEndPoint}/discover/tv?api_key=${apiKey}&with_original_language=${id}`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtubeApiKey}`,
}


//boots up the app
function init(){
    // console.log(apiPaths.fetchTrending);
    fetchAllLanguages();

    //default
    fetchAndBuildAllSectionsMovies("en English","movie");
    fetchAndBuildAllSectionsMovies("en English","tv");
}


function fetchAllLanguages(){
    fetch(apiPaths.fetchAllLanguages)
    .then(res=>res.json())
    .then(res=> {
        // const languages = res.english_name;
        // console.log(res)
        createBrowseSection(res);
    })
    .catch(err=>console.log(err));
}

function createBrowseSection(languages){
    const browseCont = document.getElementById('browse-cont');
    const langListHTML = languages.map(item=>{
        // console.log(item);
        return ` 
        <option class = "lang-item" value='${item.iso_639_1} ${item.english_name}'>${item.english_name}</option> 
        `;       
    }).join('');

    
    const browseSectionHTML = `
        <label for="lang">Browse by language:</label>
        <select class="lang-select"  id="lang" name="Audio" onchange="handleSelection()" onselect="handleSelection()">
            ${langListHTML}
        </select>
    `;
    // console.log(browseSectionHTML);
    const div = document.createElement('div');
    div.className="browse-section";
    div.innerHTML=browseSectionHTML

    browseCont.append(div)
}


function fetchAndBuildAllSectionsMovies(language, type){
    // console.log(apiPaths.fetchMoviesList(language));
    const lang_codes = language.split(" ");
    // console.log(lang_codes);

    const langCode = lang_codes[0];
    const langName = lang_codes[1];

    url=""
    if(type=="movie") url = apiPaths.fetchMoviesList(langCode);
    else url = apiPaths.fetchTvList(langCode);

    fetch(url)
    .then(res=>res.json())
    .then(res=>{
        // console.log(res);
        const movies = res.results;

        if(Array.isArray(movies) && movies.length){
            buildMoviesSection(movies,langName,type);           
        }
        // console.table(categories);
    })
    .catch(err=>console.log(err));
}


function buildMoviesSection(list,lang,type){
    
    // console.log(list,categoryName);
    const moviesCont = document.getElementById('movies-cont');
    // moviesCont.removeChild('div');

    const moviesListHTML = list.map(item=>{
        // fetch(`https://api.themoviedb.org/3/movie/${item.id}/images?api_key=${apiKey}`)
        // .then(res=>res.json())
        // .then(res=>console.log(res));

        title = "";

        if (type=="movie") title = item.title;
        else title  = item.name;

        return ` 
        <div class="movie-item"  onmouseover="searchMovieTrailer('${title}','yt${item.id}')">
            <img class="movie-item-img" src="${imgPath}${item.poster_path}" alt="${title}" >
            <iframe width="245px" height="150px" src="" id="yt${item.id}"></iframe>
        </div> 
        `;       
    }).join('');
    // used join to remove ',' from between two img tags

    topic_name = ""
    if(type=="movie") topic_name = `${lang} Movies`;
    else topic_name = `${lang} Tv Shows`;

    const moviesSectionHTML = `\
            <h2 class="movies-section-heading">${topic_name}<span class="explore-nudge">Explore All</span> </h2>
            <div class="movies-row">
                ${moviesListHTML}
            </div>
    `;

    const div = document.createElement('div');
    div.className="movies-section";
    div.id=lang;
    div.innerHTML=moviesSectionHTML

    // console.log(moviesSectionHTML);
    // append HTML into container

    const childs = moviesCont.children;

    // Loop through the child elements
    for (let i = 0; i < childs.length; i++) {
        if(childs[i].id!=lang){
            moviesCont.removeChild(childs[i]);
        }
    }
    
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


// All listeners

function handleSelection(){
    const selectedValue = document.getElementById('lang').value;
    console.log(selectedValue);
    fetchAndBuildAllSectionsMovies(selectedValue,"movie");
    fetchAndBuildAllSectionsMovies(selectedValue,"tv");
}

window.addEventListener('load',function(){
    init();
    window.addEventListener('scroll',function(){
        const header = document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('bg_black');
        else header.classList.remove('bg_black');
    });
});
