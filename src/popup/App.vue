<script setup lang="ts">
import { ref, onMounted } from 'vue'

const blockedCount = ref(0)
const blockedHistory = ref<{ url: string; timestamp: number }[]>([])

// Fetch from chrome.storage
onMounted(() => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['blockedCount', 'blockedSites'], (result: any) => {
      blockedCount.value = (result.blockedCount as number) || 0
      blockedHistory.value = (result.blockedSites as any[]) || []
    })

    // Listen for updates
    chrome.storage.onChanged.addListener((changes: any) => {
      if (changes.blockedCount) blockedCount.value = changes.blockedCount.newValue as number
      if (changes.blockedSites) blockedHistory.value = (changes.blockedSites.newValue as any[]) || []
    })
  } else {
    // Mock data for dev
    blockedCount.value = 14
    blockedHistory.value = [
      { url: 'unverified-llm.io/chat', timestamp: Date.now() - 1000 * 60 * 5 },
      { url: 'random-ai-writer.com/generate', timestamp: Date.now() - 1000 * 60 * 60 },
      { url: 'sketchy-ai.net', timestamp: Date.now() - 1000 * 60 * 60 * 24 }
    ]
  }
})

const formatDate = (ts: number) => {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="w-[400px] h-[500px] bg-[#0a0a0c] text-slate-200 font-sans flex flex-col border border-blue-900/30 overflow-hidden">
    <!-- Header -->
    <header class="p-6 border-b border-white/5 bg-gradient-to-r from-blue-950/20 to-transparent">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        <h1 class="text-xs font-black tracking-[0.2em] uppercase text-blue-400">ShadowGuard</h1>
      </div>
      <p class="text-xl font-bold mt-1 tracking-tight">Endpoint Security</p>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
      
      <!-- Threat Score Card -->
      <div class="relative group">
        <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div class="relative bg-[#121216] border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <svg class="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 18c-3.75-1-7-5.46-7-9.54V8.3l7-3.89 7 3.89v2.16c0 4.08-3.25 8.54-7 9.54z"/></svg>
          </div>
          <span class="text-xs font-medium text-slate-500 uppercase tracking-widest">Shadow AI Threats Blocked</span>
          <span class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mt-2 tabular-nums">
            {{ blockedCount }}
          </span>
          <div class="mt-4 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span class="text-[10px] font-bold text-emerald-500 uppercase">System Secure</span>
          </div>
        </div>
      </div>

      <!-- Activity List -->
      <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center px-1">
          <h2 class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Recent Interceptions</h2>
          <span class="text-[10px] text-blue-400 cursor-pointer hover:underline">View Logs</span>
        </div>
        
        <div class="space-y-2">
          <div 
            v-for="(site, i) in blockedHistory" 
            :key="i"
            class="bg-white/5 border border-white/5 p-3 rounded-lg flex items-center justify-between group hover:border-blue-500/30 transition-colors"
          >
            <div class="flex flex-col gap-0.5 min-w-0">
              <span class="text-[11px] font-mono text-slate-300 truncate tracking-tight">{{ site.url }}</span>
              <span class="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Attempted Access &bull; Blocked</span>
            </div>
            <span class="text-[9px] font-mono text-blue-400 group-hover:text-blue-300">{{ formatDate(site.timestamp) }}</span>
          </div>
          
          <div v-if="blockedHistory.length === 0" class="py-12 flex flex-col items-center justify-center opacity-30">
            <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-[10px] font-bold uppercase">No threats detected</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="p-4 border-t border-white/5 bg-black/40 backdrop-blur-md flex justify-between items-center">
      <div class="flex items-center gap-1.5 opacity-50">
        <div class="w-1 h-1 rounded-full bg-white"></div>
        <span class="text-[9px] font-bold uppercase tracking-widest">Active Governance V1.0</span>
      </div>
      <button class="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-md transition-all active:scale-95">
        Security Settings
      </button>
    </footer>
  </div>
</template>

<style>
/* Custom animations if needed */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}
</style>
