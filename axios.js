import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://dantegame-598fc-default-rtdb.firebaseio.com/'
})

export default instance