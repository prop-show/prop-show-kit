declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent;
  export default component;
}

interface ImportMeta {
  readonly client: boolean;
}
