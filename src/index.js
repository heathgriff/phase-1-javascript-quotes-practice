// * Populate page with quotes with a `GET` request to
//   `http://localhost:3000/quotes?_embed=likes`. The query string in this URL tells 
//   `json-server` to include the likes for a quote in the JSON of the response. You
//   should not use this query string when creating or deleting a quote.

const populateURL = `http://localhost:3000/quotes?_embed=likes`
const createOrDeleteURL = `http://localhost:3000/quotes`
const likesURL = `http://localhost:3000/likes`

const quoteList = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")

document.addEventListener('DOMContentLoaded', () => {
    populateQuotes()

})

function populateQuotes() {
    fetch(populateURL)
    .then(resp => resp.json())
    // .then(data => console.log(data))
    .then(quotes => quotes.forEach(quote => renderQuote(quote)))
}

function createQuote(quoteObj){
  fetch(createOrDeleteURL, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(quoteObj)
  })
  .then(res => res.json())
  .then(newQuote => appendNewQuote(newQuote))
}

function appendNewQuote(newQuote) {
  //console.log("hiiiii")
  quoteList.innerHTML += `      
  <li class='quote-card'>
     <blockquote data-id=${newQuote.id} class="blockquote">
      <p class="mb-0">${newQuote.quote}</p>
      <footer class="blockquote-footer">${newQuote.author}</footer>
       <br>
      <button class='btn-success'>Likes: <span class="likes-span">0</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
   </li>`
}

function renderQuote(quote) {
    // const quoteList = document.querySelector("#quote-list")
    //const li = 
    //console.log(quoteList)
    // using "+=" in this case ensures that all quotes load, instead of refreshing every time
    quoteList.innerHTML += `      
    <li class='quote-card'>
       <blockquote data-id=${quote.id} class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
         <br>
        <button class='btn-success'>Likes: <span class="likes-span">${quote.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
     </li>`
}

newQuoteForm.addEventListener("submit", gatherFormData)

quoteList.addEventListener('click', handleQuote)

function gatherFormData(e) {
  e.preventDefault()
  //console.log("hi")
  //console.log(newQuoteForm)
  //debugger;

  const author = e.target.author.value
  const quote = e.target.quote.value
  const quoteObj = {quote, author}

  createQuote(quoteObj)

}

function handleQuote(e) {
  //console.log("helloooo")
  if (e.target.className === "btn-danger"){
    const quoteId = e.target.parentElement.dataset.id
    fetch(`${createOrDeleteURL}/${quoteId}`, {
      method: "DELETE",
      headers: {'Content-Type': 'application/json'},
    })
    e.target.parentElement.parentElement.remove()
  } else if (e.target.className === "btn-success"){
    const quoteId = parseInt(e.target.parentElement.dataset.id)
    likeObj = {quoteId: quoteId}
    fetch(likesURL, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(likeObj)
    }) 
    let currentLikes = parseInt(e.target.querySelector(".likes-span").innerText)
    currentLikes++
    e.target.querySelector(".likes-span").innerText = currentLikes

  }
}

// newQuoteForm.addEventListener("submit", gatherFormData)

// ```html
// <li class='quote-card'>
//   <blockquote class="blockquote">
//     <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
//     <footer class="blockquote-footer">Someone famous</footer>
//     <br>
//     <button class='btn-success'>Likes: <span>0</span></button>
//     <button class='btn-danger'>Delete</button>
//   </blockquote>
// </li>
// ```