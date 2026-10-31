# PropShow Kit

Add-on registry for [shadcn-vue](https://www.shadcn-vue.com/). The CLI copies a component or a block into your project. There is no npm package.

[Site](https://kit.prop.show/) · [Guide](https://kit.prop.show/guide) · [Changelog](CHANGELOG.md) · [Blog](https://kit.prop.show/blog) · [Contributing](CONTRIBUTING.md)

[English](#english) | [中文](#chinese)

<a name="english"></a>

## English

### Install in 30 seconds

The project needs [shadcn-vue](https://www.shadcn-vue.com/docs/installation.html) first: Tailwind, a root `components.json`, and `cn` at `@/lib/utils`. `npx shadcn-vue@latest init` creates that setup.

```bash
npx shadcn-vue@latest add https://kit.prop.show/r/copy.json
```

```vue
<script setup lang="ts">
import { Copy } from "@/components/copy";
</script>

<template>
  <Copy content="Hello, PropShow Kit!" />
</template>
```

Register the registry once if you want short names. In `components.json`:

```json
{
  "registries": {
    "@propshow": "https://kit.prop.show/r/{name}.json"
  }
}
```

```bash
npx shadcn-vue@latest add @propshow/copy
```

A block uses the same command, for example `https://kit.prop.show/r/project-overview.json` or `@propshow/project-overview`. The full walkthrough is the [quick start](https://kit.prop.show/guide).

### See it

Live previews on the docs site:

- [Components](https://kit.prop.show/components) — 14 pieces. Open [Copy](https://kit.prop.show/components/copy), [Frame](https://kit.prop.show/components/frame), or [Comments Thread](https://kit.prop.show/components/comments-thread).
- [Blocks](https://kit.prop.show/blocks) — 3 screens. Open [project overview](https://kit.prop.show/blocks/project-overview), [team members](https://kit.prop.show/blocks/team-members), or [workspace settings](https://kit.prop.show/blocks/workspace-settings).
- [Workspace](https://kit.prop.show/blocks/workspace) — project overview, team directory, and settings.

### Features

- **Copied, not installed.** No package and no version to track. The CLI writes the source into your repo.
- **Shadcn-native.** Built on `reka-ui` and the same Tailwind CSS v4 tokens and shadcn-vue primitives (`button`, `tooltip`, `badge`, `dropdown-menu`).
- **TypeScript.** Typed props and slots.
- **Accessible.** ARIA roles, labels, and keyboard navigation ship with the component.
- **Dark mode.** Semantic color tokens keep light and dark themes working.
- **Two shapes.** A component fills one gap. A block installs a section or a screen, including sample copy you replace before publishing.

### What changed

- [CHANGELOG.md](CHANGELOG.md) — dated list in this repository.
- [Blog](https://kit.prop.show/blog) — longer notes.
- [What changed](https://kit.prop.show/guide/changelog) — the same entry point on the docs site.

### Local debugging

You do not need this repository to install a component. Clone it when you are changing a component, a block, or the docs.

Requirements: Node.js 22.18 or newer, and [Vite+](https://viteplus.dev/) (`vp`).

```sh
vp install
vp dev
```

`vp dev` builds the registry, then starts the docs site. The dev registry uses the address the server binds, and prefers a network address when it listens on `0.0.0.0` or `::`. Production builds use `url` in `packages/docs/.config/docs.yaml` (`https://kit.prop.show/`).

Through a proxy or from another device, set a registry URL the browser can reach:

```sh
vp run ui#build
cd packages/docs
node scripts/undocs.mjs dev . --host 0.0.0.0 --port 3000 --registry-url http://192.168.1.10:3000/
```

Replace the example IP with your machine. `--registry-url` only rewrites the development registry homepage and dependency URLs for components from this registry.

Component pages use the lightweight `PreviewFrame`. Block pages use `ComponentPreview`: drag or arrow keys to resize, PC (1440px) / iPad (768px) / Phone (390px), fullscreen, reset, and Preview / Code. The preview is an iframe, so media queries follow its width, and that width stays inside the container.

```vue
<ComponentPreview source="frame/Frame.vue" registry="frame">
  <YourExample />
</ComponentPreview>
```

`height` defaults to 240px. Taller content scrolls inside the iframe. Reset leaves fullscreen, restores automatic width, and returns to Preview. Switching tabs or sizes keeps the example's state.

Pull request checks are in [CONTRIBUTING.md](CONTRIBUTING.md). Report vulnerabilities through [SECURITY.md](SECURITY.md). License: [MIT](LICENSE). Attribution for adapted blocks: [NOTICE](NOTICE) and [THIRD_PARTY.md](THIRD_PARTY.md).

<a name="chinese"></a>

## 中文

**PropShow Kit** 是 [shadcn-vue](https://www.shadcn-vue.com/) 的附属 registry。CLI 把组件或 block 的源码复制进你的项目。没有 npm 包。

### 30 秒安装

项目需要先完成 [shadcn-vue](https://www.shadcn-vue.com/docs/installation.html) 初始化：Tailwind、项目根目录的 `components.json`，以及 `@/lib/utils` 里的 `cn`。`npx shadcn-vue@latest init` 会生成这套配置。

```bash
npx shadcn-vue@latest add https://kit.prop.show/r/copy.json
```

```vue
<script setup lang="ts">
import { Copy } from "@/components/copy";
</script>

<template>
  <Copy content="Hello, PropShow Kit!" />
</template>
```

想用短名字时，在 `components.json` 里登记一次：

```json
{
  "registries": {
    "@propshow": "https://kit.prop.show/r/{name}.json"
  }
}
```

```bash
npx shadcn-vue@latest add @propshow/copy
```

Block 用同一条命令，例如 `https://kit.prop.show/r/project-overview.json` 或 `@propshow/project-overview`。完整步骤见[快速开始](https://kit.prop.show/guide)。

### 先看效果

文档站上的实时预览：

- [组件](https://kit.prop.show/components) — 14 个。先看 [Copy](https://kit.prop.show/components/copy)、[Frame](https://kit.prop.show/components/frame)、[评论线程](https://kit.prop.show/components/comments-thread)。
- [Blocks](https://kit.prop.show/blocks) — 3 个现成界面。先看[项目概览](https://kit.prop.show/blocks/project-overview)、[团队成员](https://kit.prop.show/blocks/team-members)、[工作区设置](https://kit.prop.show/blocks/workspace-settings)。
- [工作台](https://kit.prop.show/blocks/workspace) — 项目概览、团队目录和设置。

### 特性

- **复制即拥有。** 没有包，也没有版本号要追。CLI 把源码写进你的仓库。
- **Shadcn 原生。** 基于 `reka-ui`，以及同一套 Tailwind CSS v4 token 和 shadcn-vue 原子组件（`button`、`tooltip`、`badge`、`dropdown-menu`）。
- **TypeScript。** props 和 slots 有类型。
- **可访问。** ARIA role、label 和键盘操作随组件一起提供。
- **暗色模式。** 语义色 token，明暗主题照常工作。
- **两种粒度。** 组件补上缺的一块。Block 装进一节或一整屏，里面的示例文案发布前要换成你自己的。

### 变更记录

- [CHANGELOG.md](CHANGELOG.md) — 本仓库里的日期列表。
- [博客](https://kit.prop.show/blog) — 较长的说明。
- [What changed](https://kit.prop.show/guide/changelog) — 文档站上的同一入口。

### 本地调试

只是安装组件的话，不需要克隆本仓库。改组件、block 或文档时再克隆。

需要 Node.js 22.18 或更高版本，以及 [Vite+](https://viteplus.dev/)（`vp`）。

```sh
vp install
vp dev
```

`vp dev` 会先构建 registry，再启动文档站。开发 registry 使用服务器实际绑定的地址；监听 `0.0.0.0` 或 `::` 时优先使用网络地址。生产构建使用 `packages/docs/.config/docs.yaml` 里的 `url`（`https://kit.prop.show/`）。

通过代理或从另一台设备访问时，指定浏览器能够打开的 registry 地址：

```sh
vp run ui#build
cd packages/docs
node scripts/undocs.mjs dev . --host 0.0.0.0 --port 3000 --registry-url http://192.168.1.10:3000/
```

把示例 IP 换成你的机器地址。`--registry-url` 只改写开发 registry 的主页，以及本 registry 组件的依赖地址。

组件页使用轻量的 `PreviewFrame`。Block 页使用 `ComponentPreview`：拖拽或方向键改宽度，PC（1440px）/ iPad（768px）/ Phone（390px），全屏、恢复默认，以及 Preview / Code。预览在独立 iframe 里，媒体查询按预览宽度生效，宽度也不会超出容器。

```vue
<ComponentPreview source="frame/Frame.vue" registry="frame">
  <YourExample />
</ComponentPreview>
```

`height` 默认 240px。更高的内容在 iframe 内滚动。恢复默认会退出全屏、回到自动宽度，并切回 Preview。切换标签或尺寸会保留示例的交互状态。

提交前的检查见 [CONTRIBUTING.md](CONTRIBUTING.md)。安全问题见 [SECURITY.md](SECURITY.md)。许可证：[MIT](LICENSE)。改编 block 的署名见 [NOTICE](NOTICE) 和 [THIRD_PARTY.md](THIRD_PARTY.md)。
