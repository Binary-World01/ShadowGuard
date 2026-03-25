const BLOCKLIST = [
  'bypassgpt.com',
  'stealthwriter.ai',
  'undetectable.ai',
  'phrasly.ai',
  'quillbot.com',
  'deepseek.com',
  'cursor.com',
  'bolt.new',
  'unverified-llm.io'
];

// Initialize storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 
    blockedCount: 0, 
    blockedSites: [] 
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url) {
    const url = new URL(tab.url);
    const isBlocked = BLOCKLIST.some(item => url.hostname.includes(item));

    if (isBlocked) {
      
      // Update icon
      chrome.action.setBadgeText({ text: '!', tabId: tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#ef4444', tabId: tabId });

      chrome.storage.local.get(['blockedCount', 'blockedSites'], (result: any) => {
        const count = ((result.blockedCount as number) || 0) + 1;
        const sites = (result.blockedSites as any[]) || [];
        
        // Prevent double counting the same session/refresh
        if (sites[0]?.url === tab.url && Date.now() - (sites[0].timestamp as number) < 5000) return;

        sites.unshift({
          url: tab.url as string,
          timestamp: Date.now()
        });

        chrome.storage.local.set({
          blockedCount: count,
          blockedSites: sites.slice(0, 10)
        });

        // Notify content script
        chrome.tabs.sendMessage(tabId, { type: 'BLOCKED_SITE', url: tab.url });
      });
    }
  }
});
