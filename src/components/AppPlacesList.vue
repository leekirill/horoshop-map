<script setup>
import { ref } from 'vue'
import AppLoader from './AppLoader.vue'

const props = defineProps({ arr: Array, isLoading: Boolean })
const emit = defineEmits(['handleItem'])

const handleItem = (i) => emit('handleItem', i)

const ratingStarts = ref(new Array(5).fill())
</script>

<template>
  <ul class="sidebar__places-list">
    <app-loader class="loader" v-if="isLoading" />
    <li
      class="sidebar__places-item"
      v-else
      v-for="(n, i) in props.arr"
      :key="i"
      @click="handleItem(i)"
    >
      <h3>{{ n.name }}</h3>
      <p>{{ n.vicinity }}</p>
      <div class="rating">
        <p>{{ n.rating }}</p>
        <div v-if="n.rating">
          <span
            v-for="(_, index) in ratingStarts"
            :key="index"
            :class="index < Math.round(n.rating) ? 'star' : 'star empty'"
            :id="index"
          ></span>
        </div>
        <p v-else>No rating</p>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.rating {
  unicode-bidi: bidi-override;
  direction: rtl;
  margin-top: 16px;
  display: flex;
  flex-flow: row-reverse;
  & div {
    margin-left: 8px;
  }
}

.star {
  display: inline-block;
  width: 14px;
  height: 14px;
  background-image: url('../assets/filled-star.svg');
  background-size: cover;
}

.star.empty {
  background-image: url('../assets/empty-star.svg');
}
</style>
