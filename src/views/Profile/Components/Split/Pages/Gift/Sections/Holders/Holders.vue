<script setup lang="ts">
import { ref } from "vue";

const skeleton = ref<boolean>(false);
</script>

<template>
  <div class="holders" :class="{ skeleton }">
    <table class="holders-table">
      <thead>
        <tr>
          <th>#</th>
          <th></th>
          <th></th>
          <th class="shares">Shares</th>
          <th class="ownership">Ownership</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(_, i) in 5" :key="i">
          <td>{{ i + 1 }}</td>
          <td class="image"><img class="avatar" src="" alt=""></td>
          <td class="name">NebulaShift</td>
          <td class="shares">8</td>
          <td class="percents">17,78%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss" src="./Holders.scss"></style>