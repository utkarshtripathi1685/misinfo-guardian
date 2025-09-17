export function Footer() {
    return (
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Disclaimer: “Guidance, not absolute truth”</p>
            <p>© {new Date().getFullYear()} Verity AI. All rights reserved.</p>
        </div>
      </footer>
    );
  }
  