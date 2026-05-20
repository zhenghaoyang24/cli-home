<script setup lang="ts">
import { computed } from "vue";
import { marked } from "marked";

const props = defineProps<{ content: string }>();

const html = computed(() => {
  if (!props.content) return "";
  return marked.parse(props.content, { breaks: true }) as string;
});
</script>

<template>
  <div class="markdown-body" v-html="html" />
</template>

<style scoped>
.markdown-body {
  font-family: inherit;
  line-height: 1.65;
  word-break: break-word;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  margin: 1em 0 0.5em;
  font-weight: 600;
  line-height: 1.3;
}
.markdown-body :deep(h1) { font-size: 1.25em; }
.markdown-body :deep(h2) { font-size: 1.15em; }
.markdown-body :deep(h3) { font-size: 1.08em; }

.markdown-body :deep(p) {
  margin: 0.4em 0;
}
.markdown-body :deep(p:first-child) {
  margin-top: 0;
}
.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0.4em 0;
  padding-left: 1.5em;
}
.markdown-body :deep(li) {
  margin: 0.2em 0;
}

.markdown-body :deep(blockquote) {
  margin: 0.6em 0;
  padding: 0.3em 0.8em;
  border-left: 3px solid var(--accent-bd, #3b4261);
  opacity: 0.85;
}

.markdown-body :deep(code) {
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  font-size: 0.85em;
  padding: 0.15em 0.4em;
  border-radius: 3px;
  background: rgba(128, 128, 128, 0.12);
}

.markdown-body :deep(pre) {
  margin: 0.6em 0;
  padding: 0.8em 1em;
  border-radius: 6px;
  overflow-x: auto;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(128, 128, 128, 0.1);
}
.markdown-body :deep(pre code) {
  padding: 0;
  background: none;
  font-size: 0.8em;
  line-height: 1.5;
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  margin: 0.6em 0;
  font-size: 0.9em;
  width: 100%;
}
.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid rgba(128, 128, 128, 0.2);
  padding: 0.4em 0.6em;
  text-align: left;
}
.markdown-body :deep(th) {
  font-weight: 600;
  background: rgba(128, 128, 128, 0.08);
}

.markdown-body :deep(hr) {
  margin: 0.8em 0;
  border: none;
  border-top: 1px solid rgba(128, 128, 128, 0.15);
}

.markdown-body :deep(a) {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.markdown-body :deep(strong) {
  font-weight: 600;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 4px;
  margin: 0.6em 0;
}
</style>
