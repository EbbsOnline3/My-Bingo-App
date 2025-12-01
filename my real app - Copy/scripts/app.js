const playerNumOptions = document.querySelector('#num-players-popup');
const playerNamesInput = document.querySelector('#name-of-players');
const combinationsSelector = document.querySelector('#combinations-selector');
const table = document.querySelector('.js-individual-cell');
const individualDivs = document.querySelectorAll('.js-individual-player-div');
const timerDisplay = document.querySelector('.timer-counter');
const timerSelector = document.querySelector('#timer-selector');
const setTimerButton = document.querySelector('#set-timer-button');
const setupButton = document.querySelector('#start-game-button');
const usedLettersContainer = document.querySelector('.used-letters');
const currentAlphabetContainer = document.querySelectorAll('.current-alphabet');
const error = document.querySelector('.error-message');
const errorText = document.querySelector('.error-message-text');
const savePlayerOptionBtn = document.querySelector('.save-player-option-button');
const mainSelectors = document.querySelector('.js-main-content-selectors');
const playerInputCategoriesAnswers = document.querySelectorAll('.player-input-category');
const endGameButton = document.querySelector('#end-game-button');
const timerCounter = document.querySelector('.timer-counter');
const rulesButton = document.querySelector('#rules-button');
const closeRulesButton = document.querySelector('#close-rules-btn');
const closeRulesTopButton = document.querySelector('.fa-square-xmark');
const ruleOverlay = document.querySelector('#rule-div');
const ruleContainer = document.querySelector('.rules');
const resetButton = document.querySelector('#reset-button');
const nameInputDiv = document.querySelector('.name-input-div')
const nameInput = document.querySelector('#name-of-players')
const nameInputBtn = document.querySelector('.submit-names')
// const playerAnswersInput = document.querySelector(`#player-input-${i}`);
const customSelectionDiv = document.querySelector('#js-custom-selection');
const customInput = document.querySelector('#custom-combination-input');
const customInputBtn = document.querySelector('.custom-combination-button');
const displayDiv = document.querySelector('.player-contents');
const bingoStopBtn = document.querySelectorAll('.bingo-stop-button');
const formBody = document.querySelector('.form');
const userNameDisplay = document.querySelector('.profile-name');
const profilePictureInput = document.querySelector('#profile-picture');
const originalPicture = document.querySelector('#original-profile-picture');
const playerStopButton = document.querySelector('.js-player-stop-button');
const showScoreBoardButton = document.querySelector('#show-score-board-button');
const closeDialogBoardButton = document.getElementById('close-scoreboard-button');
const showDialogScoreBoardDiv = document.querySelector('.score-board');



const dialog = document.getElementById('score-board-dialog');
showScoreBoardButton.addEventListener('click', () => {
    showDialogScoreBoardDiv.style.display = 'block';
    dialog.showModal();
});
closeDialogBoardButton.addEventListener('click', () => {
    showDialogScoreBoardDiv.style.display = 'none';
    dialog.close();
})




displayDiv.style.display = 'none';
endGameButton.style.display = 'none';
customSelectionDiv.style.display = 'none';

let players = [];
let combinations = [];
let previousLetters = [];
let randomLetters = [];
let errorTimeoutId = null;
let userNames = [];
let remainingTime = 0;
localStorage.getItem('userNames', JSON.stringify(userNames));

/* Error Handling */
function showError(message) {
  errorText.textContent = message;
  error.style.display = 'block';
  clearTimeout(errorTimeoutId);
  errorTimeoutId = setTimeout(() => {
    error.style.display = 'none';
    errorText.textContent = '';
  }, 3000);
}


function setPlayerNames() {
    if(nameInputValue === ''){
        playerNumOptions.style.display = 'none'
        saveOptionBtn.style.display = 'none'
    }
}

nameInputBtn.addEventListener('click', () => {
    const names = nameInput.value.split(',').map(n => n.trim()).filter(n => n);
    if(names.length !== players.length){
        showError(`Please enter exactly ${playerNumOptions.value} names separated by commas.`);
        return;
    }
    players = names.map(name => ({ name, currentLetter: 'A' }));
    nameInputDiv.style.display = 'none';
})


savePlayerOptionBtn.addEventListener('click', () => {
    const numberofPlayers = parseInt(playerNumOptions.value);
    players = Array.from({ length: numberofPlayers }, (_, i) => ({
        name: `Player ${i + 1}`,
        currentLetter: 'A'
    }));
    nameInputDiv.style.display = 'flex';
    playerNumOptions.style.pointerEvents = 'none';
    savePlayerOptionBtn.style.pointerEvents = 'none';
});

