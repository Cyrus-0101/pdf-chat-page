<template>
  <div class="flex h-screen bg-gray-900 text-white">
    <!-- Document Viewer -->
    <div class="w-1/2 flex flex-col">
      <!-- Document Controls (for PDF) -->
      <div v-if="fileType === 'pdf'" class="flex justify-between p-2 bg-gray-800">
        <div class="flex items-center space-x-2">
          <button
            @click="prevPage"
            :disabled="currentPage <= 1"
            class="p-1 hover:bg-gray-700 rounded text-gray-300 disabled:opacity-50"
          >
            <ChevronLeftIcon class="h-5 w-5" />
          </button>
          <span class="text-sm">{{ currentPage }} / {{ totalPages }}</span>
          <button
            @click="nextPage"
            :disabled="currentPage >= totalPages"
            class="p-1 hover:bg-gray-700 rounded text-gray-300 disabled:opacity-50"
          >
            <ChevronRightIcon class="h-5 w-5" />
          </button>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="zoomOut" class="p-1 hover:bg-gray-700 rounded text-gray-300">
            <MinusIcon class="h-5 w-5" />
          </button>
          <button @click="zoomIn" class="p-1 hover:bg-gray-700 rounded text-gray-300">
            <PlusIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Document Content -->
      <div class="flex-grow overflow-auto bg-white">
        <div v-if="loading" class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
        <canvas v-else-if="fileType === 'pdf'" ref="pdfCanvas" class="mx-auto"></canvas>
        <div v-else-if="fileType === 'docx'" class="p-4 text-black" v-html="docxContent"></div>
        <div v-else class="flex items-center justify-center h-full text-gray-500">
          Unsupported file type
        </div>
      </div>
    </div>

    <!-- Chat Section -->
    <div class="w-1/2 flex flex-col p-4">
      <!-- Messages Area -->
      <div class="flex-grow overflow-y-auto space-y-4 mb-4">
        <div v-for="(message, index) in messages" :key="index" class="flex flex-col">
          <div
            :class="message.role === 'user' ? 'self-end bg-purple-600' : 'self-start bg-gray-700'"
            class="max-w-[70%] rounded-lg p-3 mb-2"
          >
            <p class="text-sm">{{ message.content }}</p>
          </div>
          <span class="text-xs opacity-70"
            >{{ message.role === 'user' ? 'You' : 'AI' }} •
            {{ formatTime(message.timestamp) }}</span
          >
        </div>
      </div>

      <!-- Input Area -->
      <div class="flex items-center space-x-2">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type your message here..."
          class="flex-grow p-2 bg-gray-700 border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          @click="sendMessage"
          class="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          :disabled="isLoading"
        >
          <SendIcon v-if="!isLoading" class="h-5 w-5" />
          <LoaderIcon v-else class="h-5 w-5 animate-spin" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
  Send as SendIcon,
  Loader as LoaderIcon,
} from 'lucide-vue-next'
import axios from 'axios'

const route = useRoute()
const documentUrl = ref('')
const fileType = ref('')
const loading = ref(true)
const pdfDoc = ref(null)
const pdfCanvas = ref(null)
const currentPage = ref(1)
const totalPages = ref(0)
const scale = ref(1.5)
const docxContent = ref('')
const messages = ref([])
const newMessage = ref('')
const isLoading = ref(false)

onMounted(async () => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/+esm`
  documentUrl.value = route.query.link

  if (documentUrl.value) {
    fileType.value = getFileType(documentUrl.value)
    if (fileType.value === 'pdf') {
      await loadPdf(documentUrl.value)
    } else if (fileType.value === 'docx') {
      await loadDocx(documentUrl.value)
    } else {
      console.error('Unsupported file type')
      loading.value = false
    }
  }
})

const getFileType = (url) => {
  const extension = url.split('.').pop().toLowerCase()
  if (extension === 'pdf') return 'pdf'
  if (extension === 'docx') return 'docx'
  return 'unknown'
}

const loadPdf = async (url) => {
  try {
    const loadingTask = pdfjsLib.getDocument(url)
    pdfDoc.value = await loadingTask.promise
    totalPages.value = pdfDoc.value.numPages
    await renderPage()
  } catch (error) {
    console.error('Error loading PDF:', error)
  } finally {
    loading.value = false
  }
}

const loadDocx = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const result = await mammoth.convertToHtml({ arrayBuffer: response.data })
    docxContent.value = result.value
  } catch (error) {
    console.error('Error loading DOCX:', error)
    docxContent.value = 'Error loading document. Please try again later.'
  } finally {
    loading.value = false
  }
}

const renderPage = async () => {
  if (pdfDoc.value) {
    const page = await pdfDoc.value.getPage(currentPage.value)
    const viewport = page.getViewport({ scale: scale.value })
    const canvas = pdfCanvas.value
    const context = canvas.getContext('2d')
    canvas.height = viewport.height
    canvas.width = viewport.width
    await page.render({ canvasContext: context, viewport: viewport }).promise
  }
}

watch(currentPage, renderPage)

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const zoomIn = () => {
  scale.value += 0.1
  renderPage()
}

const zoomOut = () => {
  if (scale.value > 0.5) {
    scale.value -= 0.1
    renderPage()
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
}

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    const userMessage = {
      role: 'user',
      content: newMessage.value.trim(),
      timestamp: new Date(),
    }
    messages.value.push(userMessage)
    newMessage.value = ''
    isLoading.value = true

    try {
      // Simulated API call
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: { content: 'This is a simulated AI response.' },
            }),
          1000,
        ),
      )

      const aiMessage = {
        role: 'ai',
        content: response.data.content,
        timestamp: new Date(),
      }
      messages.value.push(aiMessage)
    } catch (error) {
      console.error('Error sending message:', error)
      messages.value.push({
        role: 'ai',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date(),
      })
    } finally {
      isLoading.value = false
    }
  }
}
</script>
