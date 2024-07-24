require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.connect(process.env.dbURI)
    .then(() => {
        console.log('DB connected successfully');

        app.listen(port, () => console.log(`Server running on port: http://localhost:${port}!`));
    })
    .catch(err => console.log(err, 'Connection unsuccessful'));