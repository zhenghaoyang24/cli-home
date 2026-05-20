import { ref } from "vue";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

const toasts = ref<Toast[]>([]);
let nextId = 1;

export function showToast(message: string, type: Toast["type"] = "error") {
  const id = nextId++;
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 3500);
}

export function useToast() {
  return { toasts };
}
