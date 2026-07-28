<script setup lang="ts">
const props = defineProps<{
    componentCount: number
    sourceUrl: string
}>()

const formattedCount = computed(() => String(props.componentCount).padStart(2, '0'))
</script>

<template>
    <section
        class="grid border-b border-default lg:grid-cols-[minmax(0,1fr)_20rem]"
        aria-labelledby="home-hero-title"
    >
        <div class="px-6 py-18 sm:px-10 sm:py-22 lg:px-14 lg:py-28 xl:px-18">
            <p class="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                Shadcn-vue extensions
            </p>

            <h1
                id="home-hero-title"
                class="mt-6 max-w-[11ch] text-5xl leading-[0.92] font-black tracking-[-0.055em] text-highlighted sm:text-6xl lg:text-7xl"
            >
                Copy what’s missing. Own every line.
            </h1>

            <p class="mt-7 max-w-[38rem] text-base leading-7 text-muted sm:text-lg sm:leading-8">
                Practical Vue components for the gaps in your base library. Add the
                source, adapt it to your product, and ship without package lock-in.
            </p>

            <div class="mt-9 flex flex-wrap gap-3">
                <NuxtLink
                    to="/en/getting-started/quick-start"
                    class="inline-flex min-h-11 items-center gap-2 border border-neutral-950 bg-primary px-4 font-mono text-xs font-bold uppercase tracking-[0.08em] text-neutral-950 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary motion-reduce:transform-none"
                >
                    Get started
                    <span aria-hidden="true">↗</span>
                </NuxtLink>
                <a
                    :href="sourceUrl"
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex min-h-11 items-center border border-default bg-default px-4 font-mono text-xs font-bold uppercase tracking-[0.08em] text-highlighted transition-colors duration-200 hover:bg-elevated focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
                >
                    View source
                </a>
            </div>
        </div>

        <aside class="flex min-h-72 flex-col justify-between bg-primary p-6 text-neutral-950 sm:p-8 lg:min-h-0">
            <p class="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
                Library index
            </p>

            <div class="py-12 lg:py-8">
                <p class="font-mono text-[clamp(5rem,10vw,8rem)] leading-none font-black tracking-[-0.08em]">
                    {{ formattedCount }}
                </p>
                <p class="mt-2 text-sm font-bold uppercase tracking-[0.08em]">
                    Available components
                </p>
            </div>

            <dl class="divide-y divide-neutral-950/25 border-y border-neutral-950/35 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                <div class="flex justify-between gap-4 py-3">
                    <dt>Foundation</dt>
                    <dd>shadcn-vue</dd>
                </div>
                <div class="flex justify-between gap-4 py-3">
                    <dt>Delivery</dt>
                    <dd>Copy &amp; paste</dd>
                </div>
            </dl>
        </aside>
    </section>
</template>
