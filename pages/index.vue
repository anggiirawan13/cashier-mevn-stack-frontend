<template>
  <v-row>
    <v-col cols="8" class="frame-content px-6">
      <Product />
    </v-col>
    <v-col cols="4" class="frame-content white">
      <Order />
    </v-col>
  </v-row>
</template>

<script>
export default {
  middlewares: ["authenticated"],
  head: {
    title: "App",
  },
};
</script>
