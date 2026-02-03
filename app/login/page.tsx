import { Metadata } from 'next';
import { getWebflowPageContent } from '@/lib/webflow-content';

export const metadata: Metadata = {
  title: 'Login - AAAnow',
};

export default function LoginPage() {
  const pageContent = getWebflowPageContent('login.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
