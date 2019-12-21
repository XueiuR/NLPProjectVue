<template>
    <div class="wrapper">
        <div class="content-box">
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive >
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
</script>
