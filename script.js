let bookData = [];

// 🔁 Load JSON data when page loads
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    bookData = data;
  })
  .catch(error => console.error("Error loading data:", error));

function handleUserInput() {
  const inputBox = document.getElementById("user-input");
  const userText = inputBox.value.trim();
  if (!userText) return;

  addMessage(userText, 'user');
  generateResponse(userText);
  inputBox.value = '';
}

function addMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.innerText = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function generateResponse(userText) {
  const query = userText.toLowerCase();
  let found = false;

  for (let item of bookData) {
    const movieTitle = item.movie.toLowerCase();

    // Check for exact match (entire movie title) or a more refined search
    // First, check if the query exactly matches the movie title
    if (query === movieTitle) {
      let response = `🎬 *${item.movie}* (${item.release_year})\n`;
      response += `📚 Author: ${item.author}\n`;
      response += `📝 Description: ${item.description}\n`;

      // Adaptation entry if faithfulness is non-empty
      if (item.faithfulness) {
        response += `📖 Faithfulness: ${item.faithfulness}\n`;
        response += `📝 Differences:\n- ${item.differences.join('\n- ')}\n`;
      }

      // Series info if present
      if (item.book_series) {
        response += `📘 Series: ${item.book_series} (${item.number_of_movies} movie${item.number_of_movies > 1 ? 's' : ''})`;
      }

      addBotTypingEffect(response);
      found = true;
      break;
    }
       // If no exact match, check if the query contains any part of the movie title (without conflict)
       else if (movieTitle.includes(query)) {
        let response = `🎬 *${item.movie}* (${item.release_year})\n`;
        response += `📚 Author: ${item.author}\n`;
        response += `📝 Description: ${item.description}\n`;
  
        // Adaptation entry if faithfulness is non-empty
        if (item.faithfulness) {
          response += `📖 Faithfulness: ${item.faithfulness}\n`;
          response += `📝 Differences:\n- ${item.differences.join('\n- ')}\n`;
        }
  
        // Series info if present
        if (item.book_series) {
          response += `📘 Series: ${item.book_series} (${item.number_of_movies} movie${item.number_of_movies > 1 ? 's' : ''})`;
        }
  
        addBotTypingEffect(response);
        found = true;
        break;
      }
  }

  if (!found) {
    addBotTypingEffect("❌ Sorry, I couldn’t find any details about that movie. Please try using the full title.");
  }
}

// Listen for Enter key
document.getElementById("user-input").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    handleUserInput();
  }
});

function addBotTypingEffect(text) {
  const chatBox = document.getElementById("chat-box");
  const message = document.createElement("div");
  message.className = "message bot";
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;

  let index = 0;
  const typingInterval = setInterval(() => {
    if (index < text.length) {
      message.innerText += text.charAt(index);
      index++;
    } else {
      clearInterval(typingInterval);
    }
  }, 2); // Speed: smaller is faster
}
// Add the first message when the chatbot is opened
window.onload = function() {
  setTimeout(() => {
    addBotTypingEffect("Hey!🎥 Ready to explore movie details? Just give me the name!");
  }, 3000); // Delay for a second to mimic typing
};