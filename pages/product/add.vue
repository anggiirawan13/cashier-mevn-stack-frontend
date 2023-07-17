<template>
  <v-row>
    <v-col cols="10" offset="1">
      <v-card class="mb-2">
        <v-toolbar color="primary" dark>ADD USER</v-toolbar>
        <v-card-text>
          <v-breadcrumbs :items="breadcrumbs" class="pa-0"></v-breadcrumbs>
          <v-form ref="form">
            <v-text-field
              name="title"
              label="Title"
              type="text"
              :rules="rules.title"
              v-model="form.title"
            />
            <v-text-field
              name="thumbnail"
              label="Thumbnail"
              type="text"
              :rules="rules.thumbnail"
              v-model="form.thumbnail"
            />
            <v-text-field
              name="price"
              label="Price"
              type="number"
              :rules="rules.price"
              v-model="form.price"
            />
            <v-select
              v-model="form.categoryId"
              :items="category"
              label="Category"
              :rules="rules.category"
            ></v-select>
            <v-select
              v-model="form.status"
              :items="status"
              label="Status"
              :rules="rules.status"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="doSave" color="primary" :loading="btnSaveDisable"
            >Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  middlewares: ["authenticated"],
  head: {
    title: "Add Product",
  },
  data() {
    return {
      breadcrumbs: [
        { text: "Product", to: "/product", disabled: false, exact: true },
        { text: "Add", disabled: true },
      ],
      btnSaveDisable: false,
      status: ["active", "inactive"],
      category: [],
      form: {
        title: "",
        thumbnail: "",
        categoryId: "",
        price: "",
        status: "",
      },
      rules: {
        title: [(v) => !!v || this.$t("FIELD_IS_REQUIRED", { field: "Title" })],
        status: [
          (v) => !!v || this.$t("FIELD_IS_REQUIRED", { field: "Status" }),
        ],
        thumbnail: [
          (v) => !!v || this.$t("FIELD_IS_REQUIRED", { field: "thumbnail" }),
        ],
        price: [(v) => !!v || this.$t("FIELD_IS_REQUIRED", { field: "price" })],
        category: [
          (v) => !!v || this.$t("FIELD_IS_REQUIRED", { field: "category" }),
        ],
      },
    };
  },
  methods: {
    async doSave() {
      if (this.$refs.form.validate()) {
        this.btnSaveDisable = true;

        await this.$axios
          .post("/product", this.form)
          .then(() => {
            this.$router.push({
              name: `product___${this.$i18n.locale}`,
              params: {
                type: "success",
                message: "ADD_SUCCESS",
                title: this.form.title,
              },
            });
          })
          .catch((error) => {});

        this.btnSaveDisable = false;
      }
    },
    getCategory() {
      this.$axios
        .get(`/category?page=1&limit=999999`)
        .then((response) => {
          let category = response.data.category;
          category.docs.forEach((cat) => {
            this.category.push({
              value: cat.id,
              text: cat.title,
            });
          });
        })
        .catch((error) => {});
    },
  },
  mounted() {
    category;
    this.getCategory();
  },
};
</script>
