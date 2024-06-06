<template>
  <div :class="`${prefixCls}__wrap`">
    <a-dropdown
      v-if="userInfo.username"
      placement="bottomRight"
      :overlayClassName="`${prefixCls}__dropdown`"
    >
      <div :class="prefixCls">
        <img :src="getImageUrl('avatar.svg')" alt="avatar" />
        <span
          :title="userInfo.username"
          :class="[`${prefixCls}__username`, 'global-ellipsis-oneline']"
        >
          {{ userInfo.username }}
        </span>
        <CaretDownOutlined :class="`${prefixCls}__icon`" />
      </div>
      <template #overlay>
        <a-menu @click="clickMenu">
          <a-menu-item :class="`${prefixCls}__li`" :key="0">
            <LogoutOutlined />
            <span>{{ $t('actions.esc') }}</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { apiLogout } from 'api/login'
import { removeStorage } from 'utils/util'
import { TOKEN, USER_INFOMATION } from '@/constant'
import { usePrefix, useSwitchPage, useI18n, useAssetsImages } from '@/hooks'

defineOptions({ name: 'UserInfo' })
const { prefixCls } = usePrefix('app-user-info')
const switchPage = useSwitchPage()
const { $t } = useI18n()
const getImageUrl = (name: string) => useAssetsImages(`/${name}`)

// 用户信息
const userInfo = ref<{
  username: string
}>(JSON.parse(window.localStorage.getItem(USER_INFOMATION) || '{}'))

// 登出
async function logout() {
  await apiLogout()
  removeStorage(TOKEN, USER_INFOMATION)
  switchPage({ name: 'Login' })
}

const menuFns = [() => logout()]
const clickMenu = ({ key }: { key: number }) => {
  menuFns[key]()
}
</script>
<style lang="less" scoped>
@prefix-cls: ~'app-user-info';

.@{prefix-cls} {
  display: flex;
  align-items: center;
  line-height: 4rem;
  white-space: nowrap;
  cursor: pointer;

  &__wrap {
    display: flex;
    align-items: center;
  }

  & > img {
    width: 2rem;
    height: 2rem;
    margin-right: 0.5rem;
  }

  &__username {
    display: inline-block;
    max-width: 6rem;
    color: @colorHeaderText;
  }

  &__icon {
    padding-left: 0.375rem;
    color: @colorHeaderText;
  }

  :deep(&__li) {
    min-width: 8.625rem;

    svg {
      margin-right: 0.5rem;
    }

    &:hover {
      color: @colorPrimary;
    }
  }
}
</style>
