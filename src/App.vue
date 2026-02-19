<script setup lang="ts">
import { ModalHost } from './components/common/Modal';
import { PopupHost } from './components/common/Popup';
import { onMounted, onBeforeUnmount, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCacheStore } from './stores/pinia-store';
import { waitForFonts } from './utils/useApp';
import { useTranslation } from 'i18next-vue';

import * as APIUser from './api/users/users';

import Menu from "./components/common/Menu/Menu.vue";
import TelegramModule from './hooks/useTelegram';
import Lottie from './components/Lottie.vue';
import LevelUpView from './components/common/LevelUp/LevelUp.vue';

const { i18next } = useTranslation();

const router = useRouter();
const loading = ref(true);
const useCache = useCacheStore();

let removeHook: (() => void) | undefined;

const IMAGES_TO_PRELOAD: string[] = [
];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
    if (img.complete) resolve();
  });
}
async function preloadImages(list: string[]) {
  await Promise.all(list.map(preloadImage));
}

function scrollTopSmooth() {
  const scroller = document.getElementById('scroller') as HTMLElement | null;
  const target: any = scroller ?? document.scrollingElement ?? document.documentElement;
  try { target.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }
  catch { target.scrollTop = 0; }
}

function miniAppTransport(dtx: any) {
  if (dtx && dtx !== 'debug') {
    if (dtx.startsWith('p_')) router.push(`/profile/item/${dtx.split('p_')[1]}`);
    if (dtx === 'onboard') router.push('/onboard');
  }
}

async function initStartApp(startParam?: string) {
  if (!startParam) return;
  const [startApp, startAppType = ''] = (startParam ?? '').split('_');
  switch (startAppType) {
    case 'opener':
      console.log('Opener', startApp);
      break;
    default:
      miniAppTransport(startParam);
  }
}

onMounted(() => {
  removeHook = router.afterEach(async () => {
    await nextTick();
    requestAnimationFrame(scrollTopSmooth);
  });
  requestAnimationFrame(scrollTopSmooth);
});

onBeforeUnmount(() => { removeHook?.(); });

onMounted(async () => {
  const initDataRaw = TelegramModule.initDataRaw() as any;
  const initData = TelegramModule.initData() as any;

  const init = await APIUser.me(initDataRaw);
  if (init) {
    useCache.UserData = { ...init };
    initStartApp(initData.start_param);

    await Promise.all([
      preloadImages(IMAGES_TO_PRELOAD),
      waitForFonts(['SFRounded'], [100,300,400,500,600,700,800,900], ['normal'], 4500),
    ]);

    setTimeout(() => { loading.value = false; }, 470);
  }
});
</script>

<template>
  <div id="scroller">
    <div v-if="!loading" class="page">
      <ModalHost />
      <PopupHost />
      <!-- <LevelUpView /> -->
      <RouterView />
      <Menu />
    </div>

    <div v-else class="page load">
      <div class="center">
        <div class="context">
          <div class="loader"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>