<template>
  <div class="flex">
    <div class="left bg-Pink">
        <VSideBar></VSideBar>
    </div>
    <div class="right flex flex-col flex1">
        <VNav></VNav>
        <router-view />
    </div>
    
  </div>
</template>

<script>
    import VNav from "./nav/index.vue";
    import VSideBar from "./sidebar/index.vue";
    export default {
        name: "Dashboard",
        components: { VNav,VSideBar },
    };
</script>

<style scoped>
</style>
