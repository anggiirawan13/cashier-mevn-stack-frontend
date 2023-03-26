<template>
  <v-row>
    <v-col cols="10" offset="1" md="4" offset-md="4">
      <v-card class="mb-2">
        <v-toolbar color="primary" dark>REGISTER</v-toolbar>
        <v-card-text>
          <v-form>
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
              @keydown="onChange"
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
          <v-btn @click="checkEmail" color="success">Check Email</v-btn>
          <v-btn
            @click="onSubmit"
            color="primary"
            :disabled="btnRegisterDisable"
            >Register</v-btn
          >
        </v-card-actions>
      </v-card>
      <p>Kamu sudah punya akun ? <v-btn to="/login" plain>Login</v-btn></p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      btnRegisterDisable: true,
      form: {
        fullname: '',
        email: '',
        password: '',
        retype_password: '',
      },
      rules: {
        fullname: [(v) => !!v || 'Fullname is required!'],
        email: [
          (v) => !!v || 'Email is required!',
          (v) => /.+@.+/.test(v) || 'Email invalid!',
        ],
        password: [
          (v) => !!v || 'Password is required',
          (v) => v.length >= 8 || 'Password must be at least 8 chareacters!',
        ],
        retype_password: [
          (v) =>
            v === this.form.password ||
            'Re-Password must be same with password!',
        ],
      },
    }
  },
  methods: {
    onChange() {
      this.btnRegisterDisable = true
    },
    checkEmail() {
      this.$axios
        .post('http://localhost:3000/auth/check-email', this.form)
        .then(async () => {
          await this.$swal.fire({ title: 'Email OK!', icon: 'success' })
          this.btnRegisterDisable = false
        })
        .catch(() =>
          this.$swal.fire({ title: 'Email already exist!', icon: 'error' })
        )
    },
    onSubmit() {
      this.$axios
        .post('http://localhost:3000/auth/register', this.form)
        .then(async () => {
          await this.$swal.fire({ title: 'Register Success!', icon: 'success' })
          this.$router.push('/login')
        })
        .catch((error) => console.error(error))
    },
  },
}
</script>