function setUpCombinations(){
        // console.log(e)
        const option = combinationsSelector.value;
        if(option === 'Choose below'){
            return
        }
        else if (option === 'Custom') {
            
            customSelectionDiv.style.display = 'flex';
            combinationsSelector.style.display = 'block';

            customInputBtn.addEventListener('click', () => {
                const customInputValue = customInput.value;
                combinationsSelector.value = 'Choose below';
                if(customInput.value === ''){
                    showError('Enter categories eg. Animals, Cities...')
                    
                    combinations = [];
                    return;
                }else{
                    combinations = customInputValue.split(',').map(customValues => customValues.trim());
                    customInput.value = ''   
                    customSelectionDiv.style.display = 'none';
                    combinationsSelector.style.display = 'flex'
                }
                console.log(combinations);
            })
        }
        
        else{
            combinations = combinationsSelector.value.split(',').map(combination => combination);
        } 
}
combinationsSelector.addEventListener('click', () => {
    setUpCombinations();
});


/* Timer */
let MAX_TIME = 120;
let intervalId;
let countdown = 1;
const setTimerBtn = document.querySelector('#set-timer-button');

let time = parseInt(timerSelector.value);
function timerSet(time) {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        time--;
        playerInputCategoriesAnswers.forEach(input => {
                input.setAttribute('inert', true);
            });
        if (time > 0 ? time : time === 1) {
            timerDisplay.textContent = `Time left: ${time}s`;
        } 
        else if (time <= 10 && time > 0) {
            timerDisplay.style.color = 'white'
            clearInterval(intervalId);
        }
        else if (time === 0) {
            clearInterval(intervalId);
            timerDisplay.textContent = 'Time up!';
            timerDisplay.style.color = 'red';
            endGameButton.style.display = 'none';
            lockAllPlayerPanels();
        }
    }, 1000);
}
timerSet(time)
// setTimerBtn.addEventListener('click', () => {
//     const time = parseInt(timerSelector.value);
//     console.log(time)
//     if (typeof time !== 'number' || isNaN(time) || time < 5 || time > MAX_TIME) {
//         showError(`Please enter a valid time (1-${MAX_TIME} seconds)`);
//         return;
//     }
//     if (time > MAX_TIME) {
//         error.textContent = `Max time is ${MAX_TIME} seconds`;
//         return;
//     }
//     else if (time === 1) {
//         timerDisplay.textContent = 'Time up!';
//         clearInterval(intervalId);
//     }
// })
localStorage.getItem('userNames', JSON.stringify(userNames));
// console.log(localStorage.getItem('userNames', JSON.stringify(userNames)))
let isGameStarted = false;

/* Combinations */
function setUpGame(){
    if (timerDisplay === 0 && timerDisplay.textContent === 'Time up!' ){
        showError("Cannot start")
    }
    if (!isGameStarted) {
        if(combinations.length < 1 && players.length < 1 || (combinations.length < 1 && players.length > 0) || (combinations.length > 0 && players.length < 1)){
            showError('Please select at least one combination or at least one players.');
            return;
        }
        if (timerSelector.value < 5 || timerSelector.value >120){
            showError(`Please enter a valid time (5-${MAX_TIME} seconds)`);
            return;
        }
        else if (nameInput.value === ''){
            showError('Select Number of Players and Fill in Player Names');
            return
        }
        else if (time < 5 && time > MAX_TIME && timerSelector.value < 5) {
            showError(`Please enter a valid time (5-${MAX_TIME} seconds)`);
            return;
        }
        isGameStarted = true;
        setupButton.textContent = 'Next Round';
        enableAllPlayerPanels()
    }
    
    else if (isGameStarted) {
        rulesButton.style.display = 'none';
        showScoreBoardButton.style.display = "none"
        if (time > 0 && timerDisplay.textContent !== 'Time up!') {
            showError('Please end the current round before starting the next one.');
            rulesButton.style.display = 'none';
            showScoreBoardButton.style.display = "none"
            return;
        }
        else if(previousLetters.length === 26){
            showError('All letters have been used! Please reset the game to start over.');
            setupButton.textContent = 'Start Round';
            table.innerHTML = '';
            showDialogScoreBoardDiv.style.display = 'flex'
            dialog.showModal();
            mainSelectors.style.display ="flex"
            return;
        }
        else{
            setupButton.textContent = 'Next Round';
            table.innerHTML = '';
        }
        
    }
}

