<template>
    <v-row>
        <v-col cols="10" offset="1" md="4" offset-md="4">
            <v-card class="mb-2">
                <v-toolbar color="primary" dark>REGISTER</v-toolbar>
                <v-card-text>
                    <v-alert v-if="message" color="red lighten-2" dark>{{
                        $t(message)
                    }}</v-alert>
                    <v-form ref="form">
                        <v-text-field
                            name="fullname"
                            label="Fullname"
                            type="text"
                            :rules="rules.fullname"
                            v-model="form.fullname"
                        />
                        <v-text-field
                            name="email"
                            label="Email"
                            type="email"
                            :rules="rules.email"
                            v-model="form.email"
                        />
                        <v-text-field
                            name="password"
                            label="Password"
                            type="password"
                            :rules="rules.password"
                            v-model="form.password"
                        />
                        <v-text-field
                            name="retype_password"
                            label="Re-Password"
                            type="password"
                            :rules="rules.retype_password"
                            v-model="form.retype_password"
                        />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="doRegister"
                        color="primary"
                        :disabled="btnRegisterDisable"
                        ><span v-if="!btnRegisterDisable">Register</span>
                        <v-progress-circular
                            v-else
                            color="primary"
                            indeterminate
                        ></v-progress-circular>
                    </v-btn>
                </v-card-actions>
            </v-card>
            <p>
                Kamu sudah punya akun ? <v-btn to="/login" plain>Login</v-btn>
            </p>
        </v-col>
    </v-row>
</template>

<script>
export default {
    middleware: ['unauthenticated'],
    data() {
        return {
            btnRegisterDisable: false,
            message: "",
            form: {
                fullname: "",
                email: "",
                password: "",
                retype_password: "",
            },
            rules: {
                fullname: [(v) => !!v || this.$t('FIELD_IS_REQUIRED', { field: 'Fullname' })],
                email: [
                    (v) => !!v || this.$t('FIELD_IS_REQUIRED', { field: 'Email' }),
                    (v) => /.+@.+/.test(v) || this.$t('EMAIL_INVALID'),
                ],
                password: [
                    (v) => !!v || this.$t('FIELD_IS_REQUIRED', { field: 'Password' }),
                    (v) =>
                        v.length >= 8 ||
                        this.$t('FIELD_MIN', { field: 'Password', min: 8 }),
                ],
                retype_password: [
                    (v) =>
                        v === this.form.password ||
                        this.$t('FIELD_CONFIRM', { confirm: 'Re-Password', field: 'Password' }),
                ],
            },
        };
    },
    methods: {
        async doRegister() {
            this.message = ""
            if (this.$ref.form.validate()) {
                this.btnRegisterDisable = true;

                await this.$axios
                    .post("/auth/register", this.form)
                    .then(() => {
                        this.$router.push("/login");
                    })
                    .catch((error) => {
                        this.message = error.response.data.message;
                    });

                this.btnRegisterDisable = false;
            }
        },
    },
};
</script>
