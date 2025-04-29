// Common Variables
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBody = document.getElementById('messages');
const chatOption = document.querySelector('.chat-option');
const voiceOption = document.querySelector('.voice-option');
const chatArea = document.getElementById('chatArea');
const voiceArea = document.getElementById('voiceArea');
const micButton = document.querySelector('.mic-button');
let bookData = [];
let characterData = [];

// Home Button - ONLY Avatar Click
document.getElementById("avatarHome").addEventListener("click", function() {
  window.location.href = "chat.html";
});



 document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  const themeOptions = document.getElementById('theme-options');
  const themeButtons = themeOptions.querySelectorAll('button');

  function changeTheme(theme) {
    // Set body class
    document.body.className = theme;
    // Save theme in localStorage
    localStorage.setItem('selectedTheme', theme);

    // Highlight the active theme button
    themeButtons.forEach(btn => {
      btn.classList.remove('active-theme');
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active-theme');
      }
    });
  }

  // Load saved theme when page loads
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) {
    changeTheme(savedTheme);
  }

  // Toggle theme option box visibility
  themeToggle.addEventListener('click', function(event) {
    event.stopPropagation();
    themeOptions.style.display = (themeOptions.style.display === 'none' || themeOptions.style.display === '') ? 'flex' : 'none';
  });

  // Close theme options if clicked outside
  document.addEventListener('click', function(event) {
    if (!themeOptions.contains(event.target) && event.target !== themeToggle) {
      themeOptions.style.display = 'none';
    }
  });

  // When clicking on a theme button
  themeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const selectedTheme = this.getAttribute('data-theme');
      changeTheme(selectedTheme);
    });
  });
});





// Switch between areas
chatOption.addEventListener('click', () => {
  document.querySelector('.main-page').style.display = 'none';
  chatArea.style.display = 'block';
});

voiceOption.addEventListener('click', () => {
  document.querySelector('.main-page').style.display = 'none';
  chatArea.style.display = 'none';
  voiceArea.style.display = 'block';
});




// Load history from localStorage when page loads
document.addEventListener('DOMContentLoaded', loadHistory);

// Function to send message (called when user sends a question)
function sendMessage(question) {
    // Save the question into history
    saveToHistory(question);
}

// Save a question into localStorage history
function saveToHistory(question) {
    let history = JSON.parse(localStorage.getItem('chatHistory')) || [];

    const timestamp = new Date().toLocaleDateString(); // Example: 27/04/2025

    history.push({ question, date: timestamp });

    localStorage.setItem('chatHistory', JSON.stringify(history));

    // Update the History section
    addHistoryItemToUI(question, timestamp);
}

// Load history from localStorage and display it
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];

    history.forEach(item => {
        addHistoryItemToUI(item.question, item.date);
    });
}

// Function to add a new history item to the UI
function addHistoryItemToUI(question, date) {
    const historyList = document.querySelector('.history-list');

    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');

    historyItem.innerHTML = `
        <span class="history-icon">📝</span>
        <div class="history-text">
            <p>${question}</p>
            <small>${date}</small>
        </div>
    `;

    // Add latest question on top
    historyList.prepend(historyItem);
}

// Function to handle sending the user input
function handleSend() {
  const inputField = document.getElementById('userInput');
  const question = inputField.value.trim();

  if (question !== "") {
      sendMessage(question);  // Pass the real question text here
      inputField.value = "";  // Clear input box
  }
}

// Clear all history
function clearHistory() {
  if (confirm("Are you sure you want to clear all history?")) {
    localStorage.removeItem('chatHistory'); // Remove from localStorage

    const historyList = document.querySelector('.history-list');
    historyList.innerHTML = ''; // Clear from UI
  }
}

