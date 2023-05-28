(function () {
  // Function to create and inject HTML elements
  documentID = 'b2ZmZmtpYWpjbGhwbg';
  function createChatbotElements() {
    var button = document.createElement('button');
    button.id = 'toggleChatbotButton';
    button.style.cssText = `
        position: fixed;
        bottom: 0px;
        right: 0px;
        z-index: 100;
        font-size: 16px;
        padding: 10px 20px;
        border: none;
        border-radius: 0px;
        color: #ffffff;
        background-color: #0076ff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: all 0.3s ease;
        width: 150px;
        height: 50px;
        white-space: nowrap;
        display: flex;
        justify-content: center;
        align-items: center;
      `;
    button.textContent = 'Open Chatbot';
    // Add a hover effect
    button.onmouseover = function () {
      this.style.backgroundColor = '#0056cc';
    };

    button.onmouseout = function () {
      this.style.backgroundColor = '#0076ff';
    };

    document.body.appendChild(button);

// Set up clipboard event listeners for host website
window.addEventListener('message', function (event) {
  if (event.data.type === 'SetClipboardText') {
    navigator.clipboard.writeText(event.data.text);
  } else if (event.data.type === 'GetClipboardText') {
    navigator.clipboard.readText()
      .then(function (text) {
        event.source.postMessage({ type: 'GetClipboardTextResponse', text: text, callback: event.data.callback }, '*');
      })
      .catch(function (error) {
        console.error('Error while reading from clipboard:', error);
      });
  }
});

    var container = document.createElement('div');
    container.id = 'chatbotContainer';
    container.style.cssText = 'display: none; position: fixed; width: 400px; height: 600px; z-index: 100; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); border-radius: 0px; overflow: hidden;';

    var iframe = document.createElement('iframe');
    iframe.id = 'chatbotIframe';
    iframe.src = 'https://chatbotai-e84e3.web.app/';
    iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('allow', 'clipboard-write; clipboard-read');

    container.appendChild(iframe);
    document.body.appendChild(button);
    document.body.appendChild(container);
    
    window.addEventListener('message', function (event) {
      if (event.data.type === 'SetClipboardText') {
        navigator.clipboard.writeText(event.data.text).catch(function (error) {
          console.error('Error while writing to clipboard:', error);
        });
      } else if (event.data.type === 'GetClipboardText') {
        navigator.clipboard.readText()
          .then(function (text) {
            event.source.postMessage({ type: 'GetClipboardTextResult', text: text, callback: event.data.callback }, '*');
          })
          .catch(function (error) {
            console.error('Error while reading from clipboard:', error);
          });
      }
    });
  }
  
  maxAttempts = 15;
  function updateUnityVariable(documentID) {
    console.log('updateUnityVariable', documentID);
    attemptInterval = 1000;
    var chatbotIframe = document.getElementById('chatbotIframe');
    
    if (true) {
      chatbotIframe.contentWindow.postMessage({
        type: 'UpdateUnityVariable',
        newValue: documentID
      }, '*');
    if (maxAttempts > 0) {
      setTimeout(() => {
        maxAttempts -= 1;
        updateUnityVariable(documentID);
      }, attemptInterval);
    } 
  }
  }
  // Function to handle the button click and show/hide chatbot
  function handleButtonClick() {
    document.getElementById('toggleChatbotButton').addEventListener('click', function () {
      var chatbotContainer = document.getElementById('chatbotContainer');
      var toggleChatbotButton = document.getElementById('toggleChatbotButton');
      if (chatbotContainer.style.display === 'none') {
        var buttonRect = toggleChatbotButton.getBoundingClientRect();
        var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        chatbotContainer.style.right = `${window.innerWidth - buttonRect.right - scrollbarWidth}px`;
        chatbotContainer.style.bottom = `${window.innerHeight - buttonRect.top}px`;
  
        chatbotContainer.style.display = 'block';
        toggleChatbotButton.textContent = 'Close Chatbot';
      } else {
        chatbotContainer.style.display = 'none';
        toggleChatbotButton.textContent = 'Open Chatbot';
      }
    });
  }

  // Initialize the chatbot
  function initChatbot() {
    createChatbotElements();
    handleButtonClick();
    updateUnityVariable(documentID);
  }

  // Wait for the DOM to load before initializing the chatbot
  document.addEventListener('DOMContentLoaded', initChatbot);
})();