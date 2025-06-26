<template>
  <prime_card class="time-card animate__animated animate__fadeIn">
    <template #title>
      <div class="flex items-center space-x-2">
        <i class="pi pi-globe text-primary-500"></i>
        <span>Select Countries</span>
        <prime_badge
          v-if="countries.length > 0"
          :value="`${countries.length} countries`"
          severity="info"
        />
      </div>
    </template>

    <template #content>
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <prime_progress_spinner style="width: 50px; height: 50px" strokeWidth="4" />
        <span class="ml-3 text-gray-600 dark:text-gray-400">Loading countries...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="countries.length === 0" class="text-center py-8">
        <i class="pi pi-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
        <p class="text-gray-600 dark:text-gray-400">
          No countries available. Please refresh the page.
        </p>
      </div>

      <!-- Country Selectors -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- First Country Selector -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            First Location
          </label>
          <prime_select
            v-model="selectedCountry1"
            :options="countries"
            optionLabel="name"
            placeholder="Select a country"
            :loading="loading"
            :disabled="loading"
            class="w-full"
            :pt="{
              root: 'min-h-[3rem]',
              input: 'flex items-center space-x-2',
            }"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center space-x-2">
                <span class="text-lg">{{ slotProps.value.flag }}</span>
                <span>{{ slotProps.value.name }}</span>
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>

            <template #option="slotProps">
              <div class="flex items-center space-x-2 p-2">
                <span class="text-lg">{{ slotProps.option.flag }}</span>
                <div>
                  <div class="font-medium">{{ slotProps.option.name }}</div>
                  <div class="text-xs text-gray-500">{{ slotProps.option.timezone }}</div>
                </div>
              </div>
            </template>
          </prime_select>
        </div>

        <!-- Second Country Selector -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Second Location
          </label>
          <prime_select
            v-model="selectedCountry2"
            :options="countries"
            optionLabel="name"
            placeholder="Select a country"
            :loading="loading"
            :disabled="loading"
            class="w-full"
            :pt="{
              root: 'min-h-[3rem]',
              input: 'flex items-center space-x-2',
            }"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center space-x-2">
                <span class="text-lg">{{ slotProps.value.flag }}</span>
                <span>{{ slotProps.value.name }}</span>
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>

            <template #option="slotProps">
              <div class="flex items-center space-x-2 p-2">
                <span class="text-lg">{{ slotProps.option.flag }}</span>
                <div>
                  <div class="font-medium">{{ slotProps.option.name }}</div>
                  <div class="text-xs text-gray-500">{{ slotProps.option.timezone }}</div>
                </div>
              </div>
            </template>
          </prime_select>
        </div>
      </div>
    </template>
  </prime_card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  loading: Boolean,
  countries: Array,
  selectedCountry1: Object,
  selectedCountry2: Object,
})

const emit = defineEmits(['update:country1', 'update:country2'])

const selectedCountry1 = computed({
  get: () => props.selectedCountry1,
  set: (value) => emit('update:country1', value),
})

const selectedCountry2 = computed({
  get: () => props.selectedCountry2,
  set: (value) => emit('update:country2', value),
})
</script>
