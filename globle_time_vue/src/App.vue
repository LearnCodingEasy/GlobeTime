<template>
  <div :class="{ dark: isDarkMode }" class="min-h-screen transition-all duration-300">
    <div class="gradient-bg min-h-screen">
      <prime_toast />
      <!-- Header -->
      <header class="bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border-b border-white/20">
        <div class="container mx-auto px-4 py-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <i class="pi pi-clock text-2xl text-white"></i>
              <h1 class="text-2xl font-bold text-white">Time Calculator</h1>
            </div>
            <prime_button
              @click="toggleDarkMode"
              :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
              class="p-button-rounded p-button-text text-white hover:bg-white/20"
              aria-label="Toggle dark mode"
            />
          </div>
        </div>
      </header>
      <!-- Main Content -->
      <main class="container mx-auto px-4 py-8">
        <div class="max-w-6xl mx-auto space-y-8">
          <!-- Timezone Selectors -->
          <div class="animate__animated animate__fadeInUp">
            <TimezoneSelector
              :loading="loading"
              :countries="countries"
              :selectedCountry1="selectedCountry1"
              :selectedCountry2="selectedCountry2"
              @update:country1="updateCountry1"
              @update:country2="updateCountry2"
            />
          </div>

          <!-- Results Display -->
          <div class="animate__animated animate__fadeInUp animate__delay-1s">
            <ResultDisplay
              v-if="selectedCountry1 && selectedCountry2"
              :country1="selectedCountry1"
              :country2="selectedCountry2"
              :distance="distance"
              :loading="calculating"
            />
          </div>

          <!-- Map Display -->
          <div class="animate__animated animate__fadeInUp animate__delay-2s">
            <MapDisplay
              v-if="selectedCountry1 && selectedCountry2"
              :country1="selectedCountry1"
              :country2="selectedCountry2"
              :distance="distance"
            />
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer
        class="bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border-t border-white/20 mt-16"
      >
        <div class="container mx-auto px-4 py-6 text-center text-white/80">
          <p>&copy; 2025 Time Difference Calculator. Built with Vue 3 & Leaflet.</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { getDistance } from 'geolib'
import TimezoneSelector from '@/components/TimezoneSelector.vue'
import ResultDisplay from '@/components/ResultDisplay.vue'
import MapDisplay from '@/components/MapDisplay.vue'

// Reactive state
const isDarkMode = ref(false)
const loading = ref(true)
const calculating = ref(false)
const countries = ref([])
const selectedCountry1 = ref(null)
const selectedCountry2 = ref(null)
const distance = ref(0)
const userLocation = ref(null)

const toast = useToast()

