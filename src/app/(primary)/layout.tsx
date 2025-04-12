import { Layout } from '@/components/layout/Layout';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function PrimaryLayout({ children }: AuthLayoutProps) {
  return <Layout>{children}</Layout>;
}
