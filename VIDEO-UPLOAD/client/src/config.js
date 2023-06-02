const base_url = 'http://localhost:5002';

const TIPMAP = {
    'noFile': '未选择文件',
    'success': '上传成功',
    'fail': '上传失败'
};

const CHUNKSIZE = 100 * 1024;

const API = {
    'upload': base_url + '/upload'
}

export {
    TIPMAP,
    CHUNKSIZE,
    API
}