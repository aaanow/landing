import { Metadata } from 'next';
import { getWebflowPageContent } from '@/lib/webflow-content';

export const metadata: Metadata = {
  title: 'Sign Up - AAAnow',
};

export default function SignupPage() {
  const pageContent = getWebflowPageContent('signup.html');

  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
