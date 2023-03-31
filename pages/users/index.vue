<template>
    <v-row class="frame-content">
        <v-col cols="10" offset="1">
            <v-card class="my-3">
                <v-toolbar color="primary" dark>
                    Users
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
                        <v-btn to="/users/create" color="primary" elevation="3" small>User <v-icon right>mdi-plus-circle</v-icon></v-btn>
                    </div>

                    <v-data-table :isLoading="isLoading" :items="users" :headers="headers" :items-per-page="10" :server-items-length="totalData" :options.sync="options" :search.sync="search" :footer-props="{
                        itemsPerPageOptions: [10, 25, 50, 75, 100],
                    }">
                        <template v-slot:item.actions="{ item }">
                            <v-btn :to="`/users/edit/${item._id}`" icon><v-icon small>mdi-pencil</v-icon></v-btn>
                            <v-btn small icon><v-icon small>mdi-delete</v-icon></v-btn>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default ({
    data() {
        return {
            users: [],
            options: {},
            totalData: 0,
            search: '',
            isLoading: false,
            message: '',
            alertType: '',
            headers: [
                { text: '#', value: 'row', sortable: false },
                { text: 'Fullname', value: 'fullname', sortable: false },
                { text: 'Email', value: 'email', sortable: false },
                { text: 'Role', value: 'role', sortable: false },
                { text: '', value: 'actions', sortable: false },
            ],
            breadcrumbs: [
                {
                    text: '',
                    disabled: true,
                    to: '/users',
                },
            ]
        }
    },
    methods: {
        getUsers() {
            this.isLoading = true
            const { page, itemsPerPage } = this.options
            
            this.$axios.get(`http://localhost:3000/users?page=${page}&limit=${itemsPerPage}&search=${this.search}`)
            .then((response) => {
                let users = response.data.users
                this.users = users.docs
                this.totalData = users.totalDocs

                let i = users.pagingCounter
                this.users.map(user => user.row = i++)
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.isLoading = false
            })
        }
    },
    watch: {
        options: {
            handler() {
                this.getUsers()
                
            },
            deep: true,
        },
        search: {
            handler() {
                this.getUsers()
                
            },
        },
    },
    mounted() {
        if (this.$route.params.message) {
            this.alertType = this.$route.params.type
            this.message = this.$t(this.$route.params.message, {
                title: this.$route.params.fullname
            })
        }
    }
})
</script>