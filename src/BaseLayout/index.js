import React, { useState } from "react";
import { Layout, Menu, Spin } from "antd";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import routes from "../router";
import { hasChild } from "../utils/common";
import PublicHeader from "../components/PublicHeader";
import Breadcrumb from "src/components/Breadcrumb";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

function BaseLayout() {
  let navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([window.location.pathname]); //路由地址

  //侧边栏伸缩
  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const genSubMenu = (menu) => {
    const { icon, key, hidden, name, children } = menu;
    if (hidden) return null;
    return (
      <SubMenu
        title={
          <span>
            {icon ? icon : null}
            <span>{name}</span>
          </span>
        }
        key={key}
      >
        {genMenus(children || [])}
      </SubMenu>
    );
  };
  // 获取子菜单
  const genMenItem = (menu) => {
    const { icon, name, key, hidden } = menu;
    if (hidden) return null;
    return (
      <Menu.Item key={key}>
        <div>
          {icon ? icon : null}
          <span>{name}</span>
        </div>
      </Menu.Item>
    );
  };
  // 判断显示父菜单还是子菜单
  const genMenus = (routes) => {
    return routes.reduce((prev, next) => {
      return prev.concat(hasChild(next) ? genSubMenu(next) : genMenItem(next));
    }, []);
  };

  //路由
  const generateRoute = (routes) => {
    // console.log(routes,"路由");
    let result = [];
    routes.forEach((item) => {
      // console.log(item,"item");
      if (hasChild(item)) {
        item.children.forEach((child) => {
          const renderComponent = generateItemRoute(child.key, child.component);
          result.push(renderComponent);
        });
      } else if (item.component) {
        result.push(generateItemRoute(item.key, item.component));
      }
    });
    return result;
  };
  
  //处理子路由
  const generateItemRoute = (key, component) => {
    if (window.sessionStorage.getItem("username")) {
      return <Route key={key} path={key} element={component} />;
    } else {
      return <Route key={key} path="*" element={<Navigate to="/login" />} />;
    }
  };

  const onChangeMenu = ({ key }) => {
    navigate(key);
    setSelectedKeys([key]);
  };

  const username = sessionStorage.getItem("username");

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 右侧选项 */}
      <PublicHeader user={username} />

      <Layout className="site-layout">
        {/* 侧边栏 */}
        <Sider
          collapsible
          collapsed={collapsed}
          style={{ background: "#fff" }}
          onCollapse={onCollapse}
        >
          {/* 导航菜单 */}
          <Menu
            theme="light"
            selectedKeys={selectedKeys}
            mode="inline"
            onSelect={onChangeMenu}
          >
            {genMenus(routes)}
          </Menu>
        </Sider>
        {/* 内容部分 */}
        <Content style={{ margin: "0 16px", padding: 10 }}>
          <div style={{ marginBottom: 10 }}>
            {/* 面包屑 */}
            <Breadcrumb
              routeChange={(pathname) => setSelectedKeys([pathname])}
            />
          </div>

          <React.Suspense
            fallback={
              <div style={{ marginTop: 200, textAlign: "center" }}>
                <Spin spinning={true} />
              </div>
            }
          >
            {/* 路由处理 */}
            <Routes>{generateRoute(routes)}</Routes>
          </React.Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}

export default BaseLayout;
