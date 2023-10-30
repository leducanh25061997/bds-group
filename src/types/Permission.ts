export enum PermissionKeyEnum {
  //staff
  STAFF_CREATE = 'staff.create',
  STAFF_READ = 'staff.read',
  STAFF_UPDATE = 'staff.update',
  STAFF_DELETE = 'staff.delete',
  STAFF_RESETPASSWORD = 'staff.reset.pass',

  //user
  USER_CREATE = 'user.create',
  USER_READ = 'user.read',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',

  //customer
  CUSTOMER_CREATE = 'customer.create',
  CUSTOMER_READ = 'customer.read',
  CUSTOMER_UPDATE = 'customer.update',
  CUSTOMER_DELETE = 'customer.delete',
  CUSTOMER_UNMASK = 'customer.unmask',
  CUSTOMER_VIEW_ALL = 'customer.viewAll',
  CUSTOMER_APPRAISAL = 'customer.appraisal',
  CUSTOMER_VIEW_IN_ORGCHART = 'customer.viewInOrgchart',

  //commission
  COMMISSION_POLICY_CREATE = 'commission.policy.create',
  COMMISSION_POLICY_READ = 'commission.policy.read',
  COMMISSION_PAID = 'commission.paid',
  COMMISSION_READ = 'commission.read',
  COMMISSION_VIEW_ALL = 'commission.viewAll',
  COMMISSION_VIEW_UNMASK = 'commission.viewAll.unmask',

  //transaction
  TRANSACTION_IMPORT = 'transaction.import',

  //role
  ROLE_CREATE = 'role.create',
  ROLE_UPDATE = 'role.update',
  ROLE_DELETE = 'role.delete',
  ADD_USER_TO_ROLE = 'role.add.user',
  ROLE_READ = 'role.read',

  //project
  PROJECT_CREATE = 'project.create',
  PROJECT_UPDATE = 'project.update',
  PROJECT_READ = 'project.read',
  PROJECT_VIEW_ALL = 'project.viewAll',

  //Product
  PRODUCT_CREATE = 'product.create',
  PRODUCT_UPDATE = 'product.update',
  PRODUCT_READ = 'product.read',
  PRODUCT_VIEW_PRICE = 'product.viewPrice',

  //TICKET
  TICKET_CREATE = 'ticket.create',
  TICKET_READ = 'ticket.read',
  TICKET_UPDATE = 'ticket.update',
  TICKET_SUPPORT = 'ticket.support',
  TICKET_APPROVE = 'ticket.approve',
  TICKET_VIEW_ALL_ORG = 'ticket.viewAllOrg',
  TICKET_VIEW_ALL = 'ticket.viewAll',
  TICKET_ORDER = 'ticket.order',
  PRIORITY_MANAGEMENT = 'priority.management',
  TICKET_CANCELED = 'ticket.canceled',

  //WORKFLOW
  WORK_FLOW_READ = 'work.flow.read',
  WORK_FLOW_CREATE = 'work.flow.create',
  WORK_FLOW_UPDATE = 'work.flow.update',
  WORK_FLOW_DELETE = 'work.flow.delete',

  //setup
  PROJECT_SETTING_READ = 'projectSetting.read',
  PROJECT_SETTING_UPDATE = 'projectSetting.update',

  //MEMBERSHIP CARD
  CUSTOMER_CITYSTAR_VIEW_ALL = 'customer.citystar.viewAll',
  QRCODE_CREATE = 'qrcode.create',
  QRCODE_VIEW_ALL = 'qrcode.viewAll',
  //KPI
  KPI_READ = 'kpi.read',
  KPI_CREATE = 'kpi.create',
  KPI_UPDATE = 'kpi.update',
  KPI_DELETE = 'kpi.delete',

  //RECEIPT
  RECEIPT_READ = 'receipt.read',
  RECEIPT_CREATE = 'receipt.create',
  RECEIPT_UPDATE = 'receipt.update',
  RECEIPT_DELETE = 'receipt.delete',
  RECEIPT_APPROVE = 'receipt.approve',

  //PRODUCT
  OPEN_PRIORITY = 'sales.program.open.priority', // Mở và khoá ráp ưu tiên
  TICKIC_ORDER = 'ticket.order', // Ráp ưu tiên
  PRODUCT_SALE = 'product.sale', // Mở bán sản phẩm
  PRODUCT_MOVE = 'product.move', // Chuyển sản phẩm cho đơn vị
  PRODUCT_VIEW_ALL = 'product.viewAll',
  PRODUCT_LOCK = 'product.lock', // khoá sản phẩm

  //refund
  REFUND_READ = 'refund.read',
  REFUND_CREATE = 'refund.create',
  REFUND_UPDATE = 'refund.update',
  REFUND_DELETE = 'refund.delete',
  REFUND_APPROVE = 'refund.approve',

  //PRINT
  PRINT_READ = 'print.read',
  PRINT_CREATE = 'print.create',
  PRINT_UPDATE = 'print.update',
  PRINT_DELETE = 'print.delete',
  PRINT_APPROVE = 'print.approve',

  //sales_program
  SALES_PROGRAM_READ = 'sales.program.read',
  SALES_PROGRAM_CREATE = 'sales.program.create',
  SALES_PROGRAM_UPDATE = 'sales.program.update',
  SALES_PROGRAM_DELETE = 'sales.program.delete',
  SALES_OPEN_PRIORITY = 'sales.program.open.priority',

  //esalekit
  ESALEKIT_CREATE = 'esalekit.create',
  ESALEKIT_EDIT = 'esalekit.edit',
  ESALEKIT_VIEW = 'esalekit.view',

  // Sales event
  EVENT_SALES_OPEN = 'event.sales.open',
  EVENT_SALES_LIST_TRANSACTION = 'event.sales.transaction',
  EVENT_SALES_REGISTER = 'event.sales.register',
  EVENT_SALES_CONFIRM = 'event.sales.confirm',
  EVENT_SALES_INFOR_CUSTOMER = 'event.sales.infor.customer',
  EVENT_SALES_RETURN = 'event.sales.return',
  EVENT_SALES_REQUEST = 'event.sales.request',
  EVENT_SALES_COMPLETED = 'event.sales.completed',
  EVENT_SALES_ADD_PROFILE = 'event.sales.add.profile',
  EVENT_SALES_FORWARD_PRODUCT = 'event.sales.forward.product',
  EVENT_SALES_REGAIN_PRODUCT = 'event.sales.regain.product',

  //lead
  LEAD = 'lead',
  LEAD_WIEW_ALL = 'lead.viewAll',
  LEAD_TAKE_CARE = 'lead.takeCare',
}
