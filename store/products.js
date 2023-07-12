export const state = () => ({
  categoryId: 0,
  categories: [
    { id: false, category_name: 'All' },
  ],
  products: [],
})

export const mutations = {
  updateCategoryId(state, categoryId) {
    state.categoryId = categoryId
  },
  updateProducts(state, products) {
    state.products = products
  },
  updateCategories(state, categories) {
    state.categories.push(...categories)
  }
}

export const actions = {
  updateCategoryId({commit}, categoryId) {
    commit('updateCategoryId', categoryId)
  },
  getProducts({commit}) {
    return this.$axios.$get('/products').then(response => {
      commit('updateProducts', response.result);
    })
  },
  getCategories({commit}) {
    return this.$axios.$get('/categories').then(response => {
      commit('updateCategories', response.result);
    })
  },
}