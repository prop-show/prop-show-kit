<script setup lang="ts">
defineProps<{
  command: string
  installationPath: string
}>()

const { t } = useDocusI18n()
</script>

<template>
  <section
    class="grid gap-8 border-t border-default bg-elevated px-6 py-14 sm:px-10 lg:grid-cols-[minmax(15rem,0.65fr)_minmax(0,1.35fr)] lg:items-center lg:gap-14 lg:px-14 xl:px-18"
    aria-labelledby="install-strip-title"
  >
    <div>
      <p class="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
        {{ t('home.install.eyebrow') }}
      </p>
      <h2
        id="install-strip-title"
        class="mt-3 text-3xl leading-tight font-black tracking-[-0.04em] text-highlighted md:text-4xl"
      >
        {{ t('home.install.title') }}
      </h2>
      <NuxtLink
        :to="installationPath"
        class="mt-4 inline-flex font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-highlighted underline decoration-primary decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
      >
        {{ t('home.install.guide') }}
      </NuxtLink>
    </div>

    <InstallationTabs component-name="copy" />
  </section>
</template>
