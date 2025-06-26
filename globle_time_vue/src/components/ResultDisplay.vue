<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- First Country Time -->
    <prime_card class="time-card animate__animated animate__slideInLeft">
      <template #content>
        <div class="text-center space-y-4">
          <div class="flex items-center justify-center space-x-2">
            <span class="text-2xl">{{ country1.flag }}</span>
            <h3 class="text-lg font-semibold">{{ country1.name }}</h3>
          </div>

          <div class="space-y-2">
            <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {{ currentTime1 }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ currentDate1 }}
            </div>
            <div class="text-xs text-gray-500">
              {{ country1.timezone }}
            </div>
          </div>

          <prime_badge
            v-if="isDST1"
            value="DST Active"
            severity="info"
            class="animate__animated animate__pulse animate__infinite"
          />
        </div>
      </template>
    </prime_card>

    <!-- Time Difference -->
    <prime_card class="time-card animate__animated animate__slideInUp">
      <template #content>
        <div class="text-center space-y-4">
          <div class="flex items-center justify-center">
            <i class="pi pi-arrow-right-arrow-left text-2xl text-primary-500"></i>
          </div>

          <div class="space-y-2">
            <div class="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {{ timeDifferenceText }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Time Difference</div>
          </div>

          <prime_divider />

          <div class="space-y-2">
            <div class="text-xl font-semibold text-green-600 dark:text-green-400">
              {{ Math.round(distance).toLocaleString() }} km
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Distance Apart</div>
          </div>

          <div v-if="loading" class="flex justify-center">
            <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="4" />
          </div>
        </div>
      </template>
    </prime_card>

    <!-- Second Country Time -->
    <prime_card class="time-card animate__animated animate__slideInRight">
      <template #content>
        <div class="text-center space-y-4">
          <div class="flex items-center justify-center space-x-2">
            <span class="text-2xl">{{ country2.flag }}</span>
            <h3 class="text-lg font-semibold">{{ country2.name }}</h3>
          </div>

          <div class="space-y-2">
            <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {{ currentTime2 }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ currentDate2 }}
            </div>
            <div class="text-xs text-gray-500">
              {{ country2.timezone }}
            </div>
          </div>

          <Badge
            v-if="isDST2"
            value="DST Active"
            severity="info"
            class="animate__animated animate__pulse animate__infinite"
          />
        </div>
      </template>
    </prime_card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  country1: Object,
  country2: Object,
  distance: Number,
  loading: Boolean,
})

const currentTime1 = ref('')
const currentTime2 = ref('')
const currentDate1 = ref('')
const currentDate2 = ref('')
const isDST1 = ref(false)
const isDST2 = ref(false)
let timeInterval = null

// Calculate time difference
const timeDifferenceText = computed(() => {
  if (!props.country1 || !props.country2) return ''

  try {
    const now = new Date()
    const time1 = new Date(now.toLocaleString('en-US', { timeZone: props.country1.timezone }))
    const time2 = new Date(now.toLocaleString('en-US', { timeZone: props.country2.timezone }))

    const diffMs = time2.getTime() - time1.getTime()
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))

    if (diffHours === 0) return 'Same time'
    if (diffHours > 0) return `${Math.abs(diffHours)} hours ahead`
    return `${Math.abs(diffHours)} hours behind`
  } catch (error) {
    console.warn('Error calculating time difference:', error)
    return 'Unable to calculate'
  }
})

// Check if DST is active (simplified check)
const checkDST = (timezone) => {
  try {
    const now = new Date()
    const jan = new Date(now.getFullYear(), 0, 1)
    const jul = new Date(now.getFullYear(), 6, 1)

    const janOffset = new Date(
      jan.toLocaleString('en-US', { timeZone: timezone }),
    ).getTimezoneOffset()
    const julOffset = new Date(
      jul.toLocaleString('en-US', { timeZone: timezone }),
    ).getTimezoneOffset()
    const nowOffset = new Date(
      now.toLocaleString('en-US', { timeZone: timezone }),
    ).getTimezoneOffset()

    return nowOffset !== Math.max(janOffset, julOffset)
  } catch (error) {
    console.warn(`Error checking DST for timezone: ${timezone}`, error)
    return false
  }
}

// Update times
const updateTimes = () => {
  if (!props.country1 || !props.country2) return

  try {
    const now = new Date()

    // Format times with error handling
    try {
      currentTime1.value = now.toLocaleTimeString('en-US', {
        timeZone: props.country1.timezone,
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch (error) {
      console.log('error: ', error)
      console.warn(`Invalid timezone for ${props.country1.name}: ${props.country1.timezone}`)
      currentTime1.value = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }

    try {
      currentTime2.value = now.toLocaleTimeString('en-US', {
        timeZone: props.country2.timezone,
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch (error) {
      console.log('error: ', error)
      console.warn(`Invalid timezone for ${props.country2.name}: ${props.country2.timezone}`)
      currentTime2.value = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }

    // Format dates with error handling
    try {
      currentDate1.value = now.toLocaleDateString('en-US', {
        timeZone: props.country1.timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (error) {
      console.log('error: ', error)
      currentDate1.value = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    try {
      currentDate2.value = now.toLocaleDateString('en-US', {
        timeZone: props.country2.timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (error) {
      console.log('error: ', error)
      currentDate2.value = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    // Check DST with error handling
    try {
      isDST1.value = checkDST(props.country1.timezone)
    } catch (error) {
      console.log('error: ', error)
      isDST1.value = false
    }

    try {
      isDST2.value = checkDST(props.country2.timezone)
    } catch (error) {
      console.log('error: ', error)
      isDST2.value = false
    }
  } catch (error) {
    console.error('Error updating times:', error)
  }
}

onMounted(() => {
  updateTimes()
  timeInterval = setInterval(updateTimes, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>
