<template>
  <section id="product">
    <v-row align="center">
      <v-col cols="10">
        <v-autocomplete
          label="Products"
          placeholder="Start typing to search"
          :search-input.sync="search"
          :loading="isLoading"
          :items="itemSearch"
          item-text="product_name"
          item-value="id"
          v-model="selectedSearch"
          return-object
          hide-no-data
        >
        </v-autocomplete>
      </v-col>
      <v-col cols="2">
        <v-menu>
          <template v-slot:activator="{ on: category }">
            <v-btn v-on="category" color="primary"> Category </v-btn>
          </template>
          <v-list>
            <v-list-item-group>
              <v-list-item
                v-for="(category, index) in categories"
                :key="index"
                :value="category.id"
                :disabled="category.id === categoryId"
                @change="updateCategoryId(category.id)"
              >
                <v-list-item-title>{{
                  category.category_name
                }}</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(product, index) in filteredProducts" :key="index" cols="2">
        <v-card
          @click="addToCart(product.id)"
          :title="product.product_name"
          :ripple="true"
        >
          <v-card-actions>
            <v-img
              :src="require(`@/assets/images/products/${product.thumbnail}`)"
            ></v-img>
          </v-card-actions>
          <v-card-text align="center" class="product-name">
            {{ product.product_name }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      search: null,
      isLoading: false,
      itemSearch: [],
      selectedSearch: null,
    };
  },
  methods: {
    ...mapActions({
      updateCategoryId: "products/updateCategoryId",
      addToCart: "carts/addToCart",
      getProducts: "products/getProducts",
      getCategories: "products/getCategories",
      searchProducts: "products/searchProducts",
      resetProducts: "products/resetProducts",
    }),
    resetSearchCategory() {
      this.updateCategoryId(0);
    },
  },
  computed: {
    filteredProducts() {
      if (this.categoryId) {
        return this.products.filter(
          (product) => product.category_id == this.categoryId
        );
      }

      return this.products;
    },
    ...mapState("products", {
      products: "products",
      categories: "categories",
      categoryId: "categoryId",
    }),
  },
  watch: {
    search() {
      this.isLoading = true;

      if (this.search) {
        setTimeout(() => {
          this.itemSearch = this.products.filter((e) => {
            this.resetSearchCategory();

            return e.product_name;
          });
        }, 1000);
      } else {
        this.resetProducts();
        this.search = null;
        this.itemSearch = [];
      }

      this.isLoading = false;
    },
    selectedSearch(product) {
      if (product) {
        let result = this.products.filter(
          (prod) => prod.product_name == product.product_name
        );
        this.searchProducts(result);
      }
    },
  },
  mounted() {
    if (this.products.length <= 0) {
      this.getProducts();
    }

    if (this.categories.length === 1) {
      this.getCategories();
    }
  },
};
</script>

<style scoped>
.product-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
