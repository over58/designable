import React, { Fragment, useMemo, useState } from 'react'
import cls from 'classnames'
import { Modal, Button } from 'antd'
import { Form } from '@formily/core'
import { observable } from '@formily/reactive'
import { observer } from '@formily/reactive-react'
import { usePrefix, useTheme, TextWidget } from '@over58/designable-react'
import { DataSettingPanel } from './DataSettingPanel'
import { TreePanel } from './TreePanel'
import { transformDataToValue, transformValueToData } from './shared'
import { IDataSourceItem, ITreeDataSource } from './types'
import './styles.less'
export interface IDataSourceSetterProps {
  className?: string
  style?: React.CSSProperties
  onChange: (dataSource: IDataSourceItem[]) => void
  value: IDataSourceItem[]
  allowTree?: boolean
  allowExtendOption?: boolean
  defaultOptionValue?: {
    label: string
    value: any
  }[]
  effects?: (form: Form<any>) => void
}

export const DataSourceSetter: React.FC<IDataSourceSetterProps> = observer(
  (props) => {
    const {
      className,
      value = [],
      onChange,
      allowTree = true,
      allowExtendOption = true,
      defaultOptionValue,
      effects = () => {},
    } = props
    const theme = useTheme()
    const prefix = usePrefix('data-source-setter')
    const [modalOpen, setModalOpen] = useState(false)
    const treeDataSource: ITreeDataSource = useMemo(
      () =>
        observable({
          dataSource: transformValueToData(value),
          selectedKey: '',
        }),
      [value, modalOpen]
    )
    const openModal = () => setModalOpen(true)
    const closeModal = () => setModalOpen(false)
    return (
      <Fragment>
        <Button block onClick={openModal}>
          <TextWidget token="SettingComponents.DataSourceSetter.configureDataSource" />
        </Button>
        <Modal
          title={
            <TextWidget token="SettingComponents.DataSourceSetter.configureDataSource" />
          }
          width="65%"
          bodyStyle={{ padding: 10 }}
          transitionName=""
          maskTransitionName=""
          open={modalOpen}
          onCancel={closeModal}
          onOk={() => {
            onChange(transformDataToValue(treeDataSource.dataSource))
            closeModal()
          }}
        >
          <div
            className={`${cls(prefix, className)} ${prefix + '-' + theme} ${
              prefix + '-layout'
            }`}
          >
            <div className={`${prefix + '-layout-item left'}`}>
              <TreePanel
                defaultOptionValue={defaultOptionValue as any}
                allowTree={allowTree}
                treeDataSource={treeDataSource}
              ></TreePanel>
            </div>
            <div className={`${prefix + '-layout-item right'}`}>
              <DataSettingPanel
                allowExtendOption={allowExtendOption}
                treeDataSource={treeDataSource}
                effects={effects}
              ></DataSettingPanel>
            </div>
          </div>
        </Modal>
      </Fragment>
    )
  }
)
