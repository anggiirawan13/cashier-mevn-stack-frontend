<template>
  <v-row>
    <v-col cols="10" offset="1">
      <v-card class="mb-2">
        <v-toolbar color="primary" dark>EDIT CATEGORY</v-toolbar>
        <v-card-text>
          <v-alert v-if="message" color="red lighten-2" dark>{{
            $t(message)
          }}</v-alert>
          <v-breadcrumbs :items="breadcrumbs" class="pa-0"></v-breadcrumbs>
          <v-form ref="form">
            <v-text-field
              name="categoryCode"
              label="Category Code"
              type="text"
              :rules="rules.categoryCode"
              v-model="form.category_code"
            />
            <v-text-field
              name="categoryName"
              label="Category Name"
              type="text"
              :rules="rules.categoryName"
              v-model="form.category_name"
            />
            <v-select
              v-model="form.status"
              :items="status"
              label="Status"
              :rules="rules.status"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn to="/category" color="secondary">Back</v-btn>
          <v-spacer />
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
    title: "Edit Category",
  },
  asyncData({ params }) {
    return {
      id: params.id,
    };
  },
  data() {
    return {
      breadcrumbs: [
        { text: "Category", to: "/category", disabled: false, exact: true },
        { text: "Edit", disabled: true },
      ],
      btnSaveDisable: false,
      message: "",
      status: ["active", "inactive"],
      form: {
        category_code: "",
        category_name: "",
        status: "",
      },
      rules: {
        category_code: [
          (v) =>
            !!v || this.$t("FIELD_IS_REQUIRED", { field: "Category Code" }),
        ],
        category_name: [
          (v) =>
            !!v || this.$t("FIELD_IS_REQUIRED", { field: "Category Name" }),
        ],
        status: [
          (v) => !!v || this.$t("FIELD_IS_REQUIRED", { field: "Status" }),
        ],
      },
    };
  },
  methods: {
    async doSave() {
      this.message = "";
      if (this.$refs.form.validate()) {
        this.btnSaveDisable = true;

        await this.$axios
          .put(`/category/${this.id}`, this.form)
          .then(() => {
            this.$router.push({
              name: `category___${this.$i18n.locale}`,
              params: {
                type: "success",
                message: "UPDATE_SUCCESS",
                title: this.form.category_code,
              },
            });
          })
          .catch(() => {
            this.$router.push({
              name: `category___${this.$i18n.locale}`,
              params: {
                type: "error",
                message: "UPDATE_FAILED",
                title: this.form.category_code,
              },
            });
          });
        category;
        this.btnSaveDisable = false;
      }
    },
    getData() {
      this.$axios
        .get(`/category/${this.id}`)
        .then((response) => {
          const { data } = response;
          this.form.category_code = data.result.category_code;
          this.form.category_name = data.result.category_name;
          this.form.status = data.result.status;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
