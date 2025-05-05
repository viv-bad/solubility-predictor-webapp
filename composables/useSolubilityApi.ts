import type {
  BatchPredictionResponse,
  PredictionResponse,
  SampleMoleculesResponse,
  ValidateSmilesResponse,
} from "~/types/api";

export function useSolubilityApi() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl || "http://localhost:8000";
  const isLoading = ref(false);
  const error = ref("");

  // Predict solubility for a single molecule
  const predictSolubility = async (
    smiles: string
  ): Promise<PredictionResponse> => {
    isLoading.value = true;
    error.value = "";

    try {
      const data = await $fetch<PredictionResponse>(`${baseUrl}/predict`, {
        method: "POST",
        body: { smiles },
      });

      return data;
    } catch (error: any) {
      error.value =
        error.data?.message || error.message || "Failed to predict solubility";
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Predict with visualization
  const predictWithVisualization = async (
    smiles: string
  ): Promise<PredictionResponse> => {
    isLoading.value = true;
    error.value = "";

    try {
      const formData = new FormData();
      formData.append("smiles", smiles);

      const data = await $fetch<PredictionResponse>(
        `${baseUrl}/predict-with-visualization`,
        {
          method: "POST",
          body: formData,
        }
      );
      return data;
    } catch (error: any) {
      error.value =
        error.data?.message ||
        error.message ||
        "Failed to predict with visualization";
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Get sample molecules
  const getSampleMolecules = async (): Promise<SampleMoleculesResponse> => {
    isLoading.value = true;
    error.value = "";

    try {
      const data = await $fetch<SampleMoleculesResponse>(
        `${baseUrl}/sample-molecules`
      );
      return data;
    } catch (error: any) {
      error.value =
        error.data?.message ||
        error.message ||
        "Failed to get sample molecules";
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Validate SMILES
  const validateSmiles = async (
    smiles: string
  ): Promise<ValidateSmilesResponse> => {
    const formData = new FormData();
    formData.append("smiles", smiles);

    try {
      const data = await $fetch<ValidateSmilesResponse>(
        `${baseUrl}/validate-smiles`,
        {
          method: "POST",
          body: formData,
        }
      );

      return data;
    } catch (error: any) {
      error.value =
        error.data?.message || error.message || "Failed to validate SMILES";
      throw error;
    }
  };

  // Batch prediction
  const predictBatch = async (
    smilesList: string[]
  ): Promise<BatchPredictionResponse> => {
    isLoading.value = true;
    error.value = "";

    try {
      const data = await $fetch<BatchPredictionResponse>(
        `${baseUrl}/batch-predict`,
        {
          method: "POST",
          body: { smiles_list: smilesList },
        }
      );

      return data;
    } catch (error: any) {
      error.value =
        error.data?.message ||
        error.message ||
        "Failed to process batch prediction";
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    predictSolubility,
    predictWithVisualization,
    getSampleMolecules,
    validateSmiles,
    predictBatch,
  };
}
