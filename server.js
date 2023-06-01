const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
const htmlRoutes = require('./routes/htmlRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));