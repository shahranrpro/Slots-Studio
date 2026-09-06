export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  badge?: string;
  description?: string;
  icon?: string;
  code?: string;
}

export interface FooterColumn {
  title: string;
  items: NavItem[];
}

export interface NavigationConfig {
  marketingNav: NavItem[];
  marketingCta: {
    primary: NavItem;
    secondary: NavItem;
    signIn: NavItem;
  };
  marketingFooterNav: {
    product: FooterColumn;
    studios: FooterColumn;
    resources: FooterColumn;
    legal: FooterColumn;
  };
  appNav: {
    overview: NavItem[];
    workspace: NavItem[];
    studios: NavItem[];
    system: NavItem[];
  };
  mobileNav: NavItem[];
}

export const navigationConfig: NavigationConfig = {
  marketingNav: [
    { title: "Product", href: "/features" },
    { title: "Studios", href: "/studios" },
    { title: "Workflow", href: "/workflow" },
    { title: "Pricing", href: "/pricing" },
    { title: "Resources", href: "/resources" },
  ],
  marketingCta: {
    primary: { title: "Start Creating", href: "/signup" },
    secondary: { title: "Explore the Studio", href: "/studios" },
    signIn: { title: "Sign In", href: "/login" },
  },
  marketingFooterNav: {
    product: {
      title: "Product",
      items: [
        { title: "Features", href: "/features" },
        { title: "Studios Overview", href: "/studios" },
        { title: "Workflow Architecture", href: "/workflow" },
        { title: "Pricing & Plans", href: "/pricing" },
      ],
    },
    studios: {
      title: "Studios",
      items: [
        { title: "Product Studio", href: "/studios#product" },
        { title: "Visual Studio", href: "/studios#visual" },
        { title: "Content Studio", href: "/studios#content" },
        { title: "Campaign Studio", href: "/studios#campaign" },
        { title: "Production Studio", href: "/studios#production" },
      ],
    },
    resources: {
      title: "Resources",
      items: [
        { title: "About Slots Studio", href: "/about" },
        { title: "Resource Center", href: "/resources" },
        { title: "Contact Support", href: "/contact" },
        { title: "Component Showcase", href: "/dev/components" },
      ],
    },
    legal: {
      title: "Legal",
      items: [
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms of Service", href: "/terms" },
      ],
    },
  },
  appNav: {
    overview: [
      { title: "Dashboard", href: "/app", icon: "LayoutDashboard" },
    ],
    workspace: [
      { title: "Projects", href: "/app/projects", icon: "FolderKanban" },
      { title: "Assets", href: "/app/assets", icon: "Images" },
      { title: "Jobs", href: "/app/jobs", icon: "Activity" },
    ],
    studios: [
      { title: "Product", href: "/app/studio/product", icon: "Box", code: "01" },
      { title: "Visual", href: "/app/studio/visual", icon: "Eye", code: "02" },
      { title: "Content", href: "/app/studio/content", icon: "FileText", code: "03" },
      { title: "Campaign", href: "/app/studio/campaign", icon: "Megaphone", code: "04" },
      { title: "Production", href: "/app/studio/production", icon: "Scissors", code: "05" },
    ],
    system: [
      { title: "Notifications", href: "/app/notifications", icon: "Bell" },
      { title: "Settings", href: "/app/settings", icon: "Settings" },
      { title: "Help", href: "/app/help", icon: "HelpCircle" },
    ],
  },
  mobileNav: [
    { title: "Dashboard", href: "/app" },
    { title: "Projects", href: "/app/projects" },
    { title: "Assets", href: "/app/assets" },
    { title: "Jobs", href: "/app/jobs" },
    { title: "Notifications", href: "/app/notifications" },
    { title: "Product Studio", href: "/app/studio/product" },
    { title: "Visual Studio", href: "/app/studio/visual" },
    { title: "Content Studio", href: "/app/studio/content" },
    { title: "Campaign Studio", href: "/app/studio/campaign" },
    { title: "Production Studio", href: "/app/studio/production" },
    { title: "Settings", href: "/app/settings" },
    { title: "Help", href: "/app/help" },
  ],
};
