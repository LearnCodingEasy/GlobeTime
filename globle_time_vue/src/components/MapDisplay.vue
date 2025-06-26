<template>
  <prime_card class="time-card animate__animated animate__fadeIn">
    <template #title>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <i class="pi pi-map text-primary-500"></i>
          <span>World Map</span>
        </div>
        <prime_badge
          :value="`${Math.round(distance).toLocaleString()} km apart`"
          severity="success"
        />
      </div>
    </template>

    <template #content>
      <div
        ref="mapContainer"
        class="w-full h-96 rounded-lg shadow-inner bg-gray-100 dark:bg-gray-700"
      ></div>

      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>{{ country1.flag }} {{ country1.name }}</span>
          <span class="text-gray-500"
            >({{ country1.lat.toFixed(2) }}, {{ country1.lng.toFixed(2) }})</span
          >
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>{{ country2.flag }} {{ country2.name }}</span>
          <span class="text-gray-500"
            >({{ country2.lat.toFixed(2) }}, {{ country2.lng.toFixed(2) }})</span
          >
        </div>
      </div>
    </template>
  </prime_card>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import L from 'leaflet'

const props = defineProps({
  country1: Object,
  country2: Object,
  distance: Number,
})

const mapContainer = ref(null)
let map = null
let markers = []
let polyline = null

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Initialize map
const initMap = async () => {
  await nextTick()

  if (!mapContainer.value || map) return

  map = L.map(mapContainer.value, {
    zoomControl: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    touchZoom: true,
  }).setView([20, 0], 2)

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map)

  updateMapMarkers()
}

// Update map markers and line
const updateMapMarkers = () => {
  if (!map || !props.country1 || !props.country2) return

  // Clear existing markers and polyline
  markers.forEach((marker) => map.removeLayer(marker))
  if (polyline) map.removeLayer(polyline)
  markers = []

  // Create custom icons
  const blueIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })

  const redIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })

  // Add markers
  const marker1 = L.marker([props.country1.lat, props.country1.lng], { icon: blueIcon })
    .bindPopup(
      `
      <div class="text-center">
        <div class="text-lg font-semibold">${props.country1.flag} ${props.country1.name}</div>
        <div class="text-sm text-gray-600">${props.country1.timezone}</div>
      </div>
    `,
    )
    .addTo(map)

  const marker2 = L.marker([props.country2.lat, props.country2.lng], { icon: redIcon })
    .bindPopup(
      `
      <div class="text-center">
        <div class="text-lg font-semibold">${props.country2.flag} ${props.country2.name}</div>
        <div class="text-sm text-gray-600">${props.country2.timezone}</div>
      </div>
    `,
    )
    .addTo(map)

  markers.push(marker1, marker2)

  // Add connecting line
  polyline = L.polyline(
    [
      [props.country1.lat, props.country1.lng],
      [props.country2.lat, props.country2.lng],
    ],
    {
      color: '#8b5cf6',
      weight: 3,
      opacity: 0.8,
      dashArray: '10, 10',
    },
  ).addTo(map)

  // Fit map to show both markers
  const group = new L.featureGroup(markers)
  map.fitBounds(group.getBounds().pad(0.1))
}

onMounted(() => {
  initMap()
})

watch(
  [() => props.country1, () => props.country2],
  () => {
    updateMapMarkers()
  },
  { deep: true },
)
</script>

<style scoped>
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.leaflet-popup-tip) {
  background: white;
}
</style>
