<template>
  <v-row>
    <v-col cols="10" offset="1">
      <v-card class="mb-2">
        <v-toolbar color="primary" dark>EDIT USER</v-toolbar>
        <v-card-text>
          <v-alert v-if="message" color="red lighten-2" dark>{{
            $t(message)
          }}</v-alert>
          <v-breadcrumbs :items="breadcrumbs" class="pa-0"></v-breadcrumbs>
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
            <v-select
              v-model="form.role"
              :items="roles"
              label="Role"
              :rules="rules.role"
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
    title: "Edit User",
  },
  asyncData({ params }) {
    return {
      id: params.id,
    };
  },
  data() {
    return {
      breadcrumbs: [
        { text: "User", to: "/user", disabled: false, exact: true },
        { text: "Edit", disabled: true },
      ],
      btnSaveDisable: false,
      message: "",
      roles: ["admin", "cashier", "employee"],
      status: ["active", "inactive"],
      form: {
        fullname: "",
        email: "",
        password: "",
        retype_password: "",
        role: "",
        status: "",
      },
      rules: {
        fullname: [
          (v) => !!v || this.$t("FIELD_IS_REQUIRED", { field: "Fullname" }),
        ],
        role: [(v) => !!v || this.$t("FIELD_IS_REQUIRED", { field: "Role" })],
        status: [
          (v) => !!v || this.$t("FIELD_IS_REQUIRED", { field: "Status" }),
        ],
        email: [
          (v) => !!v || this.$t("FIELD_IS_REQUIRED", { field: "Email" }),
          (v) => /.+@.+/.test(v) || this.$t("EMAIL_INVALID"),
        ],
        password: [
          (v) =>
            v.length === 0 ||
            v.length >= 8 ||
            this.$t("FIELD_MIN", { field: "Password", min: 8 }),
        ],
        retype_password: [
          (v) =>
            v === this.form.password ||
            this.$t("FIELD_CONFIRM", {
              confirm: "Re-Password",
              field: "Password",
            }),
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
          .put(`/user/${this.id}`, this.form)
          .then(() => {
            this.$router.push({
              name: `user___${this.$i18n.locale}`,
              params: {
                type: "success",
                message: "UPDATE_SUCCESS",
                fullname: this.form.fullname,
              },
            });
          })
          .catch(() => {
            this.$router.push({
              name: `user___${this.$i18n.locale}`,
              params: {
                type: "error",
                message: "UPDATE_FAILED",
                fullname: this.form.fullname,
              },
            });
          });

        this.btnSaveDisable = false;
      }
    },
    getData() {
      this.$axios
        .get(`/user/${this.id}`, this.form)
        .then((response) => {
          let user = response.data.user;
          this.form.fullname = user.fullname;
          this.form.email = user.email;
          this.form.role = user.role;
          this.form.status = user.status;
        })
        .catch((error) => {});
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
