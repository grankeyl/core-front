<script setup lang="ts">
import { computed } from "vue";
import type { FundDetail, AttributeRarity } from "../../../../../types/funds";

const props = defineProps<{
  typeShared: string;
  fund: FundDetail;
}>();

const attrs = computed(() => props.fund.gift.attributes);

function formatRarity(rarity?: AttributeRarity): string {
  if (!rarity) return '';
  if (rarity.title) return rarity.title;
  if (rarity.perMille != null) return `${rarity.perMille}%`;
  return '';
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

interface DetailRow {
  label: string;
  name: string;
  rarity: string;
}

const detailRows = computed<DetailRow[]>(() => {
  const rows: DetailRow[] = [];
  const a = attrs.value;

  if (a?.model) {
    rows.push({ label: 'Model', name: a.model.name, rarity: formatRarity(a.model.rarity) });
  }
  if (a?.backdrop) {
    rows.push({ label: 'Backdrop', name: a.backdrop.name, rarity: formatRarity(a.backdrop.rarity) });
  }
  if (a?.pattern) {
    rows.push({ label: 'Symbol', name: a.pattern.name, rarity: formatRarity(a.pattern.rarity) });
  }

  rows.push({
    label: 'Issued',
    name: `${formatNumber(props.fund.gift.availabilityIssued)} of ${formatNumber(props.fund.gift.availabilityTotal)}`,
    rarity: '',
  });

  return rows;
});
</script>

<template>
  <div class="details">
    <div v-if="props.typeShared === 'gift'" class="items">
      <div
        v-for="(row, i) in detailRows"
        :key="i"
        class="item"
      >
        <div class="left">
          <p>{{ row.label }}</p>
        </div>
        <div class="right">
          <h4>{{ row.name }}</h4>
          <span v-if="row.rarity">{{ row.rarity }}</span>
        </div>
      </div>
    </div>
    <div v-if="props.typeShared === 'anonymous'" class="description">
      <p>Trade IDs not tied to a SIM card which allow logging into Telegram with your blockchain account. These numbers only work on Telegram.</p>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Details.scss"></style>
