/**
 * IVANALAND — Help recover the 100 lost iPhones hidden throughout Ivanaland.
 * A game by Benedict de Jesus.
 */
import './ui/styles.css';
import { Game } from './core/Game';
import { UI } from './ui/hud';
import { validateContent } from './data/validate';

async function boot(): Promise<void> {
  if (import.meta.env.DEV) validateContent();

  const fill = document.getElementById('load-fill');
  const loading = document.getElementById('loading');
  const setProgress = (f: number): void => {
    if (fill) fill.style.width = `${Math.round(20 + f * 80)}%`;
  };

  const game = new Game();
  try {
    await game.start(setProgress);
    new UI(game);
  } catch (err) {
    console.error('IVANALAND failed to start:', err);
    if (loading) {
      loading.querySelector('.load-tag')!.textContent =
        'Something went wrong loading Ivanaland. Please refresh to try again.';
    }
    return;
  }

  // graceful reveal
  setTimeout(() => loading?.classList.add('hidden'), 450);
  setTimeout(() => loading?.remove(), 1200);
}

void boot();
