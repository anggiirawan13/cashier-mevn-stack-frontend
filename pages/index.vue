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
import Products from '~/components/Product.vue';

export default {
    name: "IndexPage",
    components: { Products }
}
</script>