// Message Adder
function addMessage(text, sender) {
  const message = document.createElement('div');
  message.classList.add('message');
  message.classList.add(sender); // 'user' or 'bot'
  message.innerHTML = text; // innerHTML because bot replies may contain image tags
  chatBody.appendChild(message);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Typing Effect for Bot
function addBotTypingEffect(text) {
  const message = document.createElement('div');
  message.classList.add('message', 'bot');
  chatBody.appendChild(message);
  chatBody.scrollTop = chatBody.scrollHeight;

  let index = 0;
  let formattedText = text.replace(/<br>/g, '\n'); // Convert <br> tags to newlines
  const typingInterval = setInterval(() => {
    if (index < formattedText.length) {
      message.innerHTML += formattedText.charAt(index); // Using innerHTML for HTML content
      index++;
    } else {
      clearInterval(typingInterval);
    }
  }, 2); // Typing speed
}

// Dummy bot replies fallback (in case no JSON match)
function randomBotReply() {
  const replies = [
    "That's a great question about adapting your story!",
    "Consider showing emotions through actions instead of narration.",
    "Focus on the character's key journey moments for movie adaptation.",
    "Visual storytelling is your best friend in movies!",
    "Trim subplots that don't move the main story forward."
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

// Handle sending user text
sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleUserInput();
  }
});
        
// Fetching both data.json and harry_potter_characters.json
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Check the data in the console
    bookData = data;
  })
  .catch(error => console.error("Error loading data:", error));

fetch('harry_potter_characters.json')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Check the character data in the console
    characterData = data;
  })
  .catch(error => console.error("Error loading character data:", error));

// Main function when user sends message
function handleUserInput() {
  const text = userInput.value.trim();
  if (text !== '') {
    addMessage(text, 'user');
    sendMessage(text);
    generateResponse(text); // Process the user query
    userInput.value = ''; // Clear the input field
  }
}
function handleUserInputVoice(userInput) {
  const text = userInput.value.trim();
  if (text !== '') {
    addMessage(text, 'user');
    sendMessage(text);
    generateResponseVoice(text,true); // Process the user query
    userInput.value = ''; // Clear the input field
  }
}

// Main function when user sends message
function generateResponse(userText) {
  if (!bookData || bookData.length === 0 || !characterData || characterData.length === 0) {
    addBotTypingEffect("❌ Data is still loading. Please wait a moment.");
    return;
  }

  const query = userText.toLowerCase().trim(); // Make the user input lowercase for easier matching
  let found = false;

  // Check for movie query match
  for (let item of bookData) {
    const movieTitle = item.movie.toLowerCase().trim();

    // If movie query matches, respond with movie details
    if (query === movieTitle || movieTitle.includes(query)) {
      let response = `🎬 *${item.movie}*(${item.release_year})\n\n`;
      response += `📚 Author: ${item.author}\n\n`;
      response += `📝 Description: ${item.description}\n\n`;

      if (item.faithfulness) {
        response += `📖 Faithfulness: ${item.faithfulness}\n\n`;
        response += `📝 Differences:\n- ${item.differences.join('\n- ')}\n\n`;
      }

      if (item.book_series) {
        response += `📘 Series: ${item.book_series} (${item.number_of_movies} movie${item.number_of_movies > 1 ? 's' : ''})`;
      }

      addBotTypingEffect(response);
      localStorage.setItem('lastMovieQuery', item.movie); // Store last matched movie title
      found = true;
      break;
    }
  }

  // Check for character query match (with case-insensitive and partial matching)
  for (let character of characterData) {
    const characterName = character.name.toLowerCase().trim();
    
    // Check if the query matches the character name (case-insensitive and partial)
    if (characterName.includes(query)) {
      let response = `👤 Character: *${character.name}*\n\n`;
      response += `🎓 Actor: ${character.actor || 'Unknown'}\n\n`;
      response += `📝 Role: ${character.role}\n\n`;
      response += `📚 Background: ${character.background || 'No background information available.'}\n\n`;

      addBotTypingEffect(response);
      found = true;
      break;
    }
  }

  // If no match is found, notify the user
  if (!found) {
    addBotTypingEffect("❌ Sorry, can't find the book in the bookshelf. Please try using the full name or title.");
  }
}

// Add welcome message when chatbot opens
window.onload = function() {
  setTimeout(() => {
    addBotTypingEffect("Hey! 🎥 Ready to explore movie details or character information? Just give me a name or title!");
  }, 1500);
};


