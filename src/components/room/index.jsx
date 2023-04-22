import React, { useState } from "react"
import './index.css';

import { Button, DatePicker, Input } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Col, Row, Space } from 'antd';
import { VideoCameraOutlined, WindowsOutlined, AudioOutlined } from "@ant-design/icons";
const { Header, Content, Footer } = Layout;

function RoomComponent() {

  const [cameraOn, setCameraOn] = useState(false);
  const [screenSharedOn, setScreenSharedOn] = useState(false);
  const [micOn, setMicOn] = useState(false);

  return (
    <Layout className="layout-area">
      <Header className="header-area">
        <div>
          <span className="logo">Fala Ai!</span>
        </div>
        <div>
          <Space.Compact style={{ width: '100%' }}>
            <Input defaultValue="" placeholder="Digite seu nome..." />
            <Button type="primary">Entrar</Button>
          </Space.Compact>
        </div>
      </Header>
      <Row style={{ height: 'calc(100vh)' }}>
        <Col sm={14} md={16} lg={16} xl={18} className="video-grid">
          <Content className="video-area">
          <video src="" className="video" sm={4} md={6} lg={6} xl={8}></video>
          {/* <video src="" className="video" sm={4} md={6} lg={6} xl={8}></video> */}
          {/* <video src="" className="video" sm={4} md={6} lg={6} xl={8}></video> */}
          {/* <video src="" className="video"></video> */}
          </Content>
          <Footer className="footer-area" style={{ }}>
            <Button
              onClick={() => setCameraOn(!cameraOn)}
              style={{
                background: cameraOn ? '' : 'red',
                color: cameraOn ? '' : '#FFF'
              }}>
              <VideoCameraOutlined />
            </Button>
            <Button
              onClick={() => setScreenSharedOn(!screenSharedOn)}
              style={{
                background: screenSharedOn ? '' : '#060212',
                color: screenSharedOn ? '' : '#FFF'
              }}>
              <WindowsOutlined />
            </Button>
            <Button
              onClick={() => setMicOn(!micOn)}
              style={{
                background: micOn ? '' : 'red',
                color: micOn ? '' : '#FFF'
              }}>
              <AudioOutlined />
            </Button>
            {/* Fala Ai! ©2023 Created by Jackson & Gabriel */}
          </Footer>
        </Col>
        <Col sm={10} md={8} lg={8} xl={6}>
          <Content className="chat-area">
            <div className="chat">
              teste
            </div>
            <div className="new-text-area">
              <Space.Compact style={{ width: '100%' }}>
                <Input defaultValue="" placeholder="Digite..." />
                <Button type="primary">Enviar</Button>
              </Space.Compact>
            </div>
          </Content>
        </Col>
      </Row>
      {/* <Footer className="footer-area" style={{ }}>
        <Button>Camera On</Button>
        <Button>Compartilhar Tela</Button>
        <Button>Microfone On</Button>
      </Footer> */}
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