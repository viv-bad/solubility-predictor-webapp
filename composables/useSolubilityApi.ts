interface SolubilityApiOptions {
  baseUrl?: string;
}

export function useSolubilityApi(options: SolubilityApiOptions = {}) {
  const baseUrl = options.baseUrl || "http://localhost:8000";
  const isLoading = ref(false);
  const error = ref("");

  // Predict solubility for a single molecule
  const predictSolubility = async (smiles: string) => {
    isLoading.value = true;
    error.value = "";

    try {
      const response = await fetch(`${baseUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ smiles }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      error.value = error.message || "Failed to predict solubility";
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Predict with visualization
  const predictWithVisualization = async (smiles: string) => {
    isLoading.value = true;
    error.value = "";

    try {
      const formData = new FormData();
      formData.append("smiles", smiles);

      const response = await fetch(`${baseUrl}/predict-with-visualization`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("DATA: ", data);
      return data;
    } catch (error: any) {
      error.value = error.message || "Failed to predict with visualization";
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Get sample molecules
  const getSampleMolecules = async () => {
    isLoading.value = true;
    error.value = "";

    try {
      const response = await fetch(`${baseUrl}/sample-molecules`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      error.value = error.message || "Failed to get sample molecules";
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Validate SMILES
  const validateSmiles = async (smiles: string) => {
    const formData = new FormData();
    formData.append("smiles", smiles);

    try {
      const response = await fetch(`${baseUrl}/validate-smiles`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error("SMILES validation error:", error);
      return { valid: false };
    }
  };

  // Batch prediction
  const predictBatch = async (smilesList: string[]) => {
    isLoading.value = true;
    error.value = "";

    try {
      const response = await fetch(`${baseUrl}/batch-predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ smiles_list: smilesList }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      error.value = error.message || "Failed to process batch prediction";
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
