import React from "react"
import './index.css';

import { Button, DatePicker, Input } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Col, Row, Space } from 'antd';
const { Header, Content, Footer } = Layout;

function RoomComponent() {


  return (
    <Layout className="layout-area">
      <Header className="header-area">
        <div className="logo" />
        <h1>Fala ai!</h1>
      </Header>
      <Row style={{ height: 'calc(100vh - 144px)' }}>
        <Col sm={14} md={16} lg={16} xl={18}>
          <Content className="video-area">
            <video src="" className="video"></video>
          </Content>
        </Col>
        <Col sm={10} md={8} lg={8} xl={6}>
          <Content className="chat-area">
            <div className="chat">
              teste
            </div>
            <div className="new-text-area" style={{}}>
              <Space.Compact style={{ width: '100%' }}>
                <Input defaultValue="" placeholder="Digite..." />
                <Button type="primary">Submit</Button>
              </Space.Compact>
            </div>
          </Content>
        </Col>
      </Row>
      <Footer className="footer-area" style={{ }}>
        <Button>Camera On</Button>
        <Button>Compartilhar Tela</Button>
        <Button>Microfone On</Button>
        {/* Fala Ai! ©2023 Created by Jackson & Gabriel */}
      </Footer>
    </Layout>
  )
}

export default RoomComponent;

// import React from 'react';
// import { Breadcrumb, Layout, Menu, theme } from 'antd';

// const { Header, Content, Footer } = Layout;

// const App: React.FC = () => {
//   const {
//     token: { colorBgContainer },
//   } = theme.useToken();

//   return (
//     <Layout className="layout">
//       <Header>
//         <div className="logo" />
//         <Menu
//           theme="dark"
//           mode="horizontal"
//           defaultSelectedKeys={['2']}
//           items={new Array(15).fill(null).map((_, index) => {
//             const key = index + 1;
//             return {
//               key,
//               label: `nav ${key}`,
//             };
//           })}
//         />
//       </Header>
//       <Content style={{ padding: '0 50px' }}>
//         <Breadcrumb style={{ margin: '16px 0' }}>
//           <Breadcrumb.Item>Home</Breadcrumb.Item>
//           <Breadcrumb.Item>List</Breadcrumb.Item>
//           <Breadcrumb.Item>App</Breadcrumb.Item>
//         </Breadcrumb>
//         <div className="site-layout-content" style={{ background: colorBgContainer }}>
//           Content
//         </div>
//       </Content>
//       <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
//     </Layout>
//   );
// };

// export default App;