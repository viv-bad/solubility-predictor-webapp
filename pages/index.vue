<script setup lang="ts">
import type { PredictionResponse } from "@/types/api";
const currentSmiles = ref("");
const predictionResult = ref<PredictionResponse | null>(null);

const { isLoading, error, predictWithVisualization } = useSolubilityApi();
const { $serverWaking } = useNuxtApp();

const handlePredict = async (smiles: string) => {
  currentSmiles.value = smiles;
  predictionResult.value = null;

  try {
    const result: PredictionResponse = await predictWithVisualization(smiles);
    predictionResult.value = result;
  } catch (err) {
    console.error("Prediction failed", err);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <!-- Server waking overlay -->
    <ClientOnly>
      <div
        v-if="$serverWaking"
        class="fixed inset-0 bg-gray-800/75 flex items-center justify-center z-50">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
          <p class="text-white text-lg font-medium">
            Our prediction server is starting up...
          </p>
          <p class="text-white text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    </ClientOnly>

    <header class="max-w-3xl mx-auto text-center mb-12">
      <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-3">
        Molecular Solubility Predictor
      </h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Predict the solubility of molecules using a Graph Neural Network model
      </p>
    </header>

    <div class="max-w-4xl mx-auto">
      <!-- Status message -->
      <ClientOnly>
        <div
          v-if="$serverWaking"
          class="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
          <p class="text-amber-700">
            Our prediction server is starting up. This may take a moment...
          </p>
        </div>
        <div
          v-else
          class="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
          <p class="text-green-700">
            Our prediction server is ready to go! Either input a SMILES formula
            below or select an example...
          </p>
        </div>
      </ClientOnly>

      <div class="bg-white shadow-md rounded-lg p-6 mb-8">
        <MoleculeInput @predict="handlePredict" />
      </div>

      <div v-if="currentSmiles" class="visualization-section">
        <MoleculeViewer
          :smiles="currentSmiles"
          :molecule-data="predictionResult"
          :molecule-name="predictionResult?.compound_name || 'Molecule'" />
      </div>

      <div class="results-section">
        <PredictionResult
          :prediction-data="predictionResult"
          :loading="isLoading"
          :error="error" />
      </div>
    </div>
  </div>
</template>
