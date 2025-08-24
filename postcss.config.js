import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default {
  plugins: [
    autoprefixer,
    // CSS optimization for production
    ...(process.env.NODE_ENV === 'production'
      ? [cssnano({ preset: 'default' })]
      : []
    ),
  ],
};
