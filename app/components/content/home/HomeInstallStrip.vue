<script setup lang="ts">
defineProps<{
  command: string
  installationPath: string
}>()

const { locale } = useDocusI18n()
</script>

<template>
  <section
    class="grid gap-8 border-t border-default bg-elevated px-6 py-14 sm:px-10 lg:grid-cols-[minmax(15rem,0.65fr)_minmax(0,1.35fr)] lg:items-center lg:gap-14 lg:px-14 xl:px-18"
    aria-labelledby="install-strip-title"
  >
    <div>
      <p class="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
        {{ locale === 'zh-CN' ? '安装' : 'Install' }}
      </p>
      <h2
        id="install-strip-title"
        class="mt-3 text-3xl leading-tight font-black tracking-[-0.04em] text-highlighted md:text-4xl"
      >
        {{ locale === 'zh-CN' ? '添加一个组件。' : 'Add one component.' }}
      </h2>
      <NuxtLink
        :to="installationPath"
        class="mt-4 inline-flex font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-highlighted underline decoration-primary decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
      >
        {{ locale === 'zh-CN' ? '阅读安装指南' : 'Read installation guide' }}
      </NuxtLink>
    </div>

    <div class="min-w-0 border border-default bg-default">
      <div class="flex items-center justify-between border-b border-default px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
        <span>{{ locale === 'zh-CN' ? '终端' : 'Terminal' }}</span>
        <span>Copy.vue</span>
      </div>
      <div class="flex min-w-0 items-center gap-3 overflow-x-auto px-4 py-5 font-mono text-xs text-highlighted sm:px-5 sm:text-sm">
        <span class="font-black text-primary">$</span>
        <code class="whitespace-nowrap">{{ command }}</code>
      </div>
    </div>
  </section>
</template>
