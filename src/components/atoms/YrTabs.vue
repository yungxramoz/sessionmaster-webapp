<script lang="ts">
import { VTabs } from 'vuetify/lib'

import { Component, Prop } from 'vue-property-decorator'

@Component
export default class YrTabs extends VTabs {
  @Prop({ default: 'accent' }) private color!: string
}
</script>
