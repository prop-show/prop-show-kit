# PropShow Kit

[English](#english) | [中文](#chinese)

<a name="english"></a>

## English

**PropShow Kit** is an **add-on registry for [shadcn-vue](https://www.shadcn-vue.com/)** — companion components layered on top of the base library, the way an add-on extends the thing it plugs into. It follows the same **copy-and-paste** philosophy as shadcn-vue: there is no package to install, you copy the component source straight into your project and own it.

### Local registry development

By default, the registry uses the address and port resolved by the development server, preferring a network address when listening on `0.0.0.0` or `::`. When accessing it through a proxy or from another device, you can explicitly set an address reachable by the client:

```sh
vp run ui#build
cd packages/docs
node scripts/undocs.mjs dev . --host 0.0.0.0 --port 3000 --registry-url http://192.168.1.10:3000/
```

Replace the example IP with your development machine's address. `--registry-url` only affects the development registry's homepage and dependency URLs for components from this registry. Production builds use the `url` in `.config/docs.yaml`.

### Features

- 🎨 **Shadcn-native** - Built on `reka-ui` and the same Tailwind CSS v4 tokens and shadcn-vue primitives you already use.
- 🧩 **Registry distribution** - Components install through the `shadcn-vue` CLI and land in your project as source you own.
- 📋 **TypeScript** - Fully typed props and slots.
- ♿ **Accessible** - ARIA roles, labels and keyboard navigation built in.
- 🌙 **Dark mode** - Semantic color tokens keep light and dark themes working.
- 📝 **Docs with undocs** - Documentation, guides and live previews powered by [undocs](https://github.com/unjs/undocs) (Vite + Nitro + Vue).

<a name="chinese"></a>

## 中文

**PropShow Kit** 是 **[shadcn-vue](https://www.shadcn-vue.com/) 的附属组件库** —— 在基础组件库之上补充的配套组件，就像模组的附属模组一样。它同样遵循 **复制即用** 的理念：无需安装任何包，直接把组件源码复制进你的项目即可拥有它。

### 本地 registry 调试

默认使用开发服务器实际解析的地址和端口；监听 `0.0.0.0` 或 `::` 时优先使用网络地址。通过代理或其他设备访问时，可以显式指定客户端可访问的地址：

```sh
vp run ui#build
cd packages/docs
node scripts/undocs.mjs dev . --host 0.0.0.0 --port 3000 --registry-url http://192.168.1.10:3000/
```

将示例 IP 替换为开发机地址。`--registry-url` 仅影响开发 registry 的主页和自有组件依赖地址，生产构建使用 `.config/docs.yaml` 中的 `url`。

### 特性

- 🎨 **Shadcn 原生** - 基于 `reka-ui` 与同一套 Tailwind CSS v4 token 和 shadcn-vue 原子组件。
- 🧩 **Registry 分发** - 通过 `shadcn-vue` CLI 安装，源码落在你的项目里归你所有。
- 📋 **TypeScript** - 完整的 props / slots 类型。
- ♿ **可访问性** - 内置 ARIA role、label 与键盘导航。
- 🌙 **暗色模式** - 语义色 token，明暗主题照常工作。
- 📝 **undocs 文档站** - 文档、指南与实时预览由 [undocs](https://github.com/unjs/undocs)（Vite + Nitro + Vue）驱动。
