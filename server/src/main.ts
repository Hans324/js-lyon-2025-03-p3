// Load environment variables from .env file
import "dotenv/config";

// Check database connection
import "../database/checkConnection";

// Import the Express application
import app from "./app";

// Get port from environment variables with fallback
const port = Number(process.env.APP_PORT) || 3000;

// Start the server
app
  .listen(port, () => {
    console.info(`Server is listening on port ${port}`);
  })
  .on("error", (err: Error) => {
    console.error("Server error:", err.message);
  });
