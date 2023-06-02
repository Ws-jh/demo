import { TIPMAP, CHUNKSIZE, API } from './config';

const oProgress = document.querySelector('#progress');
const oFile = document.querySelector('#file');
const oTip = document.querySelector('#tip');
const oBtn = document.querySelector('#btn');


// 定义全局变量
let file = null;


const init = () => {
    bindEvent()
};

function bindEvent() {
    oBtn.addEventListener('click', getFile, false);
}

async function getFile() {
    file = oFile.files[0];
    if (!file) {
        oTip.innerText = TIPMAP['noFile'];
        return
    }

    const { name, size, type } = file;
    oProgress.max = size;

    // 分片处理
    let uploadedSize = 0;
    while(uploadedSize < size) {
        const fileChunk = file.slice(uploadedSize, uploadedSize + CHUNKSIZE);
        const fd = createFromData({
            name,
            fullSize: size,
            type,
            startChunk: uploadedSize,
            chunkSize: uploadedSize + CHUNKSIZE,
            file: fileChunk
        })

        try {
            await axios.post(API['upload'], fd)
        } catch (e) {
            oTip.innerText = TIPMAP['fail'];
            return;
        }

        uploadedSize += CHUNKSIZE;
        oProgress.value = uploadedSize;
    }

    oTip.innerText = TIPMAP['success'];
    oFile.value = null;
    oProgress.value = 0;
}

function createFromData({
    name,
    fullSize,
    type,
    startChunk,
    chunkSize,
    file
}) {
    const fd = new FormData();
    fd.append('name', name);
    fd.append('fullSize', fullSize);
    fd.append('type', type);
    fd.append('startChunk', startChunk);
    fd.append('chunkSize', chunkSize);
    fd.append('file', file);

    return fd;
}

init();