function checkTimerStatus(){
    if(isGameStarted && timerDisplay !== 0){
        showScoreBoardButton.style.display ='none'
        rulesButton.style.display ='none'
    }
    else {
        showScoreBoardButton.style.display ='flex'
        rulesButton.style.display ='flex'
    }
}

function runPlayerSection(time){
    if (timerDisplay.textContent ==='Time up!' ){
        checkTimerStatus()
        setUpCombinations();
        timerSet(time);
        setIndividualCells();
        displayDiv.style.display = 'flex';
        mainSelectors.style.display = 'none';
        timerDisplay.style.color = 'white';
        endGameButton.style.display = 'flex';
    }
}

setupButton.addEventListener('click', (e) => {
    let time = parseInt(timerSelector.value, 10) || 10;
    setUpGame()
    runPlayerSection(time)
});

// Rules Scripts
rulesButton.addEventListener('click', () => {
    ruleOverlay.style.display = 'flex'; // I will want to use opacity instead of display
    ruleContainer.showModal();
});

closeRulesTopButton.addEventListener('click', () => { 
    ruleOverlay.style.display = 'none'; 
    ruleContainer.close() 
});

closeRulesButton.addEventListener('click', () => {
    ruleOverlay.style.display = 'none'; // I will want to use opacity instead of display
    ruleContainer.close()
});

function handleRules(){
    if (!formBody){
        window.style.pointerEvents = "none"
    }
}


function randomLettersFunction(){
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    if(previousLetters.length === letters.length){
        showError('All letters have been used!');
        return;
    }
    else if (previousLetters.includes(randomLetter)){
        return randomLettersFunction();
    }
    else{
        // displayDiv.style.display = 'flex';
        // currentAlphabetContainer.forEach(container => {
        //     container.textContent = `Current Letter: ${randomLetter}`;
        // });
        previousLetters.push(randomLetter);
        usedLettersContainer.textContent = previousLetters.join(', ');
        return randomLetter;
    }
}



/* Reset Game */
function resetGame(){
    if (!isGameStarted) { showError('No data to reset. Game has not started yet.'); return; }
    players = [];
    combinations = [];
    previousLetters = [];
    usedLettersContainer.textContent = '';
    timerCounter.textContent = '';
    setupButton.removeAttribute('disabled'); 
    table.innerHTML = '';
    timerDisplay.textContent = '';
    timerDisplay.style.backgroundColor = 'transparent'
    clearInterval(intervalId);
    mainSelectors.style.display = 'flex';
    playerNumOptions.style.pointerEvents = 'all';
    savePlayerOptionBtn.style.pointerEvents = 'all';
    playerNumOptions.value = '1';
    combinationsSelector.value = 'Choose below';
    nameInputDiv.style.display = 'none';
    nameInput.value = '';
    const customInput = document.querySelector('#custom-combination-input');
    customSelectionDiv.style.display = 'none';
    customInput.value = '';
    timerDisplay.style.color = 'white';
    setupButton.textContent = 'Start Game';
    displayDiv.style.display = 'none';
    endGameButton.style.display = 'none';
    timerCounter.textContent = 'Time up!';
    showScoreBoardButton.style.display ='flex'
    rulesButton.style.display ='flex'
    isGameStarted = false;
}
resetButton.addEventListener('click', () => {
    resetGame();
});

function allInputsFilledInPanel(panel) {
  const inputs = panel.querySelectorAll('.player-input-category');
  if (!inputs || inputs.length === 0) return false;
  return Array.from(inputs).every(i => i.value.trim() !== '');
}

