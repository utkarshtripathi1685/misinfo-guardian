import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold font-headline text-foreground">
              Verity AI
            </span>
          </Link>

          <Button variant="outline" disabled>
            <Globe className="mr-2 h-4 w-4"/>
            English
          </Button>
        </div>
      </div>
    </header>
  );
}
