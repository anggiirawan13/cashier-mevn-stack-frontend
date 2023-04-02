<template>
    <v-row>
        <v-col cols="10" offset="1">
            <v-card class="mb-2">
                <v-toolbar color="primary" dark>EDIT PRODUCT</v-toolbar>
                <v-card-text>
                    <v-alert v-if="message" color="red lighten-2" dark>{{
                        $t(message)
                    }}</v-alert>
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
                        <v-select v-model="form.categoryId" :items="categories" label="Category" :rules="rules.category"></v-select>
                        <v-select v-model="form.status" :items="status" label="Status" :rules="rules.status"></v-select>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="doSave"
                        color="primary"
                        :loading="btnSaveDisable"
                        >Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    middlewares: ['authenticated'],
    head: {
        title: 'Edit Product'
    },
    asyncData({ params }) {
        return  {
            id: params.id
        }
    },
    data() {
        return {
            breadcrumbs: [
                { text: "Products", to: "/products", disabled: false, exact: true },
                { text: "Edit", disabled: true },
            ],
            btnSaveDisable: false,
            message: "",
            categories: [],
            status: ["active", "inactive"],
            form: {
                title: "",
                thumbnail: "",
                categoryId: "",
                price: "",
                status: "",
            },
            rules: {
                title: [(v) => !!v || this.$t('FIELD_IS_REQUIRED', { field: 'Title' })],
                price: [(v) => !!v || this.$t('FIELD_IS_REQUIRED', { field: 'price' })],
                status: [(v) => !!v || this.$t('FIELD_IS_REQUIRED', { field: 'Status' })],
                thumbnail: [(v) => !!v || this.$t('FIELD_IS_REQUIRED', { field: 'Thumbnail' })],
                category: [(v) => !!v || this.$t('FIELD_IS_REQUIRED', { field: 'Category' })],
            },
        };
    },
    methods: {
        async doSave() {
            this.message = ""
            if (this.$refs.form.validate()) {
                this.btnSaveDisable = true;
                
                await this.$axios
                .put(`/products/${this.id}`, this.form)
                .then(() => {
                    this.$router.push({
                        name: `products___${this.$i18n.locale}`,
                        params: {
                            type: 'success', message: 'UPDATE_SUCCESS', title: this.form.title,
                        }
                    });
                })
                .catch(() => {
                    this.$router.push({
                        name: `products___${this.$i18n.locale}`,
                        params: {
                            type: 'error', message: 'UPDATE_FAILED', title: this.form.title,
                        }
                    });
                });
                
                this.btnSaveDisable = false;
            }
        },
        getData() {
            this.$axios
                .get(`/products/${this.id}`, this.form)
                .then((response) => {
                    let product = response.data.product
                    this.form.title = product.title
                    this.form.thumbnail = product.thumbnail
                    this.form.price = product.price
                    this.form.status = product.status
                    this.form.categoryId = product.category_id._id
                })
                .catch((error) => {
                });
        },
        getCategories() {
            this.$axios.get(`/categories?page=1&limit=999999`)
            .then((response) => {
                let categories = response.data.categories
                categories.docs.forEach(cat => {
                    this.categories.push({
                        value: cat._id,
                        text: cat.title
                    })
                })
            })
            .catch((error) => {})
        },
    },
    async mounted() {
        await this.getCategories();
        await this.getData();
    }
};
</script>