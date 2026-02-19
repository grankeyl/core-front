<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { obfuscateAddress } from "../../../utils/useTon";
import { tonConnectUI } from '../../../hooks/useTonConnect';
import { showErrorToast, showSuccessToast } from "../../../utils/toastManager";
import { toUserFriendlyAddress } from "ton-ui-vue";
import { useModal } from "../Modal";

import * as APIWallet from "../../../api/wallets";

// Components
import DisconnectModal from "./Modals/Disconnect.vue";

// Icons
import TonIcon from "@/assets/icons/ton.svg";
import TelegramModule from "../../../hooks/useTelegram";

const { open } = useModal();

const props = defineProps<{
  page?: string;
}>();

const walletConnected = ref(false);
const walletAddress = ref('');
const walletCheckInterval = ref();

const openTonWallet = () => {
  if (tonConnectUI.connected) {
    openDisconnectModal();
    return;
  };

  tonConnectUI.openModal();
  TelegramModule.useMediumHaptic();

  const interval = setInterval(async () => {
    if (tonConnectUI.connected) {
      clearInterval(interval);
      walletConnected.value = true;

      // Получаем адрес кошелька
      const address = await getTonWalletAddress();

      if (address) {
        // Отправляем запрос на подключение кошелька
        const response = await APIWallet.connect(address);
        console.log('response', response);

        if (response) {
          showSuccessToast('Wallet connected successfully');
        } else {
          showErrorToast('Failed to connect wallet');
        }
      } else {
        showErrorToast('Failed to connect wallet');
      }
    }
  }, 1000);
}

const checkTonWallet = () => {
  const isTonWallet = tonConnectUI.connected;
  walletConnected.value = isTonWallet;
}

const getTonWalletAddress = async () => {
  if (!tonConnectUI.account) return '';
  const rawAddress = tonConnectUI.account.address;
  const walletAddressString = toUserFriendlyAddress(rawAddress);
  walletAddress.value = walletAddressString;
  return walletAddressString;
}

const disconnectTonWallet = async () => {
  if (walletAddress.value) {
    // Отправляем запрос на отключение кошелька
    const response = await APIWallet.disconnect(walletAddress.value);
    console.log('disconnect response', response);

    if (response) {
      showSuccessToast('Wallet disconnected successfully');
    } else {
      showErrorToast('Failed to disconnect wallet');
    }
  }

  walletConnected.value = false;
  walletAddress.value = '';
  tonConnectUI.disconnect();
}

walletCheckInterval.value = setInterval(() => {
  checkTonWallet();
}, 1000) as unknown as number;

async function openDisconnectModal() {
  const choose = open(DisconnectModal, {
    onDisconnect: () => {
      disconnectTonWallet();
    },
  });
  const dest = await choose.done.catch(() => null);
  if (!dest) return;
}

onMounted(() => {
  getTonWalletAddress();
  checkTonWallet();
});

onBeforeUnmount(() => {
  clearInterval(walletCheckInterval.value);
  walletCheckInterval.value = null;
});
</script>

<template>
    <div class="connect" :class="{ profile: page === 'profile' }">
        <button @click="openTonWallet">
            <img :src="TonIcon" alt="ton-icon">
            <p v-if="!walletConnected || !walletAddress">Connect wallet</p>
            <p v-else>{{ obfuscateAddress(walletAddress) }}</p>
        </button>
    </div>
</template>

<style lang="scss" src="./Wallet.scss" scoped></style>