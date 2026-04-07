export default function Footer() {
  return (
    <footer className="relative mt-24">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="font-display font-bold text-lg text-text-primary mb-2">
              PROVN<span className="text-accent">.</span>
            </div>
            <p className="text-sm text-text-dim">Your work, proven onchain.</p>
          </div>

          <div className="flex justify-center gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-text-primary transition-colors">
              GitHub
            </a>
            <a href="https://explorer.etherlink.com" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-text-primary transition-colors">
              Explorer
            </a>
            <a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors">
              Docs
            </a>
          </div>

          <div className="md:text-right">
            <p className="text-xs text-text-dim">Built for Tezos EVM Hackathon 2026</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
