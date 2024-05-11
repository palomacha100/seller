<template>
  <div class="tabs">
    <div class="tab-header">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        @click="changeTab(index)"
        :class="{ active: activeTab === index }"
        class="tab-header-item"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="tab-content">
      <slot :name="tabs[activeTab].name"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { defineProps } from 'vue'

type MyObjectType = {
  name: string
  label: string
}

const props = defineProps<{
  tabs: Array<MyObjectType>
  isTrue: boolean
}>()

const activeTab = ref(0)

const changeTab = (index: number) => {
  if (props.isTrue && index == 1) {
    activeTab.value = index
  } else if (index == 0) {
    activeTab.value = index
  }
}
</script>

<style scoped>
.tab-header {
  display: flex;
  border-bottom: 2px solid var(--dark-blue);
  border-radius: 5px;
  background-color: var(--light_blue);
}

.tab-header-item {
  padding: 10px 20px;
  cursor: pointer;
}

.tab-header-item.active {
  background-color: var(--dark-blue);
  color: var(--white);
}

.tab-content {
  padding: 20px;
}
</style>
