<template>
  <li>
    {{ team }}
  </li>
</template>
<script lang="ts" setup>
import { Team } from "@/types/team";

defineProps({
  team: Team,
});
</script>
