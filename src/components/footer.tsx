function Footer() {
  return (
    <footer className="mt-20 border-t bg-card">
      <div className="mx-auto flex w-11/12 max-w-7xl flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <h3 className="text-lg font-bold text-foreground">VTON Platform</h3>
          <p>
            AI-powered virtual try-on platform for realistic clothing
            visualization.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 md:items-end">
          <div className="flex gap-4">
            <a
              href="https://github.com/yagizerdem/vton-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground"
            >
              GitHub
            </a>

            <a
              href="mailto:yagizerdem819@gmail.com"
              className="transition hover:text-foreground"
            >
              Contact
            </a>
          </div>

          <p>
            © {new Date().getFullYear()} VTON Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
