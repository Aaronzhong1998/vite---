import { defineStore } from 'pinia'
import type { RouteRecordName } from 'vue-router'

export const keepAliveStore = defineStore('keepAlive', {
  state: () => {
    return {
      tagNames: Array<RouteRecordName>()
    }
  },
  actions: {
    setTagName(tagName: Array<RouteRecordName>) {
      this.tagNames = tagName
    },
    addTagName(tagName: RouteRecordName) {
      this.tagNames = [...this.tagNames, tagName]
    },
    clearTagName() {
      this.tagNames = []
    }
  }
})
