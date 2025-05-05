<script setup lang="ts">
import type { PredictionResponse } from "@/types/api";

const props = defineProps<{
  smiles: string;
  moleculeData: PredictionResponse | null;
  moleculeName: string | "null";
}>();

const moleculeContainer = ref(null);
const loading = ref(false);
const error = ref("");

watch(
  () => props.moleculeData,
  () => {
    if (props.moleculeData?.image) {
      renderMoleculeImage();
    }
  },
  { immediate: true }
);

const renderMoleculeImage = () => {
  if (!moleculeContainer.value || !props.moleculeData?.image) return;

  try {
    // clear previous rendering
    (moleculeContainer.value as HTMLElement).innerHTML = "";

    // Create an image element from the base64 data
    const img = document.createElement("img");
    img.src = `data:image/png;base64,${props.moleculeData.image}`;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";

    (moleculeContainer.value as HTMLElement).appendChild(img);
  } catch (error: any) {
    error.value = "Failed to render molecule image";
    console.error(error);
  }
};
</script>

<template>
  <div class="bg-white shadow-md rounded-lg p-6 mb-8">
    <div v-if="loading" class="py-8 text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-4"></div>
      <p class="text-gray-600">Loading molecule visualization...</p>
    </div>

    <div v-else-if="error" class="py-6 text-center">
      <div class="bg-red-50 border border-red-200 rounded-md p-4">
        <p class="text-red-600">{{ error }}</p>
      </div>
    </div>

    <div v-else class="flex flex-col md:flex-row gap-6">
      <div
        ref="moleculeContainer"
        class="molecule-container flex-1 flex items-center justify-center min-h-[200px] bg-gray-50 rounded-lg p-4"></div>

      <div class="molecule-info flex-1">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">
          {{ moleculeName || moleculeData?.compound_name || "Molecule" }}
        </h3>

        <div class="properties space-y-3 bg-gray-50 rounded-md p-4">
          <div
            class="property flex justify-between items-center border-b border-gray-200 pb-2">
            <span class="text-sm text-gray-600">Molecular Weight:</span>
            <span class="font-medium text-gray-900">{{
              moleculeData?.mol_weight?.toFixed(2) || "N/A"
            }}</span>
          </div>

          <div
            class="property flex justify-between items-center border-b border-gray-200 pb-2">
            <span class="text-sm text-gray-600">LogP:</span>
            <span class="font-medium text-gray-900">{{
              moleculeData?.logp?.toFixed(2) || "N/A"
            }}</span>
          </div>

          <div class="property flex justify-between items-center">
            <span class="text-sm text-gray-600">Atoms:</span>
            <span class="font-medium text-gray-900">{{
              moleculeData?.num_atoms || "N/A"
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
