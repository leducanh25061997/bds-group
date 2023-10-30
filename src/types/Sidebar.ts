export interface IRoute {
  title: string;
  path?: string;
  component?: any;
  authenticationRequired?: boolean; // default: true
}

export interface ISidebarMenu extends IRoute {
  icon?: any;
  children?: IRoute[];
}

export interface ISidebarSubMenu extends ISidebarMenu {
  visible?: boolean; // default: false
}
