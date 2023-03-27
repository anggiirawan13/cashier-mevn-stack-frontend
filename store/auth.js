import jwt_decode from 'jwt-decode'

const state = () => ({
  access_token: null,
  refresh_token: null,
  fullname: null,
});

const getters = {
  authenticated: (state) => {
    return state.access_token;
  },
  user: (state) => {
    const accessToken = state.access_token
    console.log(accessToken)
    return accessToken ? jwt_decode(accessToken) : false
  }
};

const mutations = {
  setAccessToken(state, access_token) {
    state.access_token = access_token;
  },
  setRefreshToken(state, refresh_token) {
    state.refresh_token = refresh_token;
  },
  setFullname(state, fullname) {
    state.fullname = fullname;
  },
  setLogin(state, access_token, refresh_token, fullname) {
    state.access_token = access_token
    state.refresh_token = refresh_token
    state.fullname = fullname
  },
  setLogout(state) {
    state.access_token = null
    state.refresh_token = null
    state.fullname = null
  },
};

export { state, getters, mutations };
