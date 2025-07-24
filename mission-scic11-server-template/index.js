const express = require("express");
const cors = require("cors");

const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  ChangeStream,
} = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

var admin = require("firebase-admin");

var serviceAccount = require("./admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// const serviceAccount = require("./admin-key.json");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🚀 ~ verifyFirebaseToken ~ authHeader:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decodedToken; // You can access user info like uid, email, etc.
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token from catch" });
  }
};

async function run() {
  try {
    await client.connect();
    const db = client.db("db_name");
    const booksCollection = db.collection("books");
    const userCollection = db.collection("users");

    const verifyAdmin = async (req, res, next) => {
      const user = await userCollection.findOne({
        email: req.firebaseUser.email,
      });

      if (user.role === "admin") {
        next();
      } else {
        res.status(403).send({ msg: "unauthorized" });
      }
    };

    app.post("/add-book", async (req, res) => {
      // Book Title, Cover Image, Author Name, Genre, Pickup Location, Available Until
      const data = req.body;
      const result = await booksCollection.insertOne(data);
      res.send(result);
    });

    app.post("/add-user", async (req, res) => {
      const userData = req.body;

      const find_result = await userCollection.findOne({
        email: userData.email,
      });

      if (find_result) {
        userCollection.updateOne(
          { email: userData.email },
          {
            $inc: { loginCount: 1 },
          }
        );
        res.send({ msg: "user already exist" });
      } else {
        const result = await userCollection.insertOne(userData);
        res.send(result);
      }
    });

    app.get("/get-user-role", verifyFirebaseToken, async (req, res) => {
      const user = await userCollection.findOne({
        email: req.firebaseUser.email,
      });
      res.send({ msg: "ok", role: user.role });
    });

    app.get(
      "/get-users",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        const users = await userCollection
          .find({ email: { $ne: req.firebaseUser.email } })
          .toArray();
        res.send(users);
      }
    );

    app.patch(
      "/update-role",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        const { email, role } = req.body;
        const result = await userCollection.updateOne(
          { email: email },
          {
            $set: { role },
          }
        );

        res.send(result);
      }
    );

    app.get("/available-books", async (req, res) => {
      const data = await booksCollection
        .find({ status: "available" })
        .toArray();
      res.send(data);
    });

    app.get("/featured-books", async (req, res) => {
      const data = await booksCollection
        .find({ status: "available" })
        .sort({ createdAt: -1 })
        .limit(4)
        .toArray();
      res.send(data);
    });

    app.get("/my-books", verifyFirebaseToken, async (req, res) => {
      const query = { ownerEmail: req.firebaseUser.email };
      const data = await booksCollection.find(query).toArray();
      res.send(data);
    });

    app.get("/details/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = await booksCollection.findOne(query);
      res.send(data);
    });

    app.patch("/request/:id", verifyFirebaseToken, async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = await booksCollection.updateOne(query, {
        $set: { status: "requested", requestedBy: req.firebaseUser.email },
      });
      res.send(data);
    });

    console.log("connected");
  } finally {
  }
}

run().catch(console.dir);

// Root route
app.get("/", async (req, res) => {
  res.send({ msg: "hello" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

/*
1. authorization
*/
