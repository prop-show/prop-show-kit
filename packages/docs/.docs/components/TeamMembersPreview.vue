<script setup lang="ts">
import { TeamMembers } from "../../../ui/registry/team-members";
import teamCode from "../../../ui/registry/team-members/TeamMembers.vue?raw";
import dialogCode from "../../../ui/registry/team-members/InviteMemberDialog.vue?raw";
import indexCode from "../../../ui/registry/team-members/index.ts?raw";

const files = [
  { path: "team-members/TeamMembers.vue", code: teamCode },
  { path: "team-members/InviteMemberDialog.vue", code: dialogCode },
  { path: "team-members/index.ts", code: indexCode },
];
</script>

<template>
  <ComponentPreview
    source="team-members/TeamMembers.vue"
    registry="team-members"
    :files="files"
    :height="560"
  >
    <TeamMembers />
  </ComponentPreview>
</template>
