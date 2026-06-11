import {
  BarChart,
  Briefcase,
  ClipboardList,
  FileText,
  Heart,
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
        roles: ["admin", "moderator", "worker", "customer"],
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
        roles: ["admin", "moderator"],
      },
      {
        title: "My Orders",
        path: "/dashboard/orders",
        icon: <ShoppingCart />,
        roles: ["admin", "moderator", "worker", "customer"],
      },
      {
        title: "Wishlist",
        path: "/dashboard/wishlist",
        icon: <Heart />,
        roles: ["admin", "moderator", "worker", "customer"],
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
        roles: ["admin", "moderator"],
      },
      {
        title: "Service Bookings",
        path: "/dashboard/bookings",
        icon: <ClipboardList />,
        roles: ["admin", "moderator", "worker", "customer"],
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
        roles: ["admin"],
        subItems: [
          {
            title: "Analytics",
            path: "/dashboard/analytics",
            icon: <BarChart />,
            roles: ["admin"],
          },
          {
            title: "Reports",
            path: "/dashboard/reporting",
            icon: <TrendingUp />,
            roles: ["admin"],
          },
          {
            title: "Activity Log",
            path: "/dashboard/activity-log",
            icon: <History />,
            roles: ["admin"],
          },
        ],
      },
      {
        title: "People",
        path: "/dashboard/users",
        icon: <Users />,
        roles: ["admin", "moderator"],
        subItems: [
          {
            title: "Users",
            path: "/dashboard/users",
            icon: <Users />,
            roles: ["admin", "moderator"],
          },
          {
            title: "Workers",
            path: "/dashboard/workers",
            icon: <Wrench />,
            roles: ["admin", "moderator"],
          },
          {
            title: "Customers",
            path: "/dashboard/customers",
            icon: <Contact />,
            roles: ["admin", "moderator"],
          },
          {
            title: "Applications",
            path: "/dashboard/applications",
            icon: <FileText />,
            roles: ["admin", "moderator"],
          },
        ],
      },
      {
        title: "Operations",
        path: "/dashboard/expenses",
        icon: <ClipboardList />,
        roles: ["admin", "moderator", "worker"],
        subItems: [
          {
            title: "Expenses",
            path: "/dashboard/expenses",
            icon: <DollarSign />,
            roles: ["admin"],
          },
          {
            title: "Attendance",
            path: "/dashboard/attendance",
            icon: <ClipboardList />,
            roles: ["admin", "worker"],
          },
          {
            title: "Live Location",
            path: "/dashboard/location",
            icon: <MapPin />,
            roles: ["admin"],
          },
          {
            title: "Messages",
            path: "/dashboard/messages",
            icon: <MessageSquare />,
            roles: ["admin", "moderator"],
          },
        ],
      },
      {
        title: "Coupons",
        path: "/dashboard/coupons",
        icon: <Percent />,
        roles: ["admin", "moderator"],
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
        roles: ["admin", "moderator"],
      },
      {
        title: "Recent Works",
        path: "/dashboard/recent-works",
        icon: <Briefcase />,
        roles: ["admin", "moderator"],
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
        roles: ["admin", "moderator", "worker", "customer"],
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
