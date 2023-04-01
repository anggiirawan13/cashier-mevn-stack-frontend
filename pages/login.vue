<template>
    <v-row>
        <v-col cols="10" offset="1" md="4" offset-md="4">
            <v-card class="mb-2">
                <v-toolbar color="primary" dark>LOGIN</v-toolbar>
                <v-card-text>
                    <v-alert v-if="message" color="red lighten-2" dark>{{
                        $t(message)
                    }}</v-alert>
                    <v-form>
                        <v-text-field
                            name="email"
                            label="Email"
                            type="email"
                            v-model="form.email"
                        />
                        <v-text-field
                            name="password"
                            label="Password"
                            type="password"
                            v-model="form.password"
                        />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="doLogin"
                        color="primary"
                        :disabled="btnLoginDisable"
                    >
                        <span v-if="!btnLoginDisable">Login</span>
                        <v-progress-circular
                            v-else
                            color="primary"
                            indeterminate
                        ></v-progress-circular>
                    </v-btn>
                </v-card-actions>
            </v-card>
            <p>
                Kamu belum punya akun ?
                <v-btn to="/register" plain>Register</v-btn>
            </p>
        </v-col>
    </v-row>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    middleware: ['unauthenticated'],
    data() {
        return {
            btnLoginDisable: false,
            message: "",
            form: {
                email: "",
                password: "",
            },
        };
    },
    mounted() {
        if (this.$route.params.message === 'AUTH_IS_REQUIRED') {
            this.message = this.$route.params.message
        }
    },
    methods: {
        ...mapMutations('auth', {
            login: 'setLogin'
        }),
        storeWelcomeScreen() {
            localStorage.setItem("welcomeScreen", true);
        },
        async doLogin() {
            this.btnLoginDisable = true;

            await this.$axios
                .post("/auth/login", this.form)
                .then((response) => {
                    if (!localStorage.welcomeScreen) {
                        this.storeWelcomeScreen();
                    }

                    this.login(response.data.access_token, response.data.refresh_token, response.data.fullname)

                    this.$router.push("/dashboard");
                })
                .catch((error) => {
                    console.log(error);
                    this.message = error.response.data.message;
                });

            this.btnLoginDisable = false;
        },
    },
};
</script>