//Generate Response function for voice input
function generateResponseVoice(userText, forVoicePage = false) {
  
  if (!bookData || bookData.length === 0) {
    displayVoiceResponse("❌ Data is still loading. Please wait a moment.");
    return;
  }  

  console.log(bookData);
  const query = userText.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
  console.log('User Input (Voice):', query); // Log to check input
  console.log('For Voice Page:', forVoicePage);
  let found = false;

  for (let item of bookData) {
    //const movieTitle = item.movie.replace(/\s+/g, ' ').trim().toLowerCase();
    const movieTitle = item.movie.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
    console.log("Movie Title:", movieTitle); // Log movie title for debugging
    if (query === movieTitle || movieTitle.includes(query) || movieTitle.toLowerCase().startsWith(query)) {
      console.log("Match found!");
      let response = `🎬 *${item.movie}* (${item.release_year})\n\n`;
      response += `📚 Author: ${item.author}\n\n`;
      response += `📝 Description: ${item.description}\n\n`;
      if (item.faithfulness) {
        response += `📖 Faithfulness: ${item.faithfulness}\n\n`;
        response += `📝 Differences:\n- ${item.differences.join('\n- ')}\n\n`;
      }
      if (item.book_series) {
        response += `📘 Series: ${item.book_series} (${item.number_of_movies} movie${item.number_of_movies > 1 ? 's' : ''})`;
      }

      if (forVoicePage) {
       displayVoiceResponse(response);
      } else {
        addBotTypingEffect(response);
      }
      found = true;
      break;
    }
  }

  for (let character of characterData) {
    const characterName = character.name.toLowerCase().trim();
    if (characterName.includes(query)) {
      let response = `👤 Character: *${character.name}*\n\n`;
      response += `🎓 Actor: ${character.actor || 'Unknown'}\n\n`;
      response += `📝 Role: ${character.role}\n\n`;
      response += `📚 Background: ${character.background || 'No background info available.'}`;

      if (forVoicePage) {
        displayVoiceResponse(response);
      } else {
        addBotTypingEffect(response);
      }
      found = true;
      break;
    }
  }

  if (!found) {
    const noMatch = "❌ Sorry, can't find the book in the bookshelf. Try a full name or title.";
    if (forVoicePage) {
      displayVoiceResponse(noMatch);
    } else {
      addBotTypingEffect(noMatch);
    }
  }
}

// Voice Recognition
function displayVoiceResponse(responseText) {
  const box = document.querySelector('.voice-response-content');
  if (box) {
    box.innerHTML = `<pre>${responseText}</pre>`;
  } else {
    console.warn('No .voice-response-content element found!');
  }
}
const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognitionInstance;
let isListening = false;

if (recognition) {
  recognitionInstance = new recognition();
  recognitionInstance.continuous = false;
  recognitionInstance.interimResults = false;

  recognitionInstance.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    console.log("You said: " + transcript);
    const voiceDescription = document.querySelector('.voice-description .highlight');
    voiceDescription.textContent = transcript;
    
    // Call the response generator with the recognized voice input
    generateResponseVoice(transcript, true); 
  };

  recognitionInstance.onstart = () => {
    console.log("Speech recognition started...");
    isListening = true;
    micButton.textContent = '🔴'; // Change mic button to indicate recording
  };

  recognitionInstance.onend = () => {
    console.log("Speech recognition ended.");
    isListening = false;
    micButton.textContent = '🎤'; // Reset mic button when stopped
  };

  recognitionInstance.onerror = (event) => {
    console.error("Speech recognition error", event.error);
  };

  micButton.addEventListener('click', () => {
    if (isListening) {
      recognitionInstance.stop(); // Stop recognition
    } else {
      recognitionInstance.start(); // Start recognition
    }
  });
} else {
  console.log("Speech Recognition is not supported in this browser.");
}

function toggleCharacterOptions() {
  const options = document.getElementById('character-options');
  options.style.display = options.style.display === 'none' ? 'block' : 'none';
}

function selectCharacter(characterName) {
  // Show the chat area
  document.getElementById('chatArea').style.display = 'block';

  // Get messages container
  const messagesDiv = document.getElementById('messages');

  addMessage(characterName, 'user');
  generateResponse(characterName);
  

  // Scroll to bottom
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
