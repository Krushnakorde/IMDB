'use strict';
const search = document.getElementById("search");

// get the data from data.txt
const getData =async  ()=>{
    const response = await fetch('./data.txt');
    const result = await response.json();
    return result;
}






// for showing all movies data while user on server
const getMovies =async ()=>{
    try {

        const data = await getData();
        
        
        

        data.map(item=>{
            const id=item._id;
            const image= item.backdrop_path;
            const title= item.original_title;
            
            const movies = ` <li class='movieElement' id=${id}> <img class='show'id=${id} src="${image}"/> <h2 class='show' id=${id}>${title}</h2> <button id=${id} class='add-to-fav'>Favorite</button></li>`
            document.querySelector(".movies").innerHTML += movies ;
            
            
        })
    

    } catch (error) {
        console.error(error);
    }
}
getMovies();


// it will only shown when user enters inputs

const searchOpt = document.getElementById("searchOption")
searchOpt.style.display='none';




// it is preventing default keydown event;

const searchMovie = document.getElementById("search");
searchMovie.addEventListener('keydown', (event)=>{
    if(event.key=='Enter'){
        event.preventDefault();
    }
})




let debounceTime;
searchMovie.addEventListener("input", async function(){

    // whenever new input enters previously shown elment get deleted and on the basis of new input it will search
    const list = document.querySelectorAll(".movieElement");
    if(list){
        list.forEach(l=>{
            l.remove();
        })
    }

    
    let search = searchMovie.value.trim();
    const data = await getData();
    let movies =''    

    if(!search){
        
        // while there is empty search input, then it will as it is like just it was previously.


        data.map(item=>{

            const id=item._id;
            const image= item.backdrop_path;
            const title= item.original_title;

    
            searchOpt.style.display='none'

            
            
            movies = ` <li class='movieElement ' > <img class='show' id=${id} src="${image}"/> <h2  class='show' id=${id} >${title}</h2> <button id=${id} class='add-to-fav'>Favorite</button></li>`
            document.querySelector(".movies").innerHTML += movies ;
            
            
        })
    
    }else{

       

    search =search.toLowerCase();
    clearTimeout(debounceTime)
    
    let arr=[];

    // setting timeout to finding enter new credentials result immediately;
    debounceTime = setTimeout( async function(){ 
        
      
        // to find result converted to lowercase and compare with data;
         movies= data.filter(d=>(d.original_title.toLowerCase()).includes(search));
         
        
        movies.map(item=>{

            const id=item._id;
            const image = item.backdrop_path;
            const title = item.original_title;

            const newElement = ` <li class='movieElement' > <img id=${id} class='show' src="${image}"/> <h2 id=${id} class='show'>${title}</h2> <button id=${id} class='add-to-fav'>Favorite</button></li>`
            const moviesSearch = ` <li class='movieElement searching' > <p class='show' id=${id} >${title}</p> </li>`
            searchOpt.style.display='block'
            // This is for body element which can shows image as well;
            document.querySelector(".movies").innerHTML += newElement ;
            // This is for search bar;
            document.querySelector(".showSearch").innerHTML+= moviesSearch;
            

        })    

        console.log('search');

    }, 0)
        
}

});






let favArray = [];


async function addToFavourite(element){
    const movies= await getData();

    const res = favArray.find(e =>e._id==element);
    


    if(res){
       return alert ('already added to favorite')
    
    }
    const movie = movies.find(m=>m._id==element)
    favArray.push(movie);
    
    showFavorite();

}

// showing Favorite Element

async function showFavorite(){

    // getting favorite Movies List;

const favListEle = document.querySelectorAll(".favEle");

if(favListEle){
    favListEle.forEach(ele=>{
        ele.remove();
    })
}

// adding favorite Movies to HTML element;

favArray.forEach(ele => {

    const newFavoriteElement = `<div class= 'favEle' > <img class='show' id='${ele._id}' src=${ele.backdrop_path}/> <span class='show' id='${ele._id}'> ${ele.original_title} </span>  <button class='delete' id=${ele._id} >Delete</button></div>` ;
    const newele= document.querySelector(".offcanvas-body").innerHTML+= newFavoriteElement;
    

})

}


// to delete from favorite
async function deleteFavoriteMovie(id){
    
    // getting index to delete

    const index = favArray.findIndex(m=>m._id==id);

    // deleting from array
    favArray.splice(index,1);

    showFavorite()
    
    
}

// getting HTML ELement which can shows movie information
const ElementToShowMovie = document.getElementById("showingInfo")
ElementToShowMovie.style.display='none';
async function showMovieInfo(id){
    //getting movies details;
    const movies = await getData();

    // finding movie from movies Data
    const movie = await movies.find(m=>m._id==id);

// hidden element comes to front to show detailed infromation about movie
    ElementToShowMovie.style.display='block';



    // detailed information of a movie

    const searchedMovie= `<div class='searchedMovie' >
    <h3>${movie.original_title} </h3>
    <i class="fa-solid fa-star add-to-fav" id=${movie._id}></i>
    <i class="fa-solid fa-xmark" ></i>
    <img height='100px'width='250px' src='${movie.backdrop_path}'>
    <div>
    <a>Released: ${movie.first_aired}</a>
    <a>${movie.genres}</a>
    </div>
    
    <p>${movie.overview}</P>

    
    </div>`


    // attached created searchedMovie element to html element which can show the details
    ElementToShowMovie.innerHTML=searchedMovie;


}



async function clickListener(e){
    // for preventing default actions
    e.preventDefault();

    const target = e.target 
    



    // for adding to favorite;
    if(target.classList.contains('add-to-fav')){

        const res= confirm ('Are you sure! You want to add to favorite')
        if(!res){
            return;
        }
        addToFavourite(target.id);
    }else



// showing movie infomation in detail
    if(target.classList.contains('show')){
        console.log("show")
        showMovieInfo(target.id);
        searchOpt.style.display='none';

        search.value='';
        const list = document.querySelectorAll(".movieElement");
        if(list){
            list.forEach(l=>{
                l.remove();
            })

        }
        getMovies()

    } else 




    
    if(target.classList.contains('delete')){

        const res = confirm('Are you sure! You want to remove movie from favorite')
        if(!res){
            return;
        }
        
        deleteFavoriteMovie(target.id);
    }else

    // for hiding shown movie information

    if(target.classList.contains('fa-xmark')){

        ElementToShowMovie.style.display='none';

    }


}


// event listener on whole document;

document.addEventListener("click", clickListener);








