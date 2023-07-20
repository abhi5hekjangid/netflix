
const apiPath = {
    
    fetchSearchedResults: (id) => `${apiEndPoint}/search/movie?api_key=${apiKey}&query=${id}`,
}

const logo = document.getElementById('logo');
// Add a click event listener to the logo
logo.addEventListener('click', function () {
  // Navigate to the home page (index.html)
  window.location.href = 'index.html';
});

// show current active nav link as bold
const activePage = window.location.pathname;
const navLinks = document.getElementsByClassName('nav-item');
for(let i=0; i<navLinks.length;i++){
    if(navLinks[i].href.includes(`${activePage}`)){
        navLinks[i].classList.add('active');
    }
}

// add footer
fetch('footer.html')
.then(res => res.text())
.then(res => {
  document.getElementById('footer').innerHTML = res;
});


// search button
const searchIcon = document.getElementById('search-icon');
const searchBox = document.getElementById("searchBox");
searchIcon.addEventListener('click', function(){
  // console.log("hello");
  searchBox.classList.toggle("show");      
});

// clear search bar
const searchClearButton = document.getElementById('search-clear');
var searchBar = document.getElementById('search-bar');
searchClearButton.addEventListener('click', function(){
  // console.log("inside")
  searchBar.value="";
});

//show searched results
const searchEnterButton = document.getElementById('search-enter');

searchEnterButton.addEventListener('click', function(){
      const searchedValue = searchBar.value;
      fetchSearchedResults(searchedValue);
});

searchBar.addEventListener('keypress',function(e){
  if(e.key=='Enter'){
      const searchedValue = searchBar.value;
      fetchSearchedResults(searchedValue);
  }
});


function fetchSearchedResults(searchedValue){
  // console.log(apiPaths1.fetchSearchedResults(searchedValue));
  // const fetchUrl = `/api/search/${searchedValue}`;
  fetch(apiPath.fetchSearchedResults(searchedValue))
  .then(res=>res.json())
  .then(res=>{
    const result = res.results;
    if(Array.isArray(result) && result.length){
      buildSearchSection(result,searchedValue);
    }
  })
  .catch(err=>console.log(err));
}


function buildSearchSection(result,searchedValue){
  
  // not showing already present movies
  const movieSection = document.getElementsByClassName('movies-section');
  
  if(movieSection){
    for( element of movieSection){
      element.classList.add('hide');
    }      
  }

  const bannerSection = document.getElementById('banner-section');
  if(bannerSection)
    bannerSection.classList.add('hide');
  

  const browseSection = document.getElementById('browse-section');
  if(browseSection){
    browseSection.classList.add('hide');
    console.log(browseSection);
  }
    
  const searchedCont = document.getElementById('searched-cont');
  //delete already searched results

  const childs = searchedCont.children;

  // Loop through the child elements
  for (let i = 0; i < childs.length; i++) {
        searchedCont.removeChild(childs[i]);
  }

  const searchedListHTML = result.map(item=>{
        // fetch(`https://api.themoviedb.org/3/movie/${item.id}/images?api_key=${apiKey}`)
        // .then(res=>res.json())
        // .then(res=>console.log(res));
        // console.log(item);
        return ` 
        <div class="movie-item" onmouseover="searchMovieTrailer('${item.title}','yt${item.id}')">
            <img class="movie-item-img" src="${imgPath}${item.poster_path}" alt="${item.title}" >
            <iframe width="245px" height="150px" src="" id="yt${item.id}"></iframe>
        </div> 
        `;       
    }).join('');

    const searchedSectionHTML = `\
            <h2 class="movies-section-heading">Searched Results for ${searchedValue}<span class="explore-nudge">Explore All</span> </h2>
            <div class="searched-row">          
                ${searchedListHTML}
            </div>
            
    `;

    const div = document.createElement('div');
    div.className="searched-section";
    div.innerHTML=searchedSectionHTML

    // append HTML into container

    searchedCont.append(div); 
}