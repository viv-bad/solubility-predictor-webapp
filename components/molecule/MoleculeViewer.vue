<script setup lang="ts">
const props = defineProps({
  smiles: {
    type: String,
    default: "",
  },
  moleculeData: {
    type: Object,
    default: () => ({}),
  },
  moleculeName: {
    type: String,
    default: "",
  },
});

const moleculeContainer = ref(null);
const loading = ref(true);
const error = ref("");
let rdkitInstance = null;

const initRDKit = async () => {
  const RDKit = await import("@rdkit/rdkit");
  return RDKit;
};

onMounted(async () => {
  try {
    // initialize RDKit
    rdkitInstance = await initRDKit();
    loading.value = false;

    //  render molecule if SMILEs is given
    if (props.smiles) {
      renderMolecule();
    }
  } catch (error: any) {
    loading.value = false;
    error.value = "Failed to load molecule visualization library";
    console.error(error);
  }
});

// watch(
//   () => props.smiles,
//   () => {
//     if (props.smiles && !loading.value && rdkitInstance) {
//       renderMolecule();
//     }
//   }
// );

watch(
  () => props.moleculeData,
  () => {
    if (props.moleculeData?.image) {
      renderMoleculeImage();
    }
  },
  { immediate: true }
);

const renderMolecule = () => {
  if (!moleculeContainer.value || !rdkitInstance) return;

  try {
    // clear previous rendering
    moleculeContainer.value.innerHTML = "";

    // Create molecule from SMILES
    const mol = rdkitInstance.get_mol(props.smiles);

    if (!mol) {
      error.value = "Invalid molecule";
      return;
    }

    const svg = mol.get_svg();

    moleculeContainer.value.innerHTML = svg;
  } catch (error: any) {
    error.value = "Failed to render molecule";
    console.error(error);
  }
};

const renderMoleculeImage = () => {
  if (!moleculeContainer.value || !props.moleculeData?.image) return;

  try {
    // clear previous rendering
    moleculeContainer.value.innerHTML = "";

    // Create an image element from the base64 data
    const img = document.createElement("img");
    img.src = `data:image/png;base64,${props.moleculeData.image}`;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";

    moleculeContainer.value.appendChild(img);
  } catch (error) {
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
