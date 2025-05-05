<script setup lang="ts">
import type { PredictionResponse } from "@/types/api";

const props = defineProps<{
  predictionData: PredictionResponse | null;
  loading: boolean;
  error: string;
}>();

const solubilityDescription = computed(() => {
  const solubility = props.predictionData?.predicted_solubility;

  if (solubility === undefined || solubility === null)
    return "unknown solubility characteristics"; // Handle null/undefined

  if (solubility > 0) {
    return "very high solubility, making it easily dissolvable in water";
  } else if (solubility > -2) {
    return "high solubility, generally well-suited for aqueous environments";
  } else if (solubility > -4) {
    return "moderate solubility, which may be suitable for many applications";
  } else if (solubility > -6) {
    return "low solubility, which may require solubility enhancers in formulations";
  } else {
    return "very low solubility, which could present challenges for dissolution";
  }
});
</script>

<template>
  <div class="bg-white shadow-md rounded-lg p-6 mt-8">
    <div v-if="loading" class="py-8 text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-4"></div>
      <p class="text-gray-600">Calculating solubility prediction...</p>
    </div>

    <div v-else-if="error" class="py-6 text-center">
      <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
        <p class="text-red-600">{{ error }}</p>
      </div>
    </div>

    <div v-else-if="predictionData" class="results">
      <div class="border-b border-gray-200 pb-4 mb-6">
        <h3 class="text-xl font-semibold text-gray-800">
          Solubility Prediction Results
        </h3>
      </div>

      <!-- Uncomment when SolubilityGauge component is ready -->
      <!-- <div class="mb-6">
        <SolubilityGauge
          :value="predictionData.predicted_solubility"
          :level="predictionData.solubility_level" />
      </div> -->

      <div class="bg-gray-50 rounded-md p-4 mb-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="result-item">
            <span class="block text-sm text-gray-500 mb-1"
              >Predicted Solubility:</span
            >
            <span class="text-lg font-medium text-gray-900">{{
              predictionData.predicted_solubility?.toFixed(2) || "N/A"
            }}</span>
          </div>
          <div class="result-item">
            <span class="block text-sm text-gray-500 mb-1"
              >Solubility Level:</span
            >
            <span class="text-lg font-medium text-gray-900">{{
              predictionData.solubility_level || "N/A"
            }}</span>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-100 rounded-md p-4">
        <p class="text-blue-800">
          This molecule has {{ solubilityDescription }}.
        </p>
      </div>
    </div>
  </div>
</template>
