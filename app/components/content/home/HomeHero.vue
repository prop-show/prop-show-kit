<script setup lang="ts">
import { Button } from '~/components/ui/button'

const props = defineProps<{
  componentCount: number
  quickStartPath: string
  sourceUrl: string
}>()

const { t } = useDocusI18n()
const formattedCount = computed(() => String(props.componentCount).padStart(2, '0'))
</script>

<template>
  <section
    class="grid border-b border-default lg:grid-cols-[minmax(0,1fr)_20rem]"
    aria-labelledby="home-hero-title"
  >
    <div class="px-6 py-18 sm:px-10 sm:py-22 lg:px-14 lg:py-28 xl:px-18">
      <p class="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
        {{ t('home.hero.eyebrow') }}
      </p>

      <h1
        id="home-hero-title"
        class="mt-6 max-w-[11ch] text-5xl leading-[0.92] font-black tracking-[-0.055em] text-highlighted sm:text-6xl lg:text-7xl"
      >
        {{ t('home.hero.title') }}
      </h1>

      <p class="mt-7 max-w-[38rem] text-base leading-7 text-muted sm:text-lg sm:leading-8">
        {{ t('home.hero.description') }}
      </p>

      <div class="mt-9 flex flex-wrap gap-3">
        <Button as-child>
          <NuxtLink
            :to="quickStartPath"
          >
            {{ t('home.hero.getStarted') }}
          </NuxtLink>
        </Button>
        <Button as-child variant="secondary">
          <NuxtLink
            :href="sourceUrl"
            target="_blank"
            rel="noreferrer"
          >
            {{ t('home.hero.viewSource') }}
          </NuxtLink>
        </Button>
      </div>
    </div>

    <aside class="flex min-h-72 flex-col justify-between bg-primary p-6 text-neutral-950 sm:p-8 lg:min-h-0">
      <p class="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
        {{ t('home.hero.libraryIndex') }}
      </p>

      <div class="py-12 lg:py-8">
        <p class="font-mono text-[clamp(5rem,10vw,8rem)] leading-none font-black tracking-[-0.08em]">
          {{ formattedCount }}
        </p>
        <p class="mt-2 text-sm font-bold uppercase tracking-[0.08em]">
          {{ t('home.hero.availableComponents') }}
        </p>
      </div>

      <dl class="divide-y divide-neutral-950/25 border-y border-neutral-950/35 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
        <div class="flex justify-between gap-4 py-3">
          <dt>{{ t('home.hero.foundation') }}</dt>
          <dd>shadcn-vue</dd>
        </div>
        <div class="flex justify-between gap-4 py-3">
          <dt>{{ t('home.hero.delivery') }}</dt>
          <dd>{{ t('home.hero.copyPaste') }}</dd>
        </div>
      </dl>
    </aside>
  </section>
</template>
