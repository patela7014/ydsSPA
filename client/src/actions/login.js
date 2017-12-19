import axios from 'axios'

const baseURI = 'http://localhost:4200';

export const login = (data, callback) => (dispatch) => {
        axios.post(baseURI+"/login", {
            email: data.email,
            password: data.password
        })
        .then((res) => {
            callback(res.data);
            dispatch({ type: "LOGIN", payload: res.data })
        })
};
