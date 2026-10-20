import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { fileURLToPath } from "node:url";
import { expect, it } from "vite-plus/test";

it("keeps modal scroll locks in their preview document and shares nested locks", async () => {
  const packageRoot = dirname(fileURLToPath(import.meta.resolve("reka-ui/package.json")));
  const modulePath = resolve(packageRoot, "dist/shared/useBodyScrollLock.cjs");
  const packageRequire = createRequire(modulePath);
  const vue = packageRequire("vue");
  const document = () => ({
    body: { style: { overflow: "", pointerEvents: "", paddingRight: "", marginRight: "" } },
    documentElement: { clientWidth: 700, style: { removeProperty() {} } },
    defaultView: { innerWidth: 700 },
  });
  const parent = document();
  const firstPreview = document();
  const secondPreview = document();
  let target;
  const exports = {};
  runInNewContext(await readFile(modulePath, "utf8"), {
    exports,
    globalThis: { document: parent },
    document: parent,
    window: parent.defaultView,
    require(id) {
      if (id === "../ConfigProvider/ConfigProvider.cjs") {
        return {
          injectConfigProviderContext: () => ({
            teleportTo: vue.ref(target),
            scrollBody: vue.ref(true),
          }),
        };
      }
      if (id === "../DismissableLayer/context.cjs") {
        return { context: { layersWithOutsidePointerEventsDisabled: new Set() } };
      }
      if (id === "@vueuse/shared") {
        return { isClient: true, isIOS: false, tryOnBeforeUnmount: vue.onScopeDispose };
      }
      if (id === "@vueuse/core") {
        return {
          createSharedComposable: (setup) => {
            let state;
            return (...args) => (state ??= setup(...args));
          },
        };
      }
      return packageRequire(id);
    },
  });
  const scope = vue.effectScope();
  try {
    let first, nested, second;
    scope.run(() => {
      target = { ownerDocument: firstPreview };
      first = exports.useBodyScrollLock(true);
      nested = exports.useBodyScrollLock(true);
      target = { ownerDocument: secondPreview };
      second = exports.useBodyScrollLock(true);
    });
    await vue.nextTick();
    expect(parent.body.style.overflow).toBe("");
    expect(parent.body.style.pointerEvents).toBe("");
    expect(firstPreview.body.style.overflow).toBe("hidden");
    expect(secondPreview.body.style.overflow).toBe("hidden");

    first.value = false;
    await vue.nextTick();
    expect(firstPreview.body.style.overflow).toBe("hidden");
    nested.value = false;
    await vue.nextTick();
    expect(firstPreview.body.style.overflow).toBe("");
    expect(firstPreview.body.style.pointerEvents).toBe("");
    expect(secondPreview.body.style.overflow).toBe("hidden");
    second.value = false;
    await vue.nextTick();
    expect(secondPreview.body.style.overflow).toBe("");
    expect(parent.body.style.pointerEvents).toBe("");

    let outside;
    scope.run(() => {
      target = undefined;
      outside = exports.useBodyScrollLock(true);
    });
    await vue.nextTick();
    expect(parent.body.style.overflow).toBe("hidden");
    expect(firstPreview.body.style.overflow).toBe("");
    expect(secondPreview.body.style.overflow).toBe("");
    outside.value = false;
    await vue.nextTick();
    expect(parent.body.style.overflow).toBe("");
  } finally {
    scope.stop();
  }
});
