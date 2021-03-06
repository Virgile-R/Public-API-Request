/***
 * Helper functions
 */

async function getData(url) {
  try {
    const response = await fetch(url);
    const responseChecked = await checkStatus(response);
    return responseChecked.json();
  } catch (error) {
    
    return Promise.reject(error)
  }
}

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function generateUserCard(data) {
  const gallery = document.getElementById("gallery");
  data.results.forEach((user) => {
    const fullName = user.name.first + " " + user.name.last;
    const phoneRegEx = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/;
    const phone = user.phone.replace(phoneRegEx, "($1) $2-$3");
    const dobRegEx = /\D*(\d{4})\D*(\d{2})\D*(\d{2})\D*/;
    const dob = user.dob.date.substring(0, 10).replace(dobRegEx, "$3/$2/$1");
    const html = `
        <div class="card ${user.name.first.toLowerCase()}-${user.name.last.toLowerCase()} visible ">
            <div class="card-img-container">
                <img class="card-img" src="${
                  user.picture.large
                }" alt="profile picture for ${fullName}">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${fullName}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state
    }</p>
            </div>
        <div class="modal-container">
        <div class="modal" data-name ="${user.name.first.toLowerCase()}-${user.name.last.toLowerCase()}" >
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${
                  user.picture.large
                }" alt="profile picture for ${fullName}">
                <h3 id="name" class="modal-name cap">${fullName}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">${phone}</p>
                <p class="modal-text">${user.location.street.number} ${
      user.location.street.name
    }, ${user.location.city}, ${user.location.state} ${
      user.location.postcode
    }</p>
                <p class="modal-text">Birthday: ${dob}</p>
            </div>
        </div>
       
        
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>
        </div>
        
    `;
    gallery.insertAdjacentHTML("beforeend", html);
  });
}
// adds the search bar
const searchDiv = document.querySelector('.search-container')
const searchHtml = `<form class='search-form' action="#" method="get">
<input type="search" id="search-input" class="search-input" placeholder="Search...">
<button type="button" class="clear-search-btn">x</button>
<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`
searchDiv.insertAdjacentHTML("beforeend", searchHtml)
/***
 * API calls
 */

getData("https://randomuser.me/api/?nat=us&results=12")
  .then((data) => generateUserCard(data))
  .catch(err => console.error("There was a problem with the request: ", err))
  /***
   * Event Listeners
   */

  .finally(() => {
    //adds event listener to the cards
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const target = e.target.closest(".card");
        target.querySelector(".modal-container").classList.toggle("show-modal");
      });
    });
    //adds event listener to the modal buttons
    const modalButtons = document.querySelectorAll("button");
    modalButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        if (
          e.target.tagName === "BUTTON" &&
          e.target.className === "modal-close-btn"
        ) {
          e.target.parentElement.classList.toggle("show-modal");
        } else if (
          e.target.tagName === "BUTTON" &&
          e.target.className === "modal-prev btn"
        ) {
          const currentCard = Array.from(document.querySelectorAll('.visible'))
          const currentCardIndex = currentCard.indexOf(
            e.target.closest(".card")
          );
          if (currentCardIndex > 0) {
            const prevCard = currentCard[currentCardIndex - 1];
            prevCard
              .querySelector(".modal-container")
              .classList.toggle("show-modal");
          }
        } else if (
          e.target.tagName === "BUTTON" &&
          e.target.className === "modal-next btn"
        ) {
          const currentCard = Array.from(document.querySelectorAll('.visible'))
          const currentCardIndex = currentCard.indexOf(
            e.target.closest(".card")
          );
          if (currentCardIndex < currentCard.length - 1) {
            const nextCard = currentCard[currentCardIndex + 1];
            nextCard
              .querySelector(".modal-container")
              .classList.toggle("show-modal");
          }
        }
      });
    });
  });

//search bar event listener 

const searchForm = document.querySelector('.search-form')
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchInput = document.querySelector('#search-input')
    let searchString = searchInput.value.toLowerCase().replace(/ /, '-')
    //resets the search if user submits an empty string
    if (searchString === ""){
      const usersDisplayed = Array.from(document.querySelectorAll('.card'))
      usersDisplayed.forEach(user => {
        user.removeAttribute("style")
        if (!user.classList.contains('visible')){
          user.classList.add("visible")
        }
       
      })
     
        
      
      if (document.querySelector('.no-match')){
       document.querySelector('.no-match').remove()
    }
    } else {
      const usersDisplayed = Array.from(document.querySelectorAll('.card'))
      const searchHits = []
      usersDisplayed.forEach(user => {
          userName = user.querySelector('.modal').dataset.name
          if (!userName.includes(searchString)) {
              user.style.display ='none'
              user.classList.remove('visible')
              
          } else{
              searchHits.push(user)
              
          }
          
      })
    
      if (searchHits.length === 0 && !document.querySelector('.no-match')){
        const gallery = document.getElementById("gallery")
        const html = `<div class="no-match">No users matches your search, please try again!</div>`
        gallery.insertAdjacentHTML("beforeend", html) 
      }
      
     
  }
})

