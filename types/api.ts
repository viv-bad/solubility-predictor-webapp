export interface PredictionResponse {
  smiles: string;
  compound_name: string;
  predicted_solubility: number;
  solubility_level: string;
  mol_weight: number;
  log_p: number;
  num_atoms: number;
  image?: string;
}
