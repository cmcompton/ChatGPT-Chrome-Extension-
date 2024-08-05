chrome.runtime.onInstalled.addListener(() => {
  console.log('Skaled ChatGPT Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ASK_QUESTION') {
    const question = message.question;

    chrome.storage.local.get(['apiKey'], (result) => {
      const apiKey = result.apiKey;

      if (!apiKey) {
        console.error('API key not found');
        sendResponse({ error: 'API key not found' });
        return;
      }

      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // or the appropriate model for your custom GPT
          messages: [{ role: "user", content: question }]
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('API Error:', data.error);
          sendResponse({ error: data.error.message });
        } else {
          sendResponse({ answer: data.choices[0].message.content });
        }
      })
      .catch(error => {
        console.error('Error:', error);
        sendResponse({ error: 'An error occurred while communicating with the API.' });
      });
    });

    return true; // Keeps the message channel open for sendResponse
  }
});

