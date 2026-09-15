import { getDemoConfig } from '@/actions/settings';
import { LoginForm } from './login-form';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const demoConfig = await getDemoConfig();

  return <LoginForm initialDemoConfig={demoConfig} />;
}