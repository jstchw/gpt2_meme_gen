"use strict"

let counter = 0
let imageArray = []
const startTime = Date.now()

const themeToggleBtn = document.querySelector('#theme-toggle')
const menu = document.querySelector('.offcanvas')
let loadMoreInProgress = false
let topic, theme, mode
/*
ON STARTUP
*/

// A number of functions which will be executed one after another.
// Listeners for reactions should be added only after the images are loaded

// Getting the settings

getSettings().then(settings => {
    if(settings.theme === 'dark') {
        toggleTheme()
        theme = 'dark'
    } else {
        theme = 'light'
    }
    topic = settings.topic
    mode = settings.mode
}).then(loadMore)

displayElapsedTime()

// Check for the time spent in the app every minute, displayed in the menu
let intervalId = window.setInterval(function(){
  displayElapsedTime()
}, 60000);

/*
LISTENERS
 */
document.addEventListener('contextmenu', event => event.preventDefault())
themeToggleBtn.addEventListener('click', toggleTheme)

$('#catcher-topic').on('click', ev => {
    if(topic !== 'catcher' && !loadMoreInProgress) {
        selectTopic('catcher')
        $('.navbar-toggler').click()
    }
})
$('#alice-topic').on('click', ev => {
    if(topic !== 'alice' && !loadMoreInProgress) {
        selectTopic('alice')
        $('.navbar-toggler').click()
    }
})
$('#iliad-topic').on('click', ev => {
    if(topic !== 'the_iliad' && !loadMoreInProgress) {
        selectTopic('the_iliad')
        $('.navbar-toggler').click()
    }
})
$('#classic-mode').on('click', ev => {
    if(mode !== 'classic' && !loadMoreInProgress) {
        selectMode('classic')
        $('.navbar-toggler').click()
    }
})
$('#meme-mode').on('click', ev => {
    if(mode !== 'meme' && !loadMoreInProgress) {
        selectMode('meme')
        $('.navbar-toggler').click()
    }
})


// Special listener to load everything when user reaches the end of page
document.addEventListener('scroll',()=>{
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !loadMoreInProgress) {
        loadMore()
    }
})


// Load more function gets the array length and hides the button if there's nothing to load (shouldn't be a problem to a meme generator)
// When a button is clicked, the for loop appends an image from an array which is populated beforehand

async function loadMore() {
    let body = $('body')

    // THIS VARIABLE FIXES MULTIPLE NN GENERATIONS
    loadMoreInProgress = true
    if(theme === 'light') {
        console.log('spinner should appear')
        body.append('<div class="d-flex justify-content-center pb-4 spinner-container"><div class="spinner-border"></div></div>')
    }
    else if(theme === 'dark') {
        console.log('spinner should appear')
        body.append('<div class="d-flex justify-content-center pb-4 spinner-container"><div class="spinner-border text-light"></div></div>')
    }

    // IT HAS BEEN TESTED WITH DIFFERENT SAMPLE SIZES - 20, 40, 60, 70, 100, 200, 500, 1023 - 100 IS AN OPTIMAL SOLUTION - NOT TOO BIG TO TRUNCATE AND DOESN'T TAKE AN ETERNITY TO PROCESS


    // When the maxResult value is bigger or the modulus of it and the array length is not 0 -> endless scrolling problem
    // !!! ABSOLUTELY MUST  BE THE SAME AS THE NUMBER OF ARRAY LENGTH (MAY BE LESS THAN COUNT OF FILES, BUT NOT GREATER) !!!
    // CAUSES ISSUES IF GREATER
    let maxResult = 6

    await populateImageArray()

    if (mode === 'classic') {
        let object = await eel.generate_text(topic, 100, 6)()
        $('.spinner-container').remove()
        if(theme === 'light') {
            for (let i = 0; i < maxResult; i++) {
                $(".content").append(
                "<div><img class='append-img img-fluid pb-2' alt='Everything went wrong' src='" + imageArray[i].src + "'/></div>" +
                "<div class='container overflow-hidden'>" +
                    "<div class='row px-5 text-content' id='text_" + counter + "'>" + object[i] + "</div>" +
                    "<div class='row px-5'>" +
                        "<div class='col like' id='dolike_" + counter + "'>&#128077</div>" +
                        "<div class='col'></div>" +
                        "<div class='col dislike' id='dislike_" + counter + "'>&#128078</div>" +
                    "</div>" +
                "</div>")
                counter++
            }
        } else if(theme === 'dark') {
            for (let i = 0; i < maxResult; i++) {
                $(".content").append(
                "<div><img class='append-img img-fluid pb-2' alt='Everything went wrong' src='" + imageArray[i].src + "'/></div>" +
                "<div class='container overflow-hidden'>" +
                    "<div class='row px-5 text-content text-light' id='text_" + counter + "'>" + object[i] + "</div>" +
                    "<div class='row px-5'>" +
                        "<div class='col like' id='dolike_" + counter + "'>&#128077</div>" +
                        "<div class='col'></div>" +
                        "<div class='col dislike' id='dislike_" + counter + "'>&#128078</div>" +
                    "</div>" +
                "</div>")
                counter++
            }
        }
    } else if (mode === 'meme') {
        $('.spinner-container').remove()
        for (let i = 0; i < maxResult; i++) {
                $(".content").append(
                "<div><img class='append-img img-fluid pb-2' alt='Everything went wrong' src='" + imageArray[i].src + "'/></div>" +
                "<div class='container overflow-hidden'>" +
                    "<div class='row px-5'>" +
                        "<div class='col like' id='dolike_" + counter + "'>&#128077</div>" +
                        "<div class='col'></div>" +
                        "<div class='col dislike' id='dislike_" + counter + "'>&#128078</div>" +
                    "</div>" +
                "</div>")
                counter++
            }
    }


    $('.like').click(selectReaction)
    $('.dislike').click(selectReaction)
    //currentIndex += maxResult
    loadMoreInProgress = false
}