// Initialize dark mode from localStorage
const loadCountries = async () => {
  try {
    loading.value = true
    console.log('Loading countries...')

    const response = await axios.get(
      'https://restcountries.com/v3.1/all?fields=name,cca2,latlng,timezones,flag',
    )
    console.log('API Response:', response.data)

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid API response format')
    }

    const processedCountries = response.data
      .filter((country) => {
        return (
          country.latlng &&
          country.timezones &&
          country.name?.common &&
          Array.isArray(country.latlng) &&
          country.latlng.length >= 2
        )
      })
      .map((country) => {
        // Convert UTC offset to proper timezone name if needed
        let timezone = country.timezones[0]

        // If timezone is in UTC+XX:XX format, try to find a proper IANA timezone
        if (timezone && timezone.startsWith('UTC')) {
          // For UTC offset timezones, we'll use a mapping or default to a major city
          const timezoneMap = {
            'UTC+01:00': 'Europe/Berlin',
            'UTC+02:00': 'Europe/Athens',
            'UTC+03:00': 'Europe/Moscow',
            'UTC+04:00': 'Asia/Dubai',
            'UTC+05:00': 'Asia/Karachi',
            'UTC+05:30': 'Asia/Kolkata',
            'UTC+06:00': 'Asia/Dhaka',
            'UTC+07:00': 'Asia/Bangkok',
            'UTC+08:00': 'Asia/Shanghai',
            'UTC+09:00': 'Asia/Tokyo',
            'UTC+10:00': 'Australia/Sydney',
            'UTC+11:00': 'Pacific/Noumea',
            'UTC+12:00': 'Pacific/Auckland',
            'UTC-01:00': 'Atlantic/Azores',
            'UTC-02:00': 'Atlantic/South_Georgia',
            'UTC-03:00': 'America/Sao_Paulo',
            'UTC-04:00': 'America/New_York',
            'UTC-05:00': 'America/Chicago',
            'UTC-06:00': 'America/Denver',
            'UTC-07:00': 'America/Los_Angeles',
            'UTC-08:00': 'America/Anchorage',
            'UTC-09:00': 'Pacific/Gambier',
            'UTC-10:00': 'Pacific/Honolulu',
            'UTC-11:00': 'Pacific/Midway',
            'UTC-12:00': 'Pacific/Baker_Island',
          }

          timezone = timezoneMap[timezone] || 'UTC'
        }

        return {
          name: country.name.common,
          code: country.cca2,
          lat: parseFloat(country.latlng[0]),
          lng: parseFloat(country.latlng[1]),
          timezone: timezone,
          flag: country.flag || '🏳️',
        }
      })
      .filter((country) => {
        // Filter out countries with invalid timezones
        try {
          new Date().toLocaleString('en-US', { timeZone: country.timezone })
          return true
        } catch (error) {
          console.log('error: ', error)
          console.warn(`Invalid timezone for ${country.name}: ${country.timezone}`)
          return false
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    console.log('Processed countries:', processedCountries.length)
    countries.value = processedCountries

    // If no countries loaded, add some fallback data
    if (countries.value.length === 0) {
      console.warn('No countries loaded, using fallback data')
      countries.value = [
        {
          name: 'United States',
          code: 'US',
          lat: 39.8283,
          lng: -98.5795,
          timezone: 'America/New_York',
          flag: '🇺🇸',
        },
        {
          name: 'United Kingdom',
          code: 'GB',
          lat: 55.3781,
          lng: -3.436,
          timezone: 'Europe/London',
          flag: '🇬🇧',
        },
        {
          name: 'Germany',
          code: 'DE',
          lat: 51.1657,
          lng: 10.4515,
          timezone: 'Europe/Berlin',
          flag: '🇩🇪',
        },
        {
          name: 'Japan',
          code: 'JP',
          lat: 36.2048,
          lng: 138.2529,
          timezone: 'Asia/Tokyo',
          flag: '🇯🇵',
        },
        {
          name: 'Australia',
          code: 'AU',
          lat: -25.2744,
          lng: 133.7751,
          timezone: 'Australia/Sydney',
          flag: '🇦🇺',
        },
      ]
    }
  } catch (error) {
    console.error('Error loading countries:', error)

    // Use fallback data if API fails
    countries.value = [
      {
        name: 'United States',
        code: 'US',
        lat: 39.8283,
        lng: -98.5795,
        timezone: 'America/New_York',
        flag: '🇺🇸',
      },
      {
        name: 'United Kingdom',
        code: 'GB',
        lat: 55.3781,
        lng: -3.436,
        timezone: 'Europe/London',
        flag: '🇬🇧',
      },
      {
        name: 'Germany',
        code: 'DE',
        lat: 51.1657,
        lng: 10.4515,
        timezone: 'Europe/Berlin',
        flag: '🇩🇪',
      },
      {
        name: 'France',
        code: 'FR',
        lat: 46.2276,
        lng: 2.2137,
        timezone: 'Europe/Paris',
        flag: '🇫🇷',
      },
      {
        name: 'Japan',
        code: 'JP',
        lat: 36.2048,
        lng: 138.2529,
        timezone: 'Asia/Tokyo',
        flag: '🇯🇵',
      },
      {
        name: 'Australia',
        code: 'AU',
        lat: -25.2744,
        lng: 133.7751,
        timezone: 'Australia/Sydney',
        flag: '🇦🇺',
      },
      {
        name: 'Canada',
        code: 'CA',
        lat: 56.1304,
        lng: -106.3468,
        timezone: 'America/Toronto',
        flag: '🇨🇦',
      },
      {
        name: 'Brazil',
        code: 'BR',
        lat: -14.235,
        lng: -51.9253,
        timezone: 'America/Sao_Paulo',
        flag: '🇧🇷',
      },
      {
        name: 'India',
        code: 'IN',
        lat: 20.5937,
        lng: 78.9629,
        timezone: 'Asia/Kolkata',
        flag: '🇮🇳',
      },
      {
        name: 'China',
        code: 'CN',
        lat: 35.8617,
        lng: 104.1954,
        timezone: 'Asia/Shanghai',
        flag: '🇨🇳',
      },
    ]

    toast.add({
      severity: 'warn',
      summary: 'API Error',
      detail: 'Using fallback country data. Some features may be limited.',
      life: 5000,
    })
  } finally {
    loading.value = false
  }
}

// Detect user's geographical location
const detectUserLocation = async () => {
  try {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported')
    }

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: true,
      })
    })

    userLocation.value = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }

    console.log('User location detected:', userLocation.value)

    // Find closest country to user's location
    if (countries.value.length > 0) {
      const closest = countries.value.reduce((prev, curr) => {
        const prevDistance = getDistance(userLocation.value, {
          latitude: prev.lat,
          longitude: prev.lng,
        })
        const currDistance = getDistance(userLocation.value, {
          latitude: curr.lat,
          longitude: curr.lng,
        })
        return currDistance < prevDistance ? curr : prev
      })

      selectedCountry1.value = closest

      // Set a default second country
      const defaultSecond =
        closest.code === 'US'
          ? countries.value.find((c) => c.code === 'GB')
          : countries.value.find((c) => c.code === 'US')

      selectedCountry2.value = defaultSecond || countries.value[1]

      console.log('Selected countries:', selectedCountry1.value, selectedCountry2.value)
    }
  } catch (error) {
    console.log('Could not detect user location:', error)

    // Set default countries if geolocation fails
    if (countries.value.length > 0) {
      selectedCountry1.value = countries.value.find((c) => c.code === 'US') || countries.value[0]
      selectedCountry2.value = countries.value.find((c) => c.code === 'GB') || countries.value[1]

      console.log('Using default countries:', selectedCountry1.value, selectedCountry2.value)
    }
  }
}

// Update country selections
const updateCountry1 = (country) => {
  selectedCountry1.value = country
}

const updateCountry2 = (country) => {
  selectedCountry2.value = country
}

// Calculate distance when countries change
watch([selectedCountry1, selectedCountry2], () => {
  if (selectedCountry1.value && selectedCountry2.value) {
    calculating.value = true

    setTimeout(() => {
      distance.value =
        getDistance(
          { latitude: selectedCountry1.value.lat, longitude: selectedCountry1.value.lng },
          { latitude: selectedCountry2.value.lat, longitude: selectedCountry2.value.lng },
        ) / 1000 // Convert to kilometers

      calculating.value = false
    }, 500) // Small delay for better UX
  }
})

onMounted(async () => {
  const savedTheme = localStorage.getItem('darkMode')
  isDarkMode.value = savedTheme === 'true'

  await loadCountries()
  await detectUserLocation()
})

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
}
</script>
<!-- </merged_code> -->
