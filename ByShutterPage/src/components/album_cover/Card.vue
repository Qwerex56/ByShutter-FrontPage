<script setup lang="ts">
const stopPropagation = e => {
    console.log(e);
}
</script>

<template>
<div class="absolute w-50 h-75 rounded-2xl bg-red-400 shadow">
    Album Cover
    <button :click="stopPropagation" to="/home" class="bg-amber-500">
        btn
    </button>
</div>

    <!-- <img src="" alt="Album cover" class="absolute w-50 h-75 rounded-2xl bg-red-400 shadow"> -->
</template>