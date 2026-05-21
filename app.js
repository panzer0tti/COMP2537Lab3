const express = require('express');

const app = express();
const port = process.env.PORT || 3000;


app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.use((req, res) => {
    res.status(404).send('Page not found - 404');
});

app.listen(port, () => {
    console.log(`running on http://localhost:${port}`);
});