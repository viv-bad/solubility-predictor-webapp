// RDKit initialization utility
let rdkitInstance: any = null;
let rdkitPromise: any = null;

export async function initRDKit() {
  // If RDKit is already loaded, return the instance
  if (rdkitInstance) {
    return rdkitInstance;
  }

  // If RDKit is being loaded, wait for it
  if (rdkitPromise) {
    return rdkitPromise;
  }

  // Load RDKit
  rdkitPromise = new Promise((resolve, reject) => {
    // Load the RDKit JS file
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@rdkit/rdkit/dist/RDKit_minimal.js";
    script.async = true;

    script.onload = () => {
      // Initialize RDKit
      window
        .initRDKitModule()
        .then((RDKit: any) => {
          rdkitInstance = RDKit;
          resolve(RDKit);
        })
        .catch(reject);
    };

    script.onerror = () => {
      reject(new Error("Failed to load RDKit"));
    };

    document.head.appendChild(script);
  });

  return rdkitPromise;
}
