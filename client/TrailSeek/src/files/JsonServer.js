import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.trailseek.eu/v1'
});