import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  Designer,
  IconWidget,
  Workbench,
  Workspace,
  ViewPanel,
  DesignerToolsWidget,
  ViewToolsWidget,
  OutlineTreeWidget,
  ResourceWidget,
  StudioPanel,
  CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  SettingsPanel,
  HistoryWidget,
} from '@over58/designable-react'
import { SettingsForm, MonacoInput } from '@over58/designable-react-settings-form'
import { observer } from '@formily/react'
import {
  createDesigner,
  createResource,
  createBehavior,
  GlobalRegistry,
} from '@over58/designable-core'
import { Content } from './content'
import { Space, Button, Radio } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import 'antd/dist/antd.less'

const RootBehavior = createBehavior({
  name: 'Root',
  selector: 'Root',
  designerProps: {
    droppable: true,
  },
  designerLocales: {
    'zh-CN': {
      title: '根组件',
    },
    'en-US': {
      title: 'Root',
    },
  },
})

const InputBehavior = createBehavior({
  name: 'Input',
  selector: (node) =>
    node.componentName === 'Field' && node.props['x-component'] === 'Input',
  designerProps: {
    propsSchema: {
      type: 'object',
      $namespace: 'Field',
      properties: {
        'field-properties': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '字段属性',
          properties: {
            title: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },

            hidden: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            default: {
              'x-decorator': 'FormItem',
              'x-component': 'ValueInput',
            },
            test: {
              type: 'void',
              title: '测试',
              'x-decorator': 'FormItem',
              'x-component': 'DrawerSetter',
              'x-component-props': {
                text: '打开抽屉',
              },
              properties: {
                test: {
                  type: 'string',
                  title: '测试输入',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
          },
        },

        'component-styles': {
          type: 'void',
          title: '样式',
          'x-component': 'CollapseItem',
          properties: {
            'style.width': {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'SizeInput',
            },
            'style.height': {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'SizeInput',
            },
            'style.display': {
              'x-component': 'DisplayStyleSetter',
            },
            'style.background': {
              'x-component': 'BackgroundStyleSetter',
            },
            'style.boxShadow': {
              'x-component': 'BoxShadowStyleSetter',
            },
            'style.font': {
              'x-component': 'FontStyleSetter',
            },
            'style.margin': {
              'x-component': 'BoxStyleSetter',
            },
            'style.padding': {
              'x-component': 'BoxStyleSetter',
            },
            'style.borderRadius': {
              'x-component': 'BorderRadiusStyleSetter',
            },
            'style.border': {
              'x-component': 'BorderStyleSetter',
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '输入框',
      settings: {
        title: '标题',
        hidden: '是否隐藏',
        default: '默认值',
        style: {
          width: '宽度',
          height: '高度',
          display: '展示',
          background: '背景',
          boxShadow: '阴影',
          font: '字体',
          margin: '外边距',
          padding: '内边距',
          borderRadius: '圆角',
          border: '边框',
        },
      },
    },
    'en-US': {
      title: 'Input',
      settings: {
        title: 'Title',
        hidden: 'Hidden',
        default: 'Default Value',
        style: {
          width: 'Width',
          height: 'Height',
          display: 'Display',
          background: 'Background',
          boxShadow: 'Box Shadow',
          font: 'Font',
          margin: 'Margin',
          padding: 'Padding',
          borderRadius: 'Border Radius',
          border: 'Border',
        },
      },
    },
  },
})

const CardBehavior = createBehavior({
  name: 'Card',
  selector: 'Card',
  designerProps: {
    droppable: true,
  },
  designerLocales: {
    'zh-CN': {
      title: '卡片',
    },
    'en-US': {
      title: 'Card',
    }
  },
})

GlobalRegistry.setDesignerBehaviors([RootBehavior, InputBehavior, CardBehavior])

const Input = createResource({
  title: {
    'zh-CN': '输入框',
    'en-US': 'Input',
  },
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: '输入框',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
    },
  ],
})

const Card = createResource({
  title: {
    'zh-CN': '卡片',
    'en-US': 'Card'
  },
  icon: 'CardSource',
  elements: [
    {
      componentName: 'Card',
      props: {
        title: '卡片',
      },
    },
  ],
})

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Displays: '展示控件',
      Feedbacks: '反馈控件',
    },
  },
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Displays: 'Displays',
      Feedbacks: 'Feedbacks',
    },
  }
})

const Logo: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
    <IconWidget
      infer="Logo"
      style={{ margin: 10, height: 24, width: 'auto' }}
    />
  </div>
)

const Actions = observer(() => (
  <Space style={{ marginRight: 10 }}>
    <Radio.Group
      value={GlobalRegistry.getDesignerLanguage()}
      optionType="button"
      options={[
        { label: 'English', value: 'en-us' },
        { label: '简体中文', value: 'zh-cn' },
      ]}
      onChange={(e) => {
        GlobalRegistry.setDesignerLanguage(e.target.value)
      }}
    />
    <Button href="https://github.com/over58/designable" target="_blank">
      <GithubOutlined />
      Github
    </Button>
    <Button>保存</Button>
    <Button type="primary">发布</Button>
  </Space>
))

const engine = createDesigner()
window.engine = engine
const App = () => {
  return (
    <Designer engine={engine}>
      <Workbench>
        <StudioPanel logo={<Logo />} actions={<Actions />}>
          <CompositePanel>
            <CompositePanel.Item title="panels.Component" icon="Component">
              <ResourceWidget title="sources.Inputs" sources={[Input, Card]} />
              <ResourceWidget
                title="sources.Displays"
                sources={[Input, Card]}
              />
              <ResourceWidget
                title="sources.Feedbacks"
                sources={[Input, Card]}
              />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
              <OutlineTreeWidget />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.History" icon="History">
              <HistoryWidget />
            </CompositePanel.Item>
          </CompositePanel>
          <Workspace id="form-1">
            <WorkspacePanel>
              <ToolbarPanel>
                <DesignerToolsWidget />
                <ViewToolsWidget />{' '}
              </ToolbarPanel>
              <ViewportPanel>
                <ViewPanel type="DESIGNABLE">{() => <Content />}</ViewPanel>
                <ViewPanel type="JSONTREE">
                  {() => {
                    return (
                      <div style={{ overflow: 'hidden', height: '100%' }}>
                        <MonacoInput
                          language="javascript"
                          helpCode="//hello world"
                          defaultValue={`<div><div>123123<div>123123<div>123123<div>123123</div></div></div></div></div>`}
                        />
                      </div>
                    )
                  }}
                </ViewPanel>
              </ViewportPanel>
            </WorkspacePanel>
          </Workspace>
          <Workspace id="form-2">
            <WorkspacePanel>
              <ToolbarPanel>
                <DesignerToolsWidget />
                <ViewToolsWidget />{' '}
              </ToolbarPanel>
              <ViewportPanel>
                <ViewPanel type="DESIGNABLE">{() => <Content />}</ViewPanel>
                <ViewPanel type="JSONTREE">
                  {() => {
                    return (
                      <div style={{ overflow: 'hidden', height: '100%' }}>
                        <MonacoInput
                          language="javascript"
                          helpCode="//hello world"
                          defaultValue={`<div><div>123123<div>123123<div>123123<div>123123</div></div></div></div></div>`}
                        />
                      </div>
                    )
                  }}
                </ViewPanel>
              </ViewportPanel>
            </WorkspacePanel>
          </Workspace>
          <SettingsPanel title="panels.PropertySettings">
            <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
          </SettingsPanel>
        </StudioPanel>
      </Workbench>
    </Designer>
  )
}


const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(<App />)
