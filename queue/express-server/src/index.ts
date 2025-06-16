import express, { Request, Response, NextFunction } from "express";
import { createClient } from "redis";

const app = express();
const port = 3000;
const client = createClient();

app.use(express.json({ limit: "16kb" }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const redislearn = async (req: Request, res: Response, next: NextFunction) => {
  const { problemId, code, language } = req.body;

  if (!problemId || !code || !language) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    await client.lPush("submissions", JSON.stringify({ code, language, problemId }));
    res.status(200).send("Submission received and stored.");
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).send("Failed to store submission.");
  }
};

//@ts-ignore
app.post("/submit", async (req: Request, res: Response) => {
  const { problemId, code, language } = req.body;

  if (!problemId || !code || !language) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    await client.lPush("submissions", JSON.stringify({ code, language, problemId }));
    res.status(200).send("Submission received and stored.");
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).send("Failed to store submission.");
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("Redis connected");

    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}

startServer();
