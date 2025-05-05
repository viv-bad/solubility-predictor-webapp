<script setup lang="ts">
const smiles = ref("");
const isValid = ref(false);
const isLoading = ref(false);
const validationError = ref("");
const sampleMolecules = ref<any[]>([]);
const debounceTimeout = ref<NodeJS.Timeout | null>(null);

const api = useSolubilityApi();

// Load sample molecules
onMounted(async () => {
  try {
    const response = await api.getSampleMolecules();
    sampleMolecules.value = response.samples;
  } catch (error) {
    console.error("Failed to load sample molecules:", error);
  }
});

// Validate SMILES string with debouncing
const validateSmiles = async () => {
  // Clear any existing timeout
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  // Set a new timeout
  debounceTimeout.value = setTimeout(async () => {
    if (!smiles.value) {
      isValid.value = false;
      validationError.value = "";
      return;
    }

    try {
      const response = await api.validateSmiles(smiles.value);
      isValid.value = response.valid;
      validationError.value = response.valid ? "" : "Invalid SMILES structure";
    } catch (error) {
      isValid.value = false;
      validationError.value = "Validation failed";
    }
  }, 500); // 500ms debounce delay
};

// Set selected sample molecule
const selectSample = (sample: any) => {
  smiles.value = sample.smiles;
  validateSmiles();
};

// Emit prediction request
const emit = defineEmits(["predict"]);
const predict = () => {
  if (isValid.value && !isLoading.value) {
    emit("predict", smiles.value);
  }
};
</script>

<template>
  <div class="molecule-input">
    <div class="mb-6">
      <label
        for="smiles-input"
        class="block text-sm font-medium text-gray-700 mb-2">
        Enter SMILES or select a sample molecule
      </label>
      <div class="flex">
        <input
          id="smiles-input"
          v-model="smiles"
          type="text"
          placeholder="Enter SMILES string (e.g. CC(=O)OC1=CC=CC=C1C(=O)O)"
          @input="validateSmiles"
          class="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <button
          @click="predict"
          :disabled="!isValid || isLoading"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? "Loading..." : "Predict" }}
        </button>
      </div>
      <p v-if="validationError" class="mt-2 text-sm text-red-600">
        {{ validationError }}
      </p>
    </div>

    <!-- Sample Molecules -->
    <div class="mt-8">
      <h4 class="text-lg font-medium text-gray-900 mb-3">Sample Molecules</h4>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <button
          v-for="sample in sampleMolecules"
          :key="sample.name"
          @click="selectSample(sample)"
          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-800 transition-colors duration-150 truncate">
          {{ sample.name }}
        </button>
      </div>
    </div>
  </div>
</template>
