const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

let username; 

app.get('/login', (req, res, next) => {
    res.send('<form action="/user" method="POST"><label for="username">username:</label><br> <input type="text" name="username"><button type="submit">Send</button></form>');
})

app.post('/user', (req, res, next) => {
    username = req.body.username;
    console.log(username);
    res.send(`
    <script>
        localStorage.setItem('username', '${username}');
        window.location.href = '/';
    </script>
`);
    res.redirect('/');
})

app.get('/', (req, res, next) => {
    if (fs.existsSync('./chat.txt')) {
        const txt = fs.readFileSync('chat.txt');
        res.send(`${txt}<br><hr><form action="/mess"><label for="mess">Message:</label><br><input type="text" name="mess"><button type="submit">Send</button></form>`);

    }
    else {
        res.send(`<br><hr><form action="/mess"><label for="mess">Message:</label><br><input type="text" name="mess"><button type="submit">Send</button></form>`);

    }

});

app.use('/mess', (req, res, next) => {
    fs.appendFile('chat.txt', `${username}:${req.query.mess}\n`, function (err) {
        if (err) throw err;
        console.log('Message saved!');
    });
    res.redirect('/');

});

app.listen(2000);
