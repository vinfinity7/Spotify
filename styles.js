


var clientId = "ec36991b81e843dba2e4ee10bad298eb";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    const playlist = await fetchPlaylist(accessToken);
    const artists = await fetchArtist(accessToken);
    populateUI(profile);
    populatexI(artists,playlist);
    logger(playlist);
}

// document.getElementById("pipas").addEventListener("click", redirectToAuthCodeFlow(clientId));



$(".option").hover(function () {
    $(".option").removeClass("active");
    $(this).addClass("active");

});


async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/index.html||https://vinfinity7.github.io/Spotify/");
    params.append("scope", "user-read-private user-read-email user-read-playback-state user-top-read playlist-read-private user-read-recently-played");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}


async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/index.html||https://vinfinity7.github.io/Spotify/");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function fetchPlaylist(token) {
    const result = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}
async function fetchArtist(token) {
    const result = await fetch("https://api.spotify.com/v1/artists?ids=4fEkbug6kZzzJ8eYX6Kbbp%2C4YRxDV8wJFPHPTeXepOstw%2C6eUKZXaKkcviH0Ku9w2n3V", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}


function populateUI(profile) {
    console.log(profile);

    const bannerCont = document.getElementById('profile');



    const div = document.createElement('div');

    div.innerHTML = `
    <br><br><br><br>
    <figure class="snip1336">
    <img src="${profile.images[0].url}" class="samp" />
    <figcaption>
    <img src="spotify-logo.png" alt="profile-sample4" class="profile" />
    <h2><span>logged in as</span>${profile.display_name}</h2>
    <p>Email id is used as ${profile.email} </p>
    <a href="${profile.external_urls.spotify}" class="follow">SPOTIFY</a>
    <a href="https://vinfinity7.github.io/Portfolio_Week0/page.html" class="info">Portfolio</a>
    </figcaption>
    </figure>
    <br><br><br><br>
    `;
    div.className = "banner-content container";



    bannerCont.append(div);

}


function populatexI(artists,playlist) {
    const arts = document.getElementById('news');
    const div2 = document.createElement('div');
    div2.innerHTML = `<br><br><br><br>
    <div class="options">
    <div class="option " style="--optionBackground:url(${artists.artists[0].images[0].url});">
    <div class="shadow"></div>
    <div class="label">
    <div class="icon">
    <a href="${artists.artists[0].external_urls.spotify}">  <i class="fas fa-walking"></i></a>
      </div>
      <div class="info">
      <div class="main">${artists.artists[0].name}</div>
      <div class="sub">${artists.artists[0].genres[0]},${artists.artists[0].genres[1]}</div>
      </div>
      </div>
      </div>
      <div class="option" style="--optionBackground:url(${playlist.items[0].images[0].url});">
      <div class="shadow"></div>
      <div class="label">
         <div class="icon">
          <a href="${playlist.items[0].href}" <i class="fas fa-snowflake"></i></a>
         </div>
         <div class="info">
            <div class="main">${playlist.items[0].name} </div>
            <div class="main">by ${playlist.items[0].owner.display_name}</div>
            <div class="sub">${playlist.items[0].description}</div>
         </div>
      </div>
   </div>
   <div class="option active " style="--optionBackground:url(${artists.artists[1].images[0].url});">
   <div class="shadow"></div>
   <div class="label">
   <div class="icon">
   <a href="${artists.artists[1].external_urls.spotify}">  <i class="fas fa-walking"></i></a>
     </div>
     <div class="info">
     <div class="main">${artists.artists[1].name}</div>
     <div class="sub">${artists.artists[1].genres[0]},${artists?.artists[1].genres[1]}</div>
     </div>
     </div>
     </div>
     <div class="option" style="--optionBackground:url(${playlist.items[2].images[0].url});">
     <div class="shadow"></div>
     <div class="label">
        <div class="icon">
         <a href="${playlist.items[2].href}" <i class="fas fa-snowflake"></i></a>
        </div>
        <div class="info">
           <div class="main">${playlist.items[2].name} </div>
           <div class="main">by ${playlist.items[2].owner.display_name}</div>
           <div class="sub">${playlist.items[2].description}</div>
        </div>
     </div>
  </div>
   <div class="option" style="--optionBackground:url(${artists.artists[2].images[0].url});">
   <div class="shadow"></div>
   <div class="label">
   <div class="icon">
   <a href="${artists.artists[2].external_urls.spotify}">  <i class="fas fa-walking"></i></a>
     </div>
     <div class="info">
     <div class="main">${artists.artists[2].name}</div>
     <div class="sub">${artists.artists[2].genres[0]},${artists?.artists[2].genres[1]}</div>
     </div>
     </div>
     </div>
      `
      div2.className=" conetxt ";
    arts.append(div2);
}


function logger(playlist) {
    console.log(playlist);
}




$(".hover").mouseleave(
    function () {
        $(this).removeClass("hover");
    }
);

