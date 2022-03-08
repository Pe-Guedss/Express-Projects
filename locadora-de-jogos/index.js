const express = require('express');
const app = express ();

app.use (express.json());
app.use (express.urlencoded({
    extended: false,
}));

const userRouter = require("./routes/userRoutes");
const gameRouter = require("./routes/gameRoutes");
const usersUpdate = require("./routes/usersUpdate");

app.use("/users", userRouter);
app.use("/games", gameRouter);
app.use("/update", usersUpdate);


app.listen (3001, () => {
    console.log("Server started on port 3001.");
});

