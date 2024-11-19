<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- PDF Section -->
    <div class="w-1/2 border-r border-gray-200 relative">
      <div v-if="!pdfUrl" class="h-full flex items-center justify-center">
        <label class="cursor-pointer group">
          <input type="file" accept="application/pdf" class="hidden" @change="handleFileUpload" />
          <div class="flex flex-col items-center">
            <div class="p-4 rounded-full bg-violet-100 group-hover:bg-violet-200 transition-colors">
              <PlusIcon class="h-8 w-8 text-violet-600" />
            </div>
            <span class="mt-2 text-sm text-gray-600">Add PDF</span>
          </div>
        </label>
      </div>

      <div v-else class="h-screen flex flex-col">
        <!-- PDF Controls -->
        <div class="flex items-center justify-between p-2 border-b border-gray-200 bg-white">
          <div class="flex items-center space-x-2">
            <button class="p-1 hover:bg-gray-100 rounded" @click="currentPage > 1 && currentPage--">
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <span class="text-sm">{{ currentPage }} / {{ totalPages }}</span>
            <button
              class="p-1 hover:bg-gray-100 rounded"
              @click="currentPage < totalPages && currentPage++"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
          <div class="flex items-center space-x-2">
            <button class="p-1 hover:bg-gray-100 rounded" @click="zoomOut">
              <MinusIcon class="h-5 w-5" />
            </button>
            <button class="p-1 hover:bg-gray-100 rounded" @click="zoomIn">
              <PlusIcon class="h-5 w-5" />
            </button>
            <button class="p-1 hover:bg-gray-100 rounded">
              <SearchIcon class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- PDF Viewer -->
        <div class="flex-1 overflow-auto">
          <iframe :src="pdfUrl" class="w-full h-full" type="application/pdf"></iframe>
        </div>
      </div>
    </div>

    <!-- Chat Section -->
    <div class="chat-section">
      <div class="chat-header">
        <h2 style="font-size: 1.125rem; font-weight: 600">Chat</h2>
      </div>

      <!-- Messages -->
      <div class="chat-messages">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', message.sender === 'user' ? 'user-message' : 'bot-message']"
        >
          <div class="avatar">
            <UserIcon v-if="message.sender === 'user'" class="h-5 w-5" style="color: #ffffff" />
            <BotIcon v-else class="h-5 w-5" style="color: #6366f1" />
          </div>
          <div class="message-content">
            <p>{{ message.content }}</p>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="p-4 border-t border-gray-200 bg-white">
        <form @submit.prevent="sendMessage" class="flex space-x-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Ask any question..."
            class="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
          <button
            type="submit"
            class="p-2 rounded-full bg-violet-600 text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            <SendIcon class="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Plus as PlusIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Minus as MinusIcon,
  Search as SearchIcon,
  User as UserIcon,
  Bot as BotIcon,
  Send as SendIcon,
} from 'lucide-vue-next'

const pdfUrl = ref('')
const currentPage = ref(1)
const totalPages = ref(100)
const newMessage = ref('')
const messages = ref([
  {
    id: 1,
    sender: 'bot',
    content:
      "Hello there! 👋 Welcome to the summary of an important legal case from the Court of Appeal at Kisumu. This document discusses the appeal involving Godfrey Wanjala Wafula and Kololi Wafula Nasiombe, who are seeking ownership of a parcel of land that belonged to their late father, Wafula Mulanda John. They argue that their father had occupied the land for over 12 years, thus claiming ownership through adverse possession. The case also involves the respondent, Jairus Wakhungu Mulunda, who is related to the deceased and has contested the appellants' claims. Dive in to explore the details of this intriguing legal matter!",
  },
  {
    id: 2,
    sender: 'bot',
    content:
      "Here are three example questions you can ask about the file:\n\n➤ What are the main arguments presented by the appellants in their case?\n➤ How does the respondent challenge the appellants' claims regarding the land?\n➤ What legal principles are involved in the concept of adverse possession as mentioned in the document?",
  },
  {
    id: 3,
    sender: 'user',
    content: 'what was the judgement ?',
  },
  {
    id: 4,
    sender: 'bot',
    content:
      'The judgment concluded that the appeal lacked merit and was dismissed. The court held that the learned judge had arrived at a just conclusion regarding the ownership of the suit property, which rightfully belonged to the respondent. The respondent had proven his case on a balance of probabilities, while the appellants failed to demonstrate any bias from the learned judge or to substantiate their claims. The court also noted that the appellants had missed the opportunity to challenge certain interlocutory decisions and could not relitigate those issues at the appellate level. Consequently, the appeal was dismissed with no order as to costs, considering the close family ties between the parties involved 15, 44.',
  },
])

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    pdfUrl.value = URL.createObjectURL(file)
  }
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: Date.now(),
      sender: 'user',
      content: newMessage.value,
    })
    newMessage.value = ''
    // Simulate bot response
    setTimeout(() => {
      messages.value.push({
        id: Date.now(),
        sender: 'bot',
        content: 'I understand your question about the legal document. Let me help you with that.',
      })
    }, 2000)
  }
}

const zoomIn = () => {
  // Implement zoom in functionality
}

const zoomOut = () => {
  // Implement zoom out functionality
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
}

.pdf-section,
.chat-section {
  width: 50%;
  height: 100vh;
}

.pdf-section {
  border-right: 1px solid #e5e7eb;
  position: relative;
}

.upload-area {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-button {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  padding: 1rem;
  border-radius: 9999px;
  background-color: #ede9fe;
  transition: background-color 0.2s;
}

.upload-icon:hover {
  background-color: #ddd6fe;
}

.upload-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.pdf-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
}

.pdf-viewer {
  flex: 1;
  overflow: auto;
}

.pdf-viewer iframe {
  width: 100%;
  height: 100%;
}

.chat-section {
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
}

.chat-messages {
  flex: 1;
  overflow: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  margin-bottom: 1rem;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.bot-message {
  align-self: flex-start;
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.5rem;
}

.user-message .avatar {
  background-color: #6366f1;
}

.bot-message .avatar {
  background-color: #e0e7ff;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
}

.user-message .message-content {
  background-color: #6366f1;
  color: white;
  border-top-right-radius: 0;
}

.bot-message .message-content {
  background-color: #f3f4f6;
  color: #1f2937;
  border-top-left-radius: 0;
}

.chat-input {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background-color: white;
}

.chat-form {
  display: flex;
}

.chat-input-field {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  margin-right: 0.5rem;
}

.chat-input-field:focus {
  outline: none;
  ring: 2px solid #6366f1;
  border-color: transparent;
}

.send-button {
  padding: 0.5rem;
  border-radius: 9999px;
  background-color: #6366f1;
  color: white;
}

.send-button:hover {
  background-color: #4f46e5;
}

.send-button:focus {
  outline: none;
  ring: 2px solid #6366f1;
  offset-path: 2px;
}
</style>
