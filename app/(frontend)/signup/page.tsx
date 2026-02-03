import { Metadata } from 'next';
import { getStaticPageContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Sign Up - AAAnow',
};

export default function SignupPage() {
  const pageContent = getStaticPageContent('signup.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
