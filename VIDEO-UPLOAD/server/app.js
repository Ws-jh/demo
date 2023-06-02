const express = require('express');
const fileUpload = require('express-fileupload');
const { join } = require('path');
const { appendFileSync, existsSync } = require('fs');

const PORT = 5002;
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
// 访问静态资源
app.use('/', express.static('file-temp'));

// 设置跨域
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET');

    next();
});

app.post('/upload', (req, res) => {
    const {
        name,
        fullSize,
        type,
        startChunk,
        chunkSize
    } = req.body


    const { file } = req.files
    const filePath = join(__dirname, 'file-temp/' + name);
    if (!file) {
        res.send({
            code: 0000,
            msg: 'no File'
        })
        return
    }

    if (Number(startChunk) !== 0) {
        if (!existsSync(filePath)) {
            res.send({
                code: 1000,
                msg: 'no File Error'
            });
            return
        }
    }
    appendFileSync(filePath, file.data);
    
    if (chunkSize === fullSize) {
        res.send({
            code: 1002,
            msg: 'upload is finish'
        })
    } else {
        res.send({
            code: 1001,
            msg: 'append'
        })
    }
});

app.listen(PORT, () => {
    console.log('Server is running on ' + PORT);
});
