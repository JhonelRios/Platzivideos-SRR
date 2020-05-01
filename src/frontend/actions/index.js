import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const setFavorite = payload => ({
    type: 'SET_FAVORITE',
    payload
});

export const deleteFavorite = payload => ({
    type: 'DELETE_FAVORITE',
    payload
});

export const loginRequest = payload => ({
    type: 'LOGIN_REQUEST',
    payload
});

export const logoutRequest = payload => ({
    type: 'LOGOUT_REQUEST',
    payload
});

export const registerRequest = payload => ({
    type: 'REGISTER_REQUEST',
    payload
});

export const getVideoSource = payload => ({
    type: 'GET_VIDEO_SOURCE',
    payload
});

export const searchVideo = payload => ({
    type: 'SEARCH_VIDEO',
    payload
});

export const registerUser = (payload, redirectUrl) => {
    return async (dispatch) => {
        try {
            const { data } = await axios({
                url: `${API_URL}/auth/sign-up`,
                method: 'post',
                data: payload
            });

            dispatch(registerRequest(data));
            window.location.href = redirectUrl;
        } catch (error) {
            console.log(new Error(error));
        }
    };
};

export const loginUser = (payload, redirectUrl) => {
    return async (dispatch) => {
        const { email, password } = payload;

        try {
            const { data } = await axios({
                url: `${API_URL}/auth/sign-in`,
                withCredentials: true,
                method: 'post',
                auth: {
                    username: email,
                    password
                }
            });

            document.cookie = `email=${data.email}`;
            document.cookie = `name=${data.name}`;
            document.cookie = `id=${data.id}`;

            dispatch(loginRequest(data));
            window.location.href = redirectUrl;
        } catch (error) {
            console.log(new Error(error));
        }
    }
}

export const setUserFavorite = (payload) => {
    return async (dispatch) => {
        const { _id: movieId } = payload

        try {
            const { data } = await axios({
                url: `${API_URL}/user-movies`,
                withCredentials: true,
                method: 'post',
                data: { movieId }
            });

            dispatch(setFavorite(payload));
        } catch (error) {
            console.log(new Error(error));
        }
    }
}

export const deleteUserFavorite = (payload) => {
    return async (dispatch) => {
        const { _id: movieId } = payload;

        try {
            const { data } = await axios({
                url: `${API_URL}/user-movies/${movieId}`,
                withCredentials: true,
                method: 'delete'
            });

            dispatch(deleteFavorite(payload));
        } catch (error) {
            console.log(new Error(error));
        }
    }
}