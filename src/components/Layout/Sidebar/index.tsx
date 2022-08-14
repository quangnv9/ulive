import { Menu, Layout } from 'antd';
import { Logo, LogoCollapse } from 'components/icons';
import { NavLink } from 'react-router-dom';
import { collapseMenuLists, menuLists } from './menu.const';
import './styles.scss';
import { Icon } from './type.menu';
import { useOpenMenu } from 'hooks/use-openmenu';
import { LogOut } from 'modules/Auth/Logout';
interface SideBarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}
export function SideBar(props: SideBarProps) {
  const { SubMenu } = Menu;
  const { Sider } = Layout;
  const { collapsed, toggleSidebar } = props;
  const defaultOpenKey = useOpenMenu();

  const MenuUnCollapsed = () => {
    return (
      <Menu theme="light" mode="inline" className="sidebar-menu" defaultOpenKeys={defaultOpenKey}>
        {menuLists.map((menu) => {
          const RootMenuIcon = menu.icon as Icon;

          if (menu.subMenu) {
            return (
              <SubMenu
                className="submenu-lists"
                key={`${menu.name.toLowerCase()}`}
                title={menu.name}
                icon={
                  <span className="flex">
                    <RootMenuIcon />
                  </span>
                }
              >
                {menu.subMenu.map((subMenuItem) => {
                  const SubMenuIcon = subMenuItem.icon as Icon;
                  return (
                    <Menu.Item className="submenu-item" key={subMenuItem.subId}>
                      <NavLink to={`${subMenuItem.path}`} activeClassName="active-link">
                        <div className="flex item-center">
                          <SubMenuIcon />
                          <span className="text-white title-menu-item">{subMenuItem.name}</span>
                        </div>
                      </NavLink>
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            );
          } else {
            return (
              <Menu.Item className="menu-item" key={menu.id}>
                <NavLink to={`${menu.path}`} activeClassName="active-link">
                  <div className="flex item-center">
                    <RootMenuIcon />
                    <span className="text-white title-menu-item">{menu.name}</span>
                  </div>
                </NavLink>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );
  };

  const MenuCollapsed = () => {
    return (
      <Menu theme="light" mode="inline" className="sidebar-menu-collapsed">
        {collapseMenuLists.map((menu) => {
          const MenuIcon = menu.icon as Icon;
          return (
            <NavLink key={menu.id} to={`${menu.path}`} activeClassName="active-link">
              <Menu.Item
                className="menu-collapsed-item"
                icon={
                  <span>
                    <MenuIcon />
                  </span>
                }
              >
                <span className="text-white title-menu-item">{menu.name}</span>
              </Menu.Item>
            </NavLink>
          );
        })}
      </Menu>
    );
  };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={toggleSidebar}>
      <div className="logo">{collapsed ? <LogoCollapse /> : <Logo />}</div>
      {collapsed ? <MenuCollapsed /> : <MenuUnCollapsed />}
      <LogOut collapsed={collapsed} />
    </Sider>
  );
}
