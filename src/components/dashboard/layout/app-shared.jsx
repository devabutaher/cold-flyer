import {
  BarChart,
  Briefcase,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Newspaper,
  Package,
  Percent,
  ShoppingCart,
  User,
  Users,
  Wrench,
  DollarSign,
  MapPin,
  History,
  MessageSquare,
  TrendingUp,
  Contact,
} from "lucide-react";

export const navGroups = [
  {
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard />,
      },
    ],
  },
  {
    label: "Shop",
    items: [
      {
        title: "Products",
        icon: <Package />,
        path: "/dashboard/items",
      },
      {
        title: "My Orders",
        path: "/dashboard/orders",
        icon: <ShoppingCart />,
      },
    ],
  },
  {
    label: "Services",
    items: [
      {
        title: "Services",
        path: "/dashboard/services",
        icon: <Wrench />,
      },
      {
        title: "Service Bookings",
        path: "/dashboard/bookings",
        icon: <ClipboardList />,
      },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        title: "Analytics",
        path: "/dashboard/analytics",
        icon: <BarChart />,
      },
      {
        title: "Coupons",
        path: "/dashboard/coupons",
        icon: <Percent />,
      },
      {
        title: "Users",
        path: "/dashboard/users",
        icon: <Users />,
      },
      {
        title: "Applications",
        path: "/dashboard/applications",
        icon: <FileText />,
      },
      {
        title: "Technicians",
        path: "/dashboard/technicians",
        icon: <Wrench />,
      },
      {
        title: "Customers",
        path: "/dashboard/customers",
        icon: <Contact />,
      },
      {
        title: "Expenses",
        path: "/dashboard/expenses",
        icon: <DollarSign />,
      },
      {
        title: "Attendance",
        path: "/dashboard/attendance",
        icon: <ClipboardList />,
      },
      {
        title: "Live Location",
        path: "/dashboard/location",
        icon: <MapPin />,
      },
      {
        title: "Activity Log",
        path: "/dashboard/activity-log",
        icon: <History />,
      },
      {
        title: "Reports",
        path: "/dashboard/reporting",
        icon: <TrendingUp />,
      },
      {
        title: "Messages",
        path: "/dashboard/messages",
        icon: <MessageSquare />,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        title: "Blog Posts",
        path: "/dashboard/blogs",
        icon: <Newspaper />,
      },
      {
        title: "Recent Works",
        path: "/dashboard/recent-works",
        icon: <Briefcase />,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Profile",
        path: "/dashboard/profile",
        icon: <User />,
      },
    ],
  },
];

export const footerNavLinks = [
  {
    title: "Help & FAQ",
    path: "/faq",
    icon: <HelpCircle />,
  },
];

export const navLinks = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) => (item.subItems?.length ? [item, ...item.subItems] : [item])),
  ),
  ...footerNavLinks,
];
