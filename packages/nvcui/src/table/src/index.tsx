import { defineComponent } from 'vue'
import type { TableProps } from 'nvcui/typings/table'
import { useGenClass } from '@nvcui/utils'
import { Header } from './header'
import { Body } from './body'

function getType(val: unknown) {
  return Object.prototype.toString.call(val).slice(8, -1)
}

function filterSlotColumns(columns: any) {
  return columns.filter((item: any) => getType(item.type) === 'Function' && item.type.displayName === 'NTableColumn')
}

/**
 *
 * todo
 * 使用v-slots 将slots 传入到组件中
 */
export default defineComponent((props: TableProps, { slots }) => {
  return () => {
    /** ? 获取插槽内容 并过滤出非 TableColumn */
    const slotColumns = filterSlotColumns(slots.default?.() ?? [])

    /**
     *  ? 需要渲染的列 优先级 传入的props column > slots column
     */
    const renderColums: any[] = []

    // ? 判断是否传入了columns
    if (props.columns?.length) {
      renderColums.push(...props.columns)
      slotColumns.length = 0
    }

    // ? 判断有效的插槽内容是否存在
    if (slotColumns.length) {
      // 收集 slotColumns 下传递的数据
      slotColumns.forEach((item: any) => {
        const { prop, title } = item.props
        renderColums.push({
          key: prop,
          title,
        })
      })
    }

    if (!renderColums.length)
      return

    /** 样式 */
    const { c, cx } = useGenClass('table')

    const tableCls = cx(() => {
      return {
        [c()]: true,
      }
    })

    return (
      <table class={tableCls.value}>
        <Header columns={renderColums} v-slots={slots} />
        <Body columns={renderColums} data={props.data} />
      </table>

    )
  }
}, {
  name: 'NTable',
})
