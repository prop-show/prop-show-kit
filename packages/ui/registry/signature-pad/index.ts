export { default as SignaturePad } from "./SignaturePad.vue";
export type {
  SignatureExport,
  SignatureImageType,
  SignaturePoint,
  SignatureStroke,
} from "./stroke";
export {
  canvasBackground,
  isSignatureEmpty,
  normalizeImageType,
  pointFromClient,
  strokeCommands,
  undoStroke,
} from "./stroke";
