import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/pubmed': {
        target: 'https://eutils.ncbi.nlm.nih.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pubmed/, '/entrez/eutils'),
      },
      '/europepmc': {
        target: 'https://www.ebi.ac.uk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/europepmc/, '/europepmc/webservices/rest'),
      },
      '/s2': {
        target: 'https://api.semanticscholar.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s2/, '/graph/v1'),
      },
    },
  },
})
