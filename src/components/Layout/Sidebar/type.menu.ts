export type Icon = React.FC<React.SVGProps<SVGSVGElement>>;

export type SubMenu = {
  subId: string | number;
  path?: string;
  name?: string;
  icon?: Icon;
};
export type MenuItem = {
  id: string | number;
  path?: string;
  name: string;
  icon?: Icon;
  subMenu?: Array<SubMenu>;
};

export type CollapseMenu = Omit<MenuItem, 'subMenu'>;
