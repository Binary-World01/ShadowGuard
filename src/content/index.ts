/// <reference types="chrome" />
import { createApp } from 'vue'
import Banner from './Banner.vue'

// Content Script Core
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

function injectBanner() {
  // Wait for body to be available and give React/SSR apps 
  // a moment to hydrate to avoid "Minified React errors"
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(_inject, 500));
  } else {
    setTimeout(_inject, 500);
  }
}

function _inject() {
  if (document.getElementById('shadowguard-banner-root')) return;

  console.log('🛡️ ShadowGuard: Injecting security banner...');
  const container = document.createElement('div');
  container.id = 'shadowguard-banner-root';
  
  const shadow = container.attachShadow({ mode: 'open' });
  
  // Inject the bundled CSS into the shadow DOM
  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = chrome.runtime.getURL('assets/content.css');
  shadow.appendChild(styleLink);

  const appRoot = document.createElement('div');
  shadow.appendChild(appRoot);
  
  document.body.appendChild(container); // Using appendChild instead of prepend for better stability
  
  const app = createApp(Banner);
  app.mount(appRoot);
}

chrome.runtime.onMessage.addListener((message: any) => {
  if (message.type === 'BLOCKED_SITE') {
    if (!document.getElementById('shadowguard-banner-root')) {
      injectBanner();
    }
  }
});

// PII Redaction & Leak Prevention

function checkSensitiveData(text: string) {
  // Use fresh regex instances to avoid 'g' flag state issues (lastIndex)
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
  const apiMatch = text.match(/(?:key|token|secret|auth|api)[-_]?[a-zA-Z0-9]{20,}/i);

  if (emailMatch || apiMatch) {
    console.warn('🛡️ SHADOWGUARD ALERT: Sensitive data detected!');
    alert('🛡️ SHADOWGUARD ALERT: Potential PII or API Key detected in prompt. Corporate policy prohibits sharing sensitive data with unverified AI systems.');
    return true;
  }
  return false;
}

// Intercept typing globally (ShadowGuard Global Protection)
document.addEventListener('input', (e) => {
  const target = e.target as HTMLElement;
  if (!target) return;

  const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
  const isEditable = target.isContentEditable;

  if (isInput || isEditable) {
    const text = (target as HTMLInputElement).value || target.innerText || "";
    // Scans for PII on ANY website to protect corporate data
    if (text.length > 5) { // Minor optimization: only scan if enough text
       checkSensitiveData(text);
    }
  }
});

// Initial check
if (BLOCKLIST.some(item => window.location.hostname.includes(item))) {
  injectBanner();
}
