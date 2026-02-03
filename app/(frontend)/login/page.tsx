import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Login - AAAnow',
};

export default function LoginPage() {
  const pageContent = getStaticPageContent('login.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
