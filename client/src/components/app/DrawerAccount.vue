<template>
    <v-list>
        <v-list-item class="px-2 py-5">
            <div class="cursor-pointer" @click="handleMenuItemClick()">
                <!-- to="/device" -->
                <img height="45" src="@/assets/airbolt-logo.png" />
                <!-- <v-img
                alt="AirBolt"
                contain
                src="@/assets/airbolt-logo.png"
                height="45"
            /> -->
            </div>
        </v-list-item>
    </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
    components: {},
})
export default class Drawer extends Vue {
    // @Prop({ required: true })
    // ResetDevices!: () => void;

    @Prop({ required: true })
    onLogoClick!: () => void;

    handleMenuItemClick() {
        // this.ResetDevices();
        this.onLogoClick();
    }
}
</script>