function setIndividualCells(){
    let currentLetter = randomLettersFunction();
    if (!currentLetter) return;
    let individualCategories = combinations.map((combination, i) => `
        <div class="categories">
            <label for="player-input-${i}">${combination}:</label>
            <input type="text" name="player-input-${i}" placeholder="write here..." class='player-input-category' id="player-input-${i}">
        </div>
    `).join('');
    players.forEach((player, index) => {
        
        let html = `
            <div class="individual-player-div-container js-individual-player-div-container">
                <div class="individual-player-div js-individual-player-div">
                    <div class="player-name">
                        <p class="player-name-text">${player.name}</p>
                        <div class="current-alphabet">Current Letter: ${currentLetter}</div>
                    </div>
                    <div class="displayed-combinations">
                        ${individualCategories}
                    </div>
                    <!--<div class="game-ended-div">
                    <button class="start-next-round">Next round</button>
                    <button class="start-next-round">Reset</button>
                    <button class="start-next-round">Bingo Stop</button>
                    </div>-->
                    </div>
                    <div class="player-stop-button js-player-stop-button">
                        <button type="submit" class="bingo-stop-btn" data-index="${index}" onClick = {} id="bingo-stop-button">STOP</button>
                    </div>
                </div>
            </div>
            `
            table.innerHTML += html;
            // console.log(currentLetter)
        });
        // attach listeners for newly-created inputs & buttons
        
        // attach stop button handlers
        const stopBtns = table.querySelectorAll('.bingo-stop-btn');
        stopBtns.forEach(btn => {
            btn.addEventListener('click', onBingoStopClick);
            // initialize disabled state
            // attachInputListeners();
            btn.disabled = true;
        });

        // ensure all inputs are enabled at round start
        enableAllPlayerPanels();
}

    
/* End Round by displaying the mainSelectors and add disable to idividual buttons*/
function callEndGame() {
    // time = 0
    if (!isGameStarted) {
        showError('Game has not started yet.');
        return;
    };
    clearInterval(intervalId);
    timerCounter.textContent = 'Time up!';
    mainSelectors.style.display = 'flex';
    const playerPanels = table.querySelectorAll('.individual-player-div');
    if (playerPanels) {
        playerPanels.forEach(div => {
            div.classList.add('diabled');
        });
    }
}
endGameButton.addEventListener('click', () => {
    callEndGame();
    lockAllPlayerPanels();
    rulesButton.style.display = 'flex';
});


// Handler when a player clicks their STOP button
function onBingoStopClick(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    if (!isGameStarted) {
        showError('Game has not started yet.');
        return;
    }
    if (remainingTime <= 0) {
        showError('Time is already up. Cannot stop now.');
        return;
    }

    // find the player panel for this button
    const panel = btn.closest('.individual-player-div');
    if (!panel) {
        showError('Cannot determine player panel.');
        return;
    }

    // Ensure all inputs in this panel are filled
    if (!allInputsFilledInPanel(panel)) {
        showError('Please fill all fields before stopping.');
        return;
    }

    // Conditions satisfied: lock all input panels and end the round
    lockAllPlayerPanels();
    clearInterval(intervalId);
    timerDisplay.textContent = 'Round Ended';
    timerDisplay.style.color = 'white';

    // visually indicate round ended and prepare Start button for next round
    setupButton.textContent = 'Next Round';

    // keep isGameStarted true so the flow knows we are mid-session and can start next round
    // (caller can decide whether to reset letters or not on next round)
    renderScoreboard();

}

// const stopBtns = table.querySelectorAll('.bingo-stop-btn');
//   stopBtns.forEach(btn => {
//     btn.addEventListener('click', onBingoStopClick);
//     // initialize disabled state
//     btn.disabled = true;
//   });


function enableAllPlayerPanels() {
  const playerPanels = table.querySelectorAll('.individual-player-div');
  playerPanels.forEach(panel => {
    panel.removeAttribute('inert');
    panel.style.pointerEvents = 'auto';
    panel.querySelectorAll('.player-input-category').forEach(i => i.disabled = false);
    const btn = panel.querySelector('.bingo-stop-btn');
    if (btn) btn.disabled = false;
  });
}

function attachInputListeners() {
    console.log('Bingo Stop Clicked');
    clearInterval(intervalId);
    callEndGame();
    lockAllPlayerPanels();
}


function lockAllPlayerPanels() {
  const playerPanels = table.querySelectorAll('.individual-player-div');
  playerPanels.forEach(panel => {
    // mark panel inert (note: inert polyfill may be required for older browsers)
    panel.setAttribute('inert', '');
    // also force no pointer events
    panel.style.pointerEvents = 'none';
    // disable inputs explicitly
    panel.querySelectorAll('.player-input-category').forEach(i => i.disabled = true);
    // disable stop button too
    const btn = panel.querySelector('.bingo-stop-btn');
    if (btn) btn.disabled = true;
  });
}

