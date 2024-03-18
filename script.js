let currentsong = new Audio()
let songs;
let currfolder


function formatTime(seconds) {
    if (seconds == NaN) {
        return "00 : 00"
    }
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}


let getsongs = async (folder) => {
    currfolder = folder;
    let a = await fetch(`/songs/${folder}/`);
    console.log(a)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let atag = div.getElementsByTagName("a");
    songs = []
    for (let i = 0; i < atag.length; i++) {
        const element = atag[i];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let ul = document.querySelector(".songs-list").getElementsByTagName("ul")[0]
    ul.innerHTML=""
    for (let song of songs) {
        ul.innerHTML = ul.innerHTML + `<li>
        <img class="invert" src="music.svg">
        <div class="info">
            <div class="song-name">${song} </div>
        </div>
        <div class="play-button">
            <img class="invert pointer" src="play.svg">
        </div>
    </li>`
    }
        //add event listner to each list item
        Array.from(document.querySelector(".songs-list").getElementsByTagName("li")).forEach(e => {
            let play = e.querySelector(".pointer")
            play.addEventListener("click", () => {
                let changebtn = document.querySelector(".song-button").querySelectorAll("img")[1];
                playmusic(e.querySelector(".info").firstElementChild.innerHTML, true)
                changebtn.src = "pause.svg";
    
            });
    
        })
    
    return songs;
}
let playmusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track
    if (pause) {
        currentsong.play()
    }
    document.querySelector(".song-desc").innerHTML = track
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".song-duration").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)} `
        document.querySelector(".circle").style.left = `${(currentsong.currentTime / currentsong.duration) * 100}%`
    })
}

let main = async () => {
    songs = await getsongs("songs/ncs")
    playmusic(songs[0])

    // adding previous button
    let previous = document.getElementById("previous")
    previous.addEventListener("click", (e) => {
        let index = songs.indexOf(currentsong.src.split(`/${currfolder}/`)[1])
        if (index > 0) {
            playmusic(songs[index - 1], true)
            changebtn.src = "pause.svg"
        }
    })

    // adding next button
    let next = document.getElementById("next")
    next.addEventListener("click", (e) => {
        let index = songs.indexOf(currentsong.src.split(`/${currfolder}/`)[1])
        if (index + 1 < songs.length) {
            playmusic(songs[index + 1], true)
            changebtn.src = "pause.svg"
        }
    })
    //automatic changing the song after current song ends
    currentsong.addEventListener("ended", () => {
        let index = songs.indexOf(currentsong.src.split(`/${currfolder}/`)[1])
        if (index + 1 < songs.length) {
            playmusic(songs[index + 1], true)
        }
        if (index + 1 == songs.length) {
            changebtn.src = "play.svg"
        }
    })


    // changing play button
    let changebtn = document.querySelector(".song-button").querySelectorAll("img")[1];
    changebtn.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            changebtn.src = "pause.svg"
        }
        else {
            currentsong.pause()
            changebtn.src = "play.svg"
        }
    })

    //toggling whit playbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.offsetWidth) * 100;
        document.querySelector(".circle").style.left = `${percent}%`
        currentsong.currentTime = (currentsong.duration * percent) / 100;
    })
    //changing the volume
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        let vol = e.target.value
        currentsong.volume = vol / 100;
    })

    document.querySelector(".mute").addEventListener("click", (e) => {
        currentsong.volume = 0;
        document.querySelector(".volume").getElementsByTagName("input")[0].value = 0
    })
    document.querySelector(".unmute").addEventListener("click", (e) => {
        currentsong.volume = 1;
        document.querySelector(".volume").getElementsByTagName("input")[0].value = 100
    })

    //adding functionality to hamburger
    document.querySelector(".hamburger").addEventListener("click", (e) => {
        document.querySelector(".left-side").style.left = "0%"
    })
    //adding functionality to hamburger
    document.querySelector(".cross").addEventListener("click", (e) => {
        document.querySelector(".left-side").style.left = "-120%"
    })

    let updatecard=async()=>{
        let x= await fetch(`/songs/`)
        let response=await x.text();
        let div= document.createElement("div")
        div.innerHTML=response;
        let cardcontainer=document.querySelector(".card-container")
        let anchor= div.getElementsByTagName("a");
        let arr= Array.from(anchor)
       
        for(let i=0;i<arr.length;i++){
            const e=arr[i];
            if(e.href.includes("/songs/")){
                let folder=e.href.split("/").slice(-2)[1]
                let xyz=await fetch(`/songs/${folder}/info.json`)
                let response=await xyz.json()
                cardcontainer.innerHTML=cardcontainer.innerHTML+` <div class="card" data-folder="${response.data}">
                <img src="/songs/${folder}/cover.jpeg" alt="">
                <h3>${response.heading}</h3>
                <p>${response.description}</p>
                <div class="play "><svg class="invert" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="35" height="35" fill="magenta">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                    <path d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z" stroke="white" fill="white" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
                
                </div>
            </div>`
            }
        }
     //loading folder dynamically
    Array.from(document.getElementsByClassName("card")).forEach((e)=>{
        e.addEventListener("click" , async(e)=>{
            console.log(e.currentTarget.dataset)
            getsongs(`songs/${e.currentTarget.dataset.folder}`)
        })
    })

    }
    updatecard()


}
main()
