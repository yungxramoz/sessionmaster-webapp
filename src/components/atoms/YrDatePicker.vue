<script lang="ts">
import { VDatePicker } from 'vuetify/lib'

import { Component, Prop } from 'vue-property-decorator'

@Component
export default class YrDatePicker extends VDatePicker {
  @Prop({ default: 'secondary darken-1' }) private color!: string
  @Prop({ default: 'primary' }) private headerColor!: string
  @Prop({ default: 'accent' }) private eventColor!: string
  @Prop({ default: 1 }) private firstDayOfWeek!: string | number
  @Prop({ default: 2 }) private elevation!: string | number
  @Prop({ default: true }) private fullWidth!: string | boolean
}
</script>

<style lang="scss" scoped>
.v-picker::v-deep {
  border: thin solid rgba(0, 0, 0, 0.12);
}
</style>
