<script lang="ts">
import { VBtn } from 'vuetify/lib'

import { Component, Prop } from 'vue-property-decorator'

@Component
export default class YrBtn extends VBtn {
  @Prop({ default: 'primary' }) private color!: string
}
</script>
