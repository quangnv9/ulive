import { SeparatorIcon } from 'components/icons';
import { Breadcrumb } from 'antd';
import { Link, useLocation, useHistory } from 'react-router-dom';
import './styles.scss';
import { useParseParams } from 'hooks/use-params';
import { ConfirmModal } from 'components/modal';
import { useState } from 'react';

export function HeaderBreadcrumb() {
  const location = useLocation<any>();
  const listRoutes = location.pathname.replace('/', '').split('/');
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState<boolean>(false);
  const [paths, setPaths] = useState<Array<string>>([]);
  const { action } = useParseParams();
  const history = useHistory();
  const routes = listRoutes.map((routeName, index) => {
    if (index === 2) {
      if (listRoutes[1] === 'permission') {
        if (routeName === 'add-group') {
          return {
            path: routeName,
            breadcrumbName: 'Add Group',
          };
        }
        if (location.search) {
          return {
            path: routeName,
            breadcrumbName: 'Permission Details',
          };
        }
      }
      if (listRoutes[1] === 'product-list' && routeName === 'add-product') {
        return {
          path: routeName,
          breadcrumbName: 'Add Product',
        };
      }
      return {
        path: routeName,
        breadcrumbName: listRoutes[1] === 'admin' ? 'Admin Profile' : `${listRoutes[1]} details`,
      };
    } else {
      return {
        path: routeName,
        breadcrumbName: routeName === 'product-list' ? 'product' : routeName,
      };
    }
  });

  const handleConfirmAction = (paths: Array<string>) => {
    if (action) {
      setIsOpenModalConfirm(true);
      setPaths(paths);
    }
  };
  const handleGoBack = () => {
    setIsOpenModalConfirm(false);
    history.push(`/${paths?.splice(0, paths.length - 1).join('/')}`);
  };

  function itemRender(route: any, params: any, routes: any, paths: any) {
    const last = routes.indexOf(route) === routes.length - 1;
    const first = routes.indexOf(route) === 0;

    return last || first ? (
      <span className={`last-item ${first ? 'first-item' : ''}`}>{route.breadcrumbName}</span>
    ) : (
      <>
        {action ? (
          <span className="cursor-pointer" onClick={() => handleConfirmAction(paths)}>
            {route.breadcrumbName}
          </span>
        ) : (
          <Link to={`/${paths.join('/')}`}>{route.breadcrumbName}</Link>
        )}
      </>
    );
  }
  return (
    <>
      <Breadcrumb
        separator={
          <span>
            <SeparatorIcon />
          </span>
        }
        itemRender={itemRender}
        routes={routes}
        className="breadcrumb"
      />
      <ConfirmModal
        okText="Yes"
        cancelText="No"
        visible={isOpenModalConfirm}
        onCancel={() => setIsOpenModalConfirm(false)}
        onOk={handleGoBack}
      >
        Are you sure to go back without saving?
      </ConfirmModal>
    </>
  );
}
