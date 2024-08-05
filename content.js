// content.js

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'CONTEXT_MENU_CLICKED') {
        console.log('Context menu clicked with text:', message.text);
        // Perform any action with the selected text

        // Handle the case where message.text might be undefined or null
        if (!message.text) {
            console.error('No text received from context menu click');
            sendResponse({ status: 'error', message: 'No text received' });
            return;
        }

        // If everything is fine, send a successful response
        sendResponse({ status: 'received' });
    } else {
        console.warn('Unknown message type received:', message.type);
        sendResponse({ status: 'error', message: 'Unknown message type' });
    }

    // Return true to indicate asynchronous response if necessary
    return true;
});

  