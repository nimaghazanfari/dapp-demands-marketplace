import axios from 'axios';

const API = {
    post: (api, data) => {
        const header = localStorage.getItem('user');
        
        return axios({
            method: 'POST',
            url: `${process.env.REACT_APP_ENDPOINT}/${api}`,
            data: data,
            headers: {
                Authorization: header && JSON.parse(header).token
            }
        });
    }
}

export default API;