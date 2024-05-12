<template>
    <Suspense>
        <template #default>
            <slot name="loadedComponent"></slot>
        </template>
        <template #fallback>
            <slot name="loaderComponent"></slot>
        </template>
    </Suspense>
</template>
<script setup>
</script>