const express = require('express');
const app = express ();

app.use (express.json());
app.use (express.urlencoded({
    extended: false,
}));

const userRouter = require('./routes/userRoutes');
const gameRouter = require('./routes/gameRoutes');

app.use('/users', userRouter);
app.use('/games', gameRouter);

app.listen (3000, () => {
    console.log('Server started on port 3000.');
});
