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

export interface SampleMoleculesResponse {
  samples: {
    name: string;
    smiles: string;
    solubility_level: string;
  }[];
}

export interface ValidateSmilesResponse {
  valid: boolean;
  atom_count: number;
  bond_count: number;
  has_aromaticity: boolean;
}

export interface BatchPredictionResponse {
  predictions: PredictionResponse[];
  invalid_count: number;
  valid_count: number;
  invalid_smiles: string[];
}
