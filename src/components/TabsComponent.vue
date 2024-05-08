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

<script lang="ts">
import { defineComponent } from 'vue'

interface Tab {
  name: string
  label: string
}

export default defineComponent({
  name: 'TabsComponent',
  props: {
    tabs: {
      type: Array as () => Tab[],
      required: true
    }
  },
  data() {
    return {
      activeTab: 0
    }
  },
  methods: {
    changeTab(index: number) {
      this.activeTab = index
    }
  }
})
</script>

<style scoped>
.tab-header {
  display: flex;
  border-bottom: 2px solid var(--dark-blue);
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
