<template>
    <v-row class="frame-content">
        <v-col cols="10" offset="1">
            <v-card class="my-3">
                <v-toolbar color="primary" dark>
                    Products
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                </v-toolbar>
                <v-card-text>
                    <v-alert v-if="message" :type="alertType">{{
                        message
                    }}</v-alert>
                    <div class="d-flex mb-4">
                        <v-breadcrumbs :items="breadcrumbs" class="pa-0" />
                        <v-spacer></v-spacer>
                        <v-btn to="/products/add" color="primary" elevation="3" small>Add <v-icon right>mdi-plus-circle</v-icon></v-btn>
                    </div>

                    <v-data-table :isLoading="isLoading" :items="products" :headers="headers" :items-per-page="10" :server-items-length="totalData" :options.sync="options" :search.sync="search" :footer-props="{
                        itemsPerPageOptions: [10, 25, 50, 75, 100],
                    }">
                        <template v-slot:top>
                            <v-dialog v-model="dialogDelete" max-width="500px">
                                <v-card>
                                    <v-card-title>Kamu yakin ingin menghapus data {{ itemDelete.title }}?</v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" text @click="cancelDelete">Cancel</v-btn>
                                        <v-btn color="error" text @click="confirmDelete(itemDelete._id)">Delete</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-btn :to="`/products/edit/${item._id}`" icon><v-icon small>mdi-pencil</v-icon></v-btn>
                            <v-btn small icon @click="deleteItem(item)"><v-icon small>mdi-delete</v-icon></v-btn>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default ({
    middlewares: ['authenticated'],
    head: {
        title: 'Products'
    },
    data() {
        return {
            products: [],
            options: {},
            totalData: 0,
            search: '',
            isLoading: false,
            message: '',
            alertType: '',
            dialogDelete: false,
            itemDelete: '',
            headers: [
                { text: '#', value: 'row', sortable: false },
                { text: 'Title', value: 'title', sortable: false },
                { text: 'Price', value: 'price', sortable: false },
                { text: 'Category', value: 'category_id.title', sortable: false },
                { text: '', value: 'actions', sortable: false },
            ],
            breadcrumbs: [
                {
                    text: '',
                    disabled: true,
                    to: '/products',
                },
            ]
        }
    },
    methods: {
        getProducts() {
            this.isLoading = true
            const { page, itemsPerPage } = this.options
            
            this.$axios.get(`/products?page=${page}&limit=${itemsPerPage}&search=${this.search}`)
            .then((response) => {
                let products = response.data.products
                this.products = products.docs
                this.totalData = products.totalDocs

                let i = products.pagingCounter
                this.products.map(product => product.row = i++)
            })
            .catch((error) => {})
            .finally(() => {
                this.isLoading = false
            })
        },
        confirmDelete(id) {
            this.$axios.delete(`/products/${id}`)
            .then(async () => {
                await this.getProducts();
                this.alertType = 'success'
                this.message = this.$t('DELETE_SUCCESS', {
                    title: this.itemDelete.title
                })
            })
            .catch((error) => {})
            .finally(() => {
                this.cancelDelete()
            })
        },
        deleteItem(item) {
            this.dialogDelete = true
            this.itemDelete = item
        },
        cancelDelete() {
            this.dialogDelete = false
        }
    },
    watch: {
        options: {
            handler() {
                this.getProducts()
                
            },
            deep: true,
        },
        search: {
            handler() {
                this.getProducts()
                
            },
        },
    },
    mounted() {
        if (this.$route.params.message) {
            this.alertType = this.$route.params.type
            this.message = this.$t(this.$route.params.message, {
                title: this.$route.params.title
            })
        }
    }
})
</script>