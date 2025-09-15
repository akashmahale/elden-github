// Detect Azure DevOps PR and Repo events
function detectAzureDevOpsEvents() {
  const url = window.location.href;

  // PR page
  const prMatch = /dev\.azure\.com\/([^\/]+)\/([^\/]+)\/_git\/([^\/]+)\/pullrequest\/(\d+)/.exec(url);
  if (prMatch) {
    if (document.querySelector('[aria-label*="created this pull request"]')) {
      chrome.runtime.sendMessage({ action: 'prMade' });
    }
    if (document.querySelector('[aria-label*="completed this pull request"]')) {
      chrome.runtime.sendMessage({ action: 'prMerged' });
    }
    if (document.querySelector('[aria-label*="reopened this pull request"]')) {
      chrome.runtime.sendMessage({ action: 'prReopened' });
    }
    if (document.querySelector('.repos-pr-comments-header') || document.querySelector('.bolt-comment-thread')) {
      chrome.runtime.sendMessage({ action: 'prCommented' });
    }
    if (document.querySelector('[aria-label*="abandoned this pull request"]')) {
      chrome.runtime.sendMessage({ action: 'prClosed' });
    }
  }

  // Repo created/deleted (simplified, may need API for accuracy)
  if (url.includes('/_git/') && document.querySelector('.repos-new-repo-banner')) {
    chrome.runtime.sendMessage({ action: 'repoCreated' });
  }
}

// Run once and observe SPA changes
detectAzureDevOpsEvents();
const observer = new MutationObserver(detectAzureDevOpsEvents);
observer.observe(document.body, { childList: true, subtree: true });
