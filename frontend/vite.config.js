import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Code splitting configuration
        manualChunks: {
          // Vendor chunks
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
          
          // Route-based chunks
          'auth': ['./src/pages/Login.jsx', './src/pages/RequestAccess.jsx', './src/pages/CompleteSetup.jsx'],
          'dashboard': ['./src/pages/AdminDashboard.jsx', './src/pages/StudentDashboard.jsx', './src/pages/TeacherDashboard.jsx'],
          'courses': ['./src/pages/CoursesPage.jsx', './src/pages/CourseEditor.jsx', './src/pages/StudentCourseView.jsx'],
          'other': ['./src/pages/Professor.jsx', './src/pages/Scholarship.jsx', './src/pages/ContactPage.jsx']
        },
        chunkFileNames: 'chunks/[name]-[hash].js'
      }
    },
    chunkSizeWarningLimit: 500,
    minify: 'terser'
  }
})
