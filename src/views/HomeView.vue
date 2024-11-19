<template>
  <div class="container">
    <!-- PDF Section -->
    <div class="pdf-section">
      <div v-if="!pdfUrl" class="upload-area">
        <label class="upload-button">
          <input
            type="file"
            accept="application/pdf"
            style="display: none"
            @change="handleFileUpload"
          />
          <div class="upload-icon">
            <PlusIcon class="h-8 w-8" style="color: #8b5cf6" />
          </div>
          <span class="upload-text">Add PDF</span>
        </label>
      </div>
      <div v-else style="height: 100vh; display: flex; flex-direction: column">
        <!-- PDF Controls -->
        <div class="pdf-controls">
          <div style="display: flex; align-items: center">
            <button @click="currentPage > 1 && currentPage--">
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <span style="margin: 0 0.5rem">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="currentPage < totalPages && currentPage++">
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
          <div style="display: flex; align-items: center">
            <button @click="zoomOut">
              <MinusIcon class="h-5 w-5" />
            </button>
            <button @click="zoomIn" style="margin-left: 0.5rem">
              <PlusIcon class="h-5 w-5" />
            </button>
            <button style="margin-left: 0.5rem">
              <SearchIcon class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- PDF Viewer -->
        <div class="pdf-viewer">
          <iframe :src="pdfUrl" type="application/pdf"></iframe>
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
      <div class="chat-input">
        <form @submit.prevent="sendMessage" class="chat-form">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Ask any question..."
            class="chat-input-field"
          />
          <button type="submit" class="send-button">
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
const totalPages = ref(19)
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
    }, 1000)
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
  ring-offset: 2px;
}
</style>
