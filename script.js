function showCustomAlert(message, type = "success") {
    const alertBox = document.getElementById('customAlert');
    alertBox.textContent = message;
    alertBox.className = `custom-alert ${type}`;
    alertBox.classList.add('show');
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
}

let fileData = [];
let tags = [];

const fileInput = document.getElementById('jsonFileInput');
const audioPlayer = document.getElementById('audio');
const playButton = document.getElementById('playButton');
const tagContainer = document.getElementById('tagContainer');
const currentSongLabel = document.getElementById('currentSong');

fileInput.addEventListener('change', (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = function (event) {
        try {
            fileData = JSON.parse(event.target.result);
            // Extract tags from songs
            tags = [...new Set(fileData.flatMap(song => song.tags))];
            createTagButtons();
            showCustomAlert("JSON file loaded successfully!", "success");
        } catch (e) {
            showCustomAlert("Error: Invalid JSON file.", "error");
        }
    };

    reader.onerror = function () {
        showCustomAlert("Error reading file.", "error");
    };

    reader.readAsText(file);
    fileInput.style.display = 'none';
});

function createTagButtons() {
    tagContainer.innerHTML = ''; // Clear previous tags
    tags.forEach(tag => {
        const tagButton = document.createElement('button');
        tagButton.classList.add('tag-button');
        tagButton.textContent = tag;
        tagButton.onclick = () => playSongsFromTag(tag);
        tagContainer.appendChild(tagButton);
    });
}

function playRandomTagSong() {
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    playSongsFromTag(randomTag);
}

function playSongsFromTag(tag) {
    const songsOfTag = fileData.filter(song => song.tags.includes(tag));
    const randomSongs = shuffleArray(songsOfTag);
    playPreviewAndSong(randomSongs);
}

// function playPreviewAndSong(songs) {
//     console.log(songs)
//     if (songs.length > 0) {
//         let songIndex = 0;

//         function playNextSong() {
//             if (songIndex >= songs.length) {
//                 return;
//             }

//             const song = songs[songIndex];
//             currentSongLabel.textContent = `Now Playing: ${song.title}`;

//             // Play preview first
//             let previewUrl = convertBASE64ToAudio(song.preview)
//             let songUrl = convertBASE64ToAudio(song.song);
//             playTheAudioPlayer(previewUrl)
//             audioPlayer.addEventListener("ended", (event) => {
//                 audioPlayer.onended = playTheAudioPlayer(songUrl)
//                 songIndex++;
//                 setTimeout(playNextSong, 1000);
//             });




//         }

//         playNextSong(); // Start playing the first song
//     }
// }

// function playTheAudioPlayer(audio) {
//     audioPlayer.src = audio;
//     audioPlayer.play();
//     return audioPlayer;

// }

function playPreviewAndSong(songs) {
    console.log(songs);
    if (songs.length > 0) {
        let songIndex = 0;

        function playNextSong() {
            if (songIndex >= songs.length) {
                return;
            }

            const song = songs[songIndex];
            currentSongLabel.textContent = `Now Playing: ${song.title}`;

            // Play preview first
            let previewUrl = convertBASE64ToAudio(song.preview);
            let songUrl = convertBASE64ToAudio(song.song);

            playTheAudioPlayer(previewUrl, function () {
                // Once preview ends, play the full song
                playTheAudioPlayer(songUrl);
            });

            songIndex++;
        }

        playNextSong(); // Start playing the first song
    }
}

function playTheAudioPlayer(previewUrl, callback) {
    // Set up audio player for preview
    audioPlayer.src = previewUrl;
    audioPlayer.play();

    // When preview ends, trigger callback to play full song
    audioPlayer.onended = function () {
        if (callback) callback(); // Callback to play the full song
    };
}
function convertBASE64ToAudio(base64Data, callback) {
    const audioData = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(audioData.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < audioData.length; i++) {
        uint8Array[i] = audioData.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(blob);
    return audioUrl;
}

// Shuffle function for randomizing the sequence of songs
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Initial random tag song play
document.getElementById('randomButton').addEventListener('click', playRandomTagSong);




// tags releted code
const toggleTagsButton = document.getElementById('toggleTagsButton');

// Function to toggle visibility of tagContainer
function toggleTagsVisibility() {
    if (tagContainer.style.display === 'none') {
        tagContainer.style.display = 'block';
        toggleTagsButton.textContent = 'Hide Tags';  // Change button text
    } else {
        tagContainer.style.display = 'none';
        toggleTagsButton.textContent = 'Show Tags';  // Change button text
    }
}

// Add event listener to the button
toggleTagsButton.addEventListener('click', toggleTagsVisibility);

// Optionally, if you want the tags hidden initially
tagContainer.style.display = 'none';


// dark mode
const darkModeToggleButton = document.getElementById('darkModeToggle');

// Check if dark mode is enabled in localStorage (for persistence)
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggleButton.textContent = '🌞';
}

// Function to toggle dark mode
function toggleDarkMode() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    if (isDarkMode) {
        document.body.classList.remove('dark-mode');
        darkModeToggleButton.textContent = '🌙';
        localStorage.setItem('darkMode', 'disabled');
    } else {
        document.body.classList.add('dark-mode');
        darkModeToggleButton.textContent = '🌞';
        localStorage.setItem('darkMode', 'enabled');
    }
}

// Add event listener to toggle dark mode on button click
darkModeToggleButton.addEventListener('click', toggleDarkMode);