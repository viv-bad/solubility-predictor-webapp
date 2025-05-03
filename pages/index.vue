<script setup lang="ts">
const currentSmiles = ref("");
const predictionResult = ref(null);

// Uncomment and properly implement the API usage
const { isLoading, error, predictWithVisualization } = useSolubilityApi();

const handlePredict = async (smiles: string) => {
  currentSmiles.value = smiles;
  predictionResult.value = null;

  try {
    const result = await predictWithVisualization(smiles);
    predictionResult.value = result;
  } catch (err) {
    console.error("Prediction failed", err);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <header class="max-w-3xl mx-auto text-center mb-12">
      <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-3">
        Molecular Solubility Predictor
      </h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Predict the solubility of molecules using a Graph Neural Network model
      </p>
    </header>

    <div class="max-w-4xl mx-auto">
      <div class="bg-white shadow-md rounded-lg p-6 mb-8">
        <MoleculeInput @predict="handlePredict" />
      </div>

      <div v-if="currentSmiles" class="visualization-section">
        <MoleculeViewer
          :smiles="currentSmiles"
          :molecule-data="predictionResult" />
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
