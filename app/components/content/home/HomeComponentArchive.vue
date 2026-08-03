<script setup lang="ts">
interface ArchiveItem {
  name: string
  description: string
  href: string
  tag: string
}

const props = defineProps<{
  items: ArchiveItem[]
}>()

const { locale } = useDocusI18n()
const formattedCount = computed(() => String(props.items.length).padStart(2, '0'))
</script>

<template>
  <section class="px-6 py-18 sm:px-10 sm:py-22 lg:px-14 lg:py-24 xl:px-18" aria-labelledby="component-archive-title">
    <div class="mb-8 flex items-end justify-between gap-6 border-b border-default pb-5">
      <h2
        id="component-archive-title"
        class="text-3xl leading-none font-black tracking-[-0.04em] text-highlighted md:text-4xl"
      >
        {{ locale === 'zh-CN' ? '组件' : 'Components' }}
      </h2>
      <p class="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
        {{ formattedCount }} {{ locale === 'zh-CN' ? '项' : 'entries' }}
      </p>
    </div>

    <nav
      class="divide-y divide-default border-y border-default"
      :aria-label="locale === 'zh-CN' ? '组件目录' : 'Component directory'"
    >
      <NuxtLink
        v-for="(item, index) in items"
        :key="item.href"
        :to="item.href"
        class="group grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 bg-default py-5 transition-colors duration-200 hover:bg-elevated focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:grid-cols-[4rem_minmax(0,1fr)_10rem_1.5rem] md:items-center md:gap-x-6 md:px-4"
      >
        <span class="font-mono text-[11px] font-bold tracking-[0.14em] text-dimmed">
          {{ String(index + 1).padStart(2, '0') }}
        </span>
        <span>
          <span class="block text-xl font-black tracking-[-0.025em] text-highlighted sm:text-2xl">
            {{ item.name }}
          </span>
          <span class="mt-1 block text-sm leading-6 text-muted">
            {{ item.description }}
          </span>
        </span>
        <span class="hidden font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted md:block">
          {{ item.tag }}
        </span>
        <span
          aria-hidden="true"
          class="hidden size-6 place-items-center bg-primary text-sm font-bold text-neutral-950 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none md:grid"
        >→</span>
      </NuxtLink>
    </nav>
  </section>
</template>
