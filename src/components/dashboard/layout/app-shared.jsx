import {
  BarChart,
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  Package,
  Percent,
  ShoppingCart,
  User,
  Users,
  Wrench,
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
        title: "Technicians",
        path: "/dashboard/technicians",
        icon: <Wrench />,
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
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item],
    ),
  ),
  ...footerNavLinks,
];
