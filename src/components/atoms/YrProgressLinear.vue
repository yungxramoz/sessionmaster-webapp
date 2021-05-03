<script lang="ts">
import { VProgressLinear } from 'vuetify/lib'

import { Component, Prop } from 'vue-property-decorator'

@Component
export default class YrBtn extends VProgressLinear {
  @Prop({ default: 'accent' }) private color!: string
  @Prop({ default: true }) private indeterminate!: boolean
}
</script>