// function addBingoStopListeners(panel) {
//     const bingoStopBtn = panel.querySelectorAll('.bingo-stop-btn');
//     bingoStopBtn.forEach(btn => 
//         btn.addEventListener('click', () => {
//             const playerIndex = btn.dataset.index;
//             console.log(playerIndex)
//             console.log('Bingo Stop Clicked');
//             clearInterval(intervalId);
//             callEndGame();
//             lockAllPlayerPanels();
//             // Optionally, you can highlight the panel of the player who clicked stop
//             const playerPanels = table.querySelectorAll('.individual-player-div');
//             if (playerPanels[playerIndex]) {
//                 playerPanels[playerIndex].style.backgroundColor = '#4CAF50'; // Highlight color
//             }
//         })
//     );
// };
function renderScoreboard() {
  if (players.length === 0 || combinations.length === 0) {
    showError('No players or combinations available to render the scoreboard.');
    return;
  }

  // Create a scoreboard container
  const scoreboardContainer = document.createElement('div');
  scoreboardContainer.classList.add('scoreboard');

  // Render player scores
  players.forEach(player => {
    const playerScore = document.createElement('div');
    playerScore.classList.add('player-score');
    playerScore.textContent = `${player.name}: ${player.score}`;
    scoreboardContainer.appendChild(playerScore);
  });

  // Render combination scores
  combinations.forEach(combination => {
    const comboScore = document.createElement('div');
    comboScore.classList.add('combo-score');
    comboScore.textContent = `Combination ${combination.id}: ${combination.score}`;
    scoreboardContainer.appendChild(comboScore);
  });

  // Append the scoreboard to the main container
  mainContainer.appendChild(scoreboardContainer);
}

function updateBingoButtonsState() {
  // For each player panel, enable/disable that player's stop button
  const panels = table.querySelectorAll('.individual-player-div');
  panels.forEach(panel => {
    const btn = panel.querySelector('.bingo-stop-btn');
    if (!btn) return;
    const canClick = isGameStarted && remainingTime > 0 && allInputsFilledInPanel(panel);
    btn.disabled = !canClick;
  });
}

setInterval(() => updateBingoButtonsState(), 500);
// addBingoStopListeners();



const singInLink = document.querySelector('.Signin-link');
const signInButton = document.querySelector('.signup-btn');

const formLegend = document.querySelector('.sign-up-legend');
singInLink.addEventListener('click', ()=>{
    const userMail = document.querySelector('.usermail-div');
    const registerLabel = document.querySelector('.register-label');
    if (singInLink.textContent === 'Sign Up'){
        registerLabel.textContent = 'Already having an account?';
        singInLink.textContent = 'Sign In';
        userMail.style.display = 'flex';
        signInButton.textContent = 'Register';
        formLegend.textContent = 'Sign Up'
    }
    else if (singInLink.textContent === 'Sign In') {
        userMail.style.display = 'none';
        registerLabel.textContent = 'Not having an account?';
        singInLink.textContent = 'Sign Up';
        signInButton.textContent = 'Sign In';
        formLegend.textContent = 'Sign In'
    }
})



async function handleSubmit(){
    const userName = document.querySelector('#name').value;
    const userMail = document.querySelector('#email').value;
    // console.log(userName, userMail, userMailDiv)
    if (userMail === '' && userName === '') {
        showError("Fill all required fields!")
        return
    }
    else{
        if(formLegend.textContent === 'Sign Up'){
            console.log("Signed Up")
            userNames.push({
                name: `${userName}`,
                email: `${userMail}`,
                profilePicture: `${profilePictureInput}`
            });
        }else{
            if(userName === ''){
                userNames.push({
                name: `${userName}`,
                email: `${userMail}`,
                profilePicture: `${profilePictureInput}`
            });
            }
        }
        console.log(userNames)
        ruleOverlay.style.display="flex"
        ruleContainer.showModal();
        formBody.style.display = 'none'
        userNameDisplay.textContent = userName.length>10 ? `${userName.charAt([1])}`: `${userName}`;
        originalPicture.src = profilePictureInput.files[0] ? URL.createObjectURL(profilePictureInput.files[0]) : originalPicture.src;
        localStorage.setItem('userNames', JSON.stringify(userNames));
        console.log(profilePictureInput.files[0])
    }
}

signInButton.addEventListener('click', ()=>{
    handleSubmit()
    handleRules()
    // window.location.href = 'App.html';
})

// Header Changes
function userMenu(){
    if(userNames.name.length > 10){
        userNameDisplay.textContent = `${userNames.name.length < 10}...`
    }
}
const closeProfile = document.querySelector('.js-close-profile');
const profileDiv = document.querySelector('.profile');
userNameDisplay.addEventListener('click', ()=>{
    profileDiv.showModal()
})

closeProfile.addEventListener("click", ()=>{
    profileDiv.close()
})

const logoutLink = document.querySelector('.logout-link');
logoutLink.addEventListener('click', ()=>{
    const user = document.querySelector('#name');
    localStorage.removeItem('userNames');
    window.location.reload();
})

console.log(localStorage.getItem('userNames'))

