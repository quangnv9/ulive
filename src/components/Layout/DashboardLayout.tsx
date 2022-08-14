import { useMemo } from 'react';
import { Col, Layout, Row } from 'antd';
import { SideBar } from './Sidebar';
import useToggle from 'hooks/use-toggle';
import { BarIcon } from 'components/icons';
import { Switch, Route, useLocation } from 'react-router-dom';
import { UserPage, ProductManagementPage, AdminPage } from 'pages';
import { HeaderBreadcrumb } from './HeaderBreadcrumb';
import { IRoutes, routes } from 'navigation/constants';
import { NotFoundPage } from 'pages/not-found';
import clsx from 'clsx';

const { Header } = Layout;

export const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useToggle();
  const { Content } = Layout;
  const { pathname } = useLocation();

  const titlePage = useMemo<string>(() => {
    if (pathname === '/') {
      return getTitlePage('root');
    }
    if (pathname === '/video') {
      return getTitlePage('video');
    }
    if (pathname === '/other') {
      return getTitlePage('other');
    }
    if (
      pathname
        .replace('/', '')
        .split('/')
        .filter((item) => item !== '').length > 3
    ) {
      return getTitlePage('notfound');
    }
    if (pathname === '/product/product-list/add-product') {
      return getTitlePage('product-list');
    }
    if (
      pathname.includes('/product/category/') ||
      pathname.includes('/product/attribute/') ||
      pathname.includes('/product/product-list/')
    ) {
      return getTitlePage('notfound');
    } else {
      return getTitlePage(pathname.split('/')[2] as keyof IRoutes);
    }
  }, [pathname]);

  return (
    <Layout style={{ minHeight: '100vh', width: '100%', position: 'relative' }}>
      <SideBar collapsed={collapsed} toggleSidebar={setCollapsed} />
      <Layout className={`${collapsed ? 'site-layout-collapsed' : 'site-layout'}`}>
        <Header className="site-layout-header">
          <Row gutter={[0, 14]}>
            {titlePage !== 'Not found' && (
              <Col span="24">
                <Row>
                  <HeaderBreadcrumb />
                </Row>
              </Col>
            )}

            <Col span="24">
              <Row align="middle" gutter={[18, 0]}>
                <Col>
                  <span className="cursor-pointer flex" onClick={setCollapsed}>
                    <BarIcon />
                  </span>
                </Col>
                <Col>
                  <h1 className="text-2xl font-bold mb-0">{titlePage}</h1>
                </Col>
              </Row>
            </Col>
          </Row>
        </Header>

        {/* Main Content */}
        <Content className={clsx('site-layout__content', pathname === '/product/category' && 'bg-gray')}>
          <Switch>
            <Route path="/user">
              <UserPage />
            </Route>
            <Route path="/product">
              <ProductManagementPage />
            </Route>
            <Route path="/" exact>
              <AdminPage />
            </Route>
            <Route path="*">
              <NotFoundPage />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
};

export const getTitlePage = (pathname: keyof IRoutes) => {
  if (pathname === 'root') return 'Dashboard';
  return routes[pathname]?.display ? routes[pathname].display : 'Not found';
};
