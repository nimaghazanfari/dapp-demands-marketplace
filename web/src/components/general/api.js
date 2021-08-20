import axios from 'axios';

const API = {
    post: (api, data) => {
        const header = localStorage.getItem('user');
        
        return axios({
            method: 'POST',
            url: `${process.env.REACT_APP_ENDPOINT}/${api}`,
            data: data,
            headers: {
                Authorization: header && JSON.parse(header).token,
                user: header && JSON.parse(header).user,
                role: header && JSON.parse(header).role
            }
        });
    }
}

export default API;