import { Home, BookCheck, GraduationCap, Store } from "lucide-react";

// Route configuration for navigation
export const ROUTES = {
  HOME: {
    path: "/",
    label: "خانه",
    icon: Home,
  },
  EXAM: {
    path: "/exam",
    label: "آزمون",
    icon: BookCheck,
  },
  LEARN: {
    path: "/learn",
    label: "آموزش",
    icon: GraduationCap,
  },
  STORE: {
    path: "/store",
    label: "فروشگاه",
    icon: Store,
  },
};

// Additional routes for header breadcrumbs
export const ROUTE_NAMES = {
  "/": "میمو",
  "/exam": "آزمون",
  "/learn": "آموزش",
  "/store": "فروشگاه",
  "/profile": "پروفایل",
  "/about": "درباره ما",
  "/contact": "تماس با ما",
};

// Navigation items for bottom nav (in order)
export const NAV_ITEMS = [
  ROUTES.HOME,
  ROUTES.LEARN,
  ROUTES.EXAM,
  ROUTES.STORE,
];

// Helper function to check if a path is active
export const isPathActive = (pathname, routePath) => {
  if (routePath === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(routePath);
};

// Helper function to get current route name for header
export const getCurrentRouteName = (pathname) => {
  // Check for exact match first
  if (ROUTE_NAMES[pathname]) {
    return ROUTE_NAMES[pathname];
  }

  // Check for partial matches (e.g., /store/something -> فروشگاه)
  for (const [route, name] of Object.entries(ROUTE_NAMES)) {
    if (pathname.startsWith(route) && route !== "/") {
      return name;
    }
  }

  // Default fallback
  return ROUTE_NAMES["/"];
};

