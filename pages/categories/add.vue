<template>
    <v-row>
        <v-col cols="10" offset="1">
            <v-card class="mb-2">
                <v-toolbar color="primary" dark>ADD CATEGORY</v-toolbar>
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
        title: 'Add Category'
    },
    data() {
        return {
            breadcrumbs: [
                { text: "Categories", to: "/categories", disabled: false, exact: true },
                { text: "Add", disabled: true },
            ],
            btnSaveDisable: false,
            message: "",
            status: ["active", "inactive"],
            form: {
                title: "",
                status: "",
            },
            rules: {
                title: [(v) => !!v || this.$t('FIELD_IS_REQUIRED', { field: 'Title' })],
                status: [(v) => !!v || this.$t('FIELD_IS_REQUIRED', { field: 'Status' })],
            },
        };
    },
    methods: {
        async doSave() {
            this.message = ""
            if (this.$refs.form.validate()) {
                this.btnSaveDisable = true;
                
                await this.$axios
                .post("/categories", this.form)
                .then(() => {
                    this.$router.push({
                        name: `categories___${this.$i18n.locale}`,
                        params: {
                            type: 'success', message: 'ADD_SUCCESS', title: this.form.title,
                        }
                    });
                })
                .catch((error) => {
                    this.message = error.response.data.message;
                });
                
                this.btnSaveDisable = false;
            }
        },
    },
};
</script>