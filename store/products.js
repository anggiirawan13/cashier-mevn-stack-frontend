export const state = () => ({
  categoryId: 0,
  categories: [{ id: false, category_name: "All" }],
  products: [],
  tempProducts: [],
});

export const mutations = {
  updateCategoryId(state, categoryId) {
    state.categoryId = categoryId;
  },
  updateProducts(state, products) {
    state.products = products;
    state.tempProducts = products;
  },
  updateCategories(state, categories) {
    state.categories.push(...categories);
  },
  searchProducts(state, products) {
    state.products = products;
  },
  resetProducts(state) {
    state.products = state.tempProducts;
  },
};

export const actions = {
  updateCategoryId({ commit }, categoryId) {
    commit("updateCategoryId", categoryId);
  },
  getProducts({ commit }) {
    return this.$axios.$get("/products").then((response) => {
      commit("updateProducts", response.result);
    });
  },
  getCategories({ commit }) {
    return this.$axios.$get("/categories").then((response) => {
      commit("updateCategories", response.result);
    });
  },
  searchProducts({ commit }, products) {
    commit("searchProducts", products);
  },
  resetProducts({ commit }) {
    commit("resetProducts");
  },
};
