import {
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  Package,
  ShoppingCart,
  User,
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
        path: "",
        icon: <ClipboardList />,
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
      // {
      //   title: "Settings",
      //   icon: <Settings />,
      //   subItems: [
      //     { title: "General", path: "" },
      //     { title: "Notifications", path: "" },
      //     { title: "Security", path: "" },
      //   ],
      // },
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
