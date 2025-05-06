export default defineNuxtPlugin(async () => {
  if (process.client) {
    const { wakeUpServer } = useSolubilityApi();

    // Create a global state for server wakeup status
    const serverWaking = useState("serverWaking", () => true);

    wakeUpServer().then((isAwake) => {
      serverWaking.value = false;
      if (isAwake) {
        console.log("Server is awake");
      } else {
        console.log("Server is not awake");
      }
    });

    // Expose the server waking state to the app
    return {
      provide: {
        serverWaking,
      },
    };
  }
});
