const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_FAVORITE':
            return {
                ...state,
                mylist: [...state.mylist, action.payload],
                trends: state.trends.filter(item => item.id !== action.payload.id),
                originals: state.originals.filter(item => item.id !== action.payload.id)
            };
        case 'DELETE_FAVORITE':
            let trends, originals;    

            if (action.payload.contentRating === 'R') {
                trends = [...state.trends, action.payload];
                originals = state.originals; 
            } else if (action.payload.contentRating === 'G') {
                trends = state.trends;
                originals = [...state.originals, action.payload]; 
            }
            
            return {
                ...state,
                mylist: state.mylist.filter(items => items._id !== action.payload._id),
                trends: trends,
                originals: originals
            }
        case 'LOGIN_REQUEST':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT_REQUEST':
            return {
                ...state,
                user: action.payload
            }
        case 'REGISTER_REQUEST':
            return {
                ...state,
                user: action.payload
            }
        case 'GET_VIDEO_SOURCE':
            return {
                ...state,
                playing: state.trends.find(item => item._id === action.payload)
                    || state.originals.find(item => item._id === action.payload)
                    || [] 
            }
        case 'SEARCH_VIDEO':
            if (action.payload === '') {
                return {
                    ...state,
                    search: []
                }
            }

            const lists = [...state.trends, ...state.originals];

            return {
                ...state,
                search: lists.filter(item => item.title.toLowerCase().includes(action.payload))
            }
        default:
            return state;
    }
};

export default reducer;
