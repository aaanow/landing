import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Login - AAAnow',
  description: 'Sign in to your AAAnow account to access your client scorecards, audits, and agency dashboard.',
};

export default function LoginPage() {
  const pageContent = getStaticPageContent('login.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
