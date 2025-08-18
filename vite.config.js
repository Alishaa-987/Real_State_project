import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
// we made that because we want to run our web on specific port 
  server:{
    proxy:{
      '/api':{
      target:'http://localhost:3000',
      secure:false,
    },
  },
},
  plugins: [
  tailwindcss(),
  react()],
})



