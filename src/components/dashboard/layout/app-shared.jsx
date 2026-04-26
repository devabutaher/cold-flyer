import {
  ActivityIcon,
  AirVent,
  ClipboardList,
  HelpCircle,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  Settings,
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
        icon: <LayoutGrid />,
        path: "/dashboard/items",
      },
      {
        title: "My Orders",
        path: "",
        icon: <ShoppingCart />,
      },
    ],
  },
  {
    label: "Services",
    items: [
      {
        title: "Service Bookings",
        path: "",
        icon: <ClipboardList />,
      },
      {
        title: "Repair Requests",
        path: "",
        icon: <Wrench />,
      },
      {
        title: "AC Units",
        path: "",
        icon: <AirVent />,
      },
      {
        title: "Parts & Accessories",
        path: "",
        icon: <Layers />,
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
      {
        title: "Settings",
        icon: <Settings />,
        subItems: [
          { title: "General", path: "" },
          { title: "Notifications", path: "" },
          { title: "Security", path: "" },
        ],
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
  {
    title: "System Status",
    path: "/status",
    icon: <ActivityIcon />,
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