// Function to populate the array with images located in a specific folder
// The loop iterates through numbers and loads an image to an array slot with an according number
async function populateImageArray() {

    let isEmpty = Boolean(imageArray.length === 0)

    if(mode === 'classic') {
        if(isEmpty) {
            for(let i = 0; i < await eel.count_files(`www/img/${topic}`)(); i++) {
                imageArray[i] = new Image()
                imageArray[i].src = `img/${topic}/${topic + i}.jpg`
                shuffleArray(imageArray)
            }
        } else {
            shuffleArray(imageArray)
        }
    } else if(mode === 'meme') {
        imageArray = []
        await eel.create_meme(topic, 6)()
        for (let i = 0; i < await eel.count_files(`www/img/memes/${topic}`)(); i++) {
            imageArray[i] = new Image()
            imageArray[i].src = `img/memes/${topic}/${topic + i}.jpg`
            shuffleArray(imageArray)
        }
    }
}

function displayElapsedTime() {
    // Getting the current time
    let currentTime = Date.now()
    // Calculating the time and converting it to minutes from milliseconds

    let timeSpent = Math.trunc((currentTime - startTime) / 60000)
    if(timeSpent === 1) {
        document.querySelector('#offcanvasNavbarTime').textContent = `Time spent: ${timeSpent.toString()} minute`
    } else {
        document.querySelector('#offcanvasNavbarTime').textContent = `Time spent: ${timeSpent.toString()} minutes`
    }

}

function toggleTheme() {
    let navbar = document.querySelector('.navbar')
    let dropdownMenu = document.querySelectorAll('.dropdown-menu')
    let offCanvasTitle = document.querySelectorAll('.offcanvas-title')
    let postText = document.querySelectorAll('.text-content')
    let spinner = document.querySelector('.spinner-border')

    // Then toggle (add/remove) the .dark-theme class to the body
    document.body.classList.toggle('dark-theme')

    // Toggling the navbar
    navbar.classList.toggle('bg-dark')
    navbar.classList.toggle('bg-light')
    navbar.classList.toggle('navbar-dark')
    navbar.classList.toggle('navbar-light')

    // Toggling the menu color
    document.querySelector('.btn-close').classList.toggle('btn-close-white')
    document.querySelector('.offcanvas').classList.toggle('bg-dark')

    offCanvasTitle.forEach(el => {
        el.classList.toggle('text-light')
    })

    dropdownMenu.forEach(el => {
        el.classList.toggle('dropdown-menu-dark')
    })

    postText.forEach(el => {
        el.classList.toggle('text-light')
    })

    if(spinner) spinner.classList.toggle('text-light')

    // If the body tag contains dark-theme then change the dark theme settings
    if(document.body.classList.contains('dark-theme')) {
        theme = 'dark'
        setSettings('theme', 'dark')
    }
    else if(!(document.body.classList.contains('dark-theme'))){
        theme = 'light'
        setSettings('theme', 'light')
    }


}

async function selectTopic(topic_par) {
    $('.content').empty()
    imageArray = []
    topic = topic_par
    setSettings('topic', topic)
    await loadMore()
}

async function selectMode(mode_par) {
    $('.content').empty()
    imageArray = []
    mode = mode_par
    setSettings('mode', mode)
    await loadMore()
}

/*
Just an adaptation of the Eel functions in JS
 */
function setSettings(key, value) {
    eel.set_settings(key, value)()
}

async function getSettings() {
    return await eel.get_settings('base/settings.json')()
}

async function selectReaction() {
    let id = (this.id).replace(/\D/g, "");
    let like_pressed, dislike_pressed
    let postText
    if (mode === 'classic') postText = document.querySelector('#text_' + id).innerHTML
    else if (mode === 'meme')  postText = 'Meme post (WIP)'

    like_pressed = document.querySelector('#dolike_' + id).classList.contains('reaction-selected')
    dislike_pressed = document.querySelector('#dislike_' + id).classList.contains('reaction-selected')


    if(!like_pressed && this.id.includes('dislike')) {
        document.querySelector('#' + this.id).classList.add('reaction-selected')
        if(!dislike_pressed) {
            console.log('dislike done')
            await eel.react(id, 0, topic, postText)()
        }
    } else if(!dislike_pressed && this.id.includes('dolike')) {
        document.querySelector('#' + this.id).classList.add('reaction-selected')
        if(!like_pressed) {
            console.log('like done')
            await eel.react(id, 1, topic, postText)()
        }
    }

    if(dislike_pressed && this.id.includes('dislike')) {
        document.querySelector('#' + this.id).classList.remove('reaction-selected')
        console.log('dislike undone')
        await eel.unreact(id)
    } else if(like_pressed && this.id.includes('dolike')) {
        document.querySelector('#' + this.id).classList.remove('reaction-selected')
        console.log('like undone')
        await eel.unreact(id)
    }
}

function shuffleArray(array) {
    let currentIndex = array.length,  randomIndex
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]]
    }
    return array
}