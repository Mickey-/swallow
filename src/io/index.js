import { JSON2URL } from '../functions'
import * as config from '../config.json'

// IO接口配置
const SERVER = './api'
const API = {
    'upload_file'   : SERVER + '/upload',
    'check_exists'  : SERVER + '/poster/check',
    'save_poster'   : SERVER + '/poster',
    'get_posters'   : SERVER + '/poster',
    'get_my_poster' : SERVER + '/poster/me',
    'get_poster'    : SERVER + '/poster/detail',
    'pub_poster'    : SERVER + '/poster/publish',
    'updata_poster' : SERVER + '/poster',
    'delete_poster' : SERVER + '/poster'
}

const fetch = (url, data = {}, method = 'GET', timeout = 5000) => {

    return new Promise((resolve, reject) => {

        let xhr = new XMLHttpRequest
        xhr.timeout = timeout

        if (method.toLowerCase() !== 'get') {
            xhr.open(method, url, true)
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
            xhr.send(JSON.stringify(data))
        } else {
            xhr.open(method, url + '?' + JSON2URL(data), true)
            xhr.send(null)
        }

        xhr.ontimeout = () => {
            reject({
                'status': 408,
                'msg': '请求超时'
            })
        }

        xhr.onreadystatechange = () => {

            if (xhr.readyState === 4 && xhr.status === 200) {

                try{
                    let data = JSON.parse(xhr.responseText)
                    if (data.status === 0) {
                        resolve(data.data)
                    } else {
                        reject(data)
                    }
                } catch(e) {
                    reject({
                        'status': -2,
                        'msg': e.message
                    })
                }
  
            }

        }

    })

}

export const uploadFile = (file, option_in = {}) => {

    let xhr = new XMLHttpRequest
    let fd = new FormData

    let option = Object.assign({}, {
        'onprogress': (progress) => {},
        'onerror': (e) => {},
        'onupload': () => {}
    }, option_in)

    fd.append('file', file)
    xhr.open("post", API.upload_file, true)
    xhr.upload.addEventListener("progress", () => {option.onupload()}, false)
    xhr.addEventListener("load", () => {
        let data = xhr.responseText
        try {
            data = JSON.parse(data)
            if (data.status === 0) {
                option.onupload(data.data)
            } else {
                option.onerror(data)
            }
        } catch(e) {
            option.onerror(e)
        }
    }, false)
    xhr.addEventListener("error", option.onerror, false)
    xhr.addEventListener("abort", option.onerror, false)
    xhr.send(fd)

}

export const checkExists = (path, fn) => {

    fetch(API.check_exists, { path }).then((data) => {
        typeof fn === 'function' && fn(data)
    })

}

export const savePoster = (data, fn) => {

    fetch(API.save_poster, { data }, 'POST').then(() => {
        typeof fn === 'function' && fn(data)
    })

}

export const getPosters = (index = 0, filter = {}, size = 20) => {

    let page = { index, size }
    return new Promise((resolve, reject) => {
        fetch(API.get_posters, { filter, page }).then((data) => {
            resolve(data)
        }).catch((e) => {
            reject(e)
        })
    })

}

export const getPoster = (id, fn) => {

    return new Promise((resolve, reject) => {
        fetch(API.get_poster, { id }).then((data) => {
            resolve(data)
        }).catch((e) => {
            reject(e)
        })
    })

}

export const publishPoster = (id, fn) => {

    fetch(API.pub_poster, { id }, 'POST').then((data) => {
        typeof fn === 'function' && fn(data)
    })

}

export const updatePoster = (id, params, fn) => {

    fetch(API.updata_poster, { id, params }, 'PUT').then((data) => {
        typeof fn === 'function' && fn(data)
    })

}

export const deletePoster = (id, fn) => {
    fetch(API.delete_poster, { id }, 'DELETE').then((data) => {
        typeof fn === 'function' && fn(data)
    })
}




