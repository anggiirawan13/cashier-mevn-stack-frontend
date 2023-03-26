<template>
    <v-row>
        <v-col cols="10" offset="1" md="4" offset-md="4">
            <v-card class="mb-2">
                <v-toolbar color="primary" dark>LOGIN</v-toolbar>
                <v-card-text>
                    <v-alert v-if="messageError" color="red lighten-2" dark>{{
                        $t(messageError)
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
export default {
    data() {
        return {
            btnLoginDisable: false,
            messageError: "",
            form: {
                email: "",
                password: "",
            },
        };
    },
    methods: {
        storeWelcomeScreen() {
            localStorage.setItem("welcomeScreen", true);
        },
        async doLogin() {
            this.btnLoginDisable = true;

            await this.$axios
                .post("http://localhost:3000/auth/login", this.form)
                .then(() => {
                    if (!localStorage.welcomeScreen) {
                        this.storeWelcomeScreen();
                    }

                    this.$router.push("/dashboard");
                })
                .catch((error) => {
                    console.log(error);
                    this.messageError = error.response.data.message;
                });

            this.btnLoginDisable = false;
        },
    },
};
</script>
