import http from 'node:http';

function call(method, path, body) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'localhost', port: 3456, path, method };
    if (body) opts.headers = { 'Content-Type': 'text/plain' };
    const r = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch { resolve(d); }
      });
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  // Step 1: Open Bilibili search in new tab
  console.log('🎵 Opening Bilibili...');
  const { targetId } = await call('POST', '/new', 'https://search.bilibili.com/all?keyword=summertime+sadness&order=totalrank');
  console.log('Tab:', targetId);
  await sleep(4000);

  // Step 2: Find and extract video cards
  console.log('🔍 Searching for videos...');
  let data = await call('POST', `/eval?target=${targetId}`, `
    (() => {
      const cards = document.querySelectorAll('.bili-video-card');
      if (!cards.length) {
        // fallback: try other selectors
        const alt = document.querySelectorAll('[class*="video"] a[href*="video"]');
        return JSON.stringify(Array.from(alt).slice(0, 3).map((a, i) => ({
          index: i, title: a.title || a.textContent?.trim()?.slice(0, 80), href: a.href
        })));
      }
      return JSON.stringify(Array.from(cards).slice(0, 5).map((c, i) => {
        const title = c.querySelector('.bili-video-card__info--tit')?.textContent?.trim()
                   || c.querySelector('[title]')?.getAttribute('title')
                   || c.textContent?.trim()?.slice(0, 80);
        const link = c.querySelector('a')?.href;
        return { index: i, title, link };
      }));
    })()
  `);

  let videos = [];
  try { videos = typeof data === 'string' ? JSON.parse(data) : JSON.parse(data?.result || '[]'); } catch {}

  if (videos.length > 0) {
    const v = videos[0];
    console.log('▶️  Opening:', v.title || v.link);

    // Navigate directly to the first video
    if (v.link) {
      await call('POST', `/navigate?target=${targetId}`, v.link);
      await sleep(5000);

      // Try to set highest quality
      await call('POST', `/eval?target=${targetId}`, `
        (() => {
          // Click the quality settings
          const btns = document.querySelectorAll('[class*="quality"], [class*="bpx-player-ctrl-quality"]');
          for (const b of btns) { b.click(); break; }
          // After menu opens, select highest quality option
          setTimeout(() => {
            const opts = document.querySelectorAll('[class*="quality"] li, [class*="bpx-player"] li, .bpx-player-ctrl-quality-menu-item');
            if (opts.length > 0) {
              // Try to find highest quality (usually first or last item with number)
              for (const o of opts) {
                if (/1080|4K|HDR|高码率/.test(o.textContent)) { o.click(); break; }
              }
            }
          }, 1000);
          return 'quality set';
        })()
      `);
      console.log('✅ Playing Summertime Sadness on Bilibili!');
    }
  } else {
    console.log('⚠️ No video cards found, page might need JS rendering...');
    // Take screenshot to debug
    const ss = await call('GET', `/screenshot?target=${targetId}&file=/tmp/bili_debug.png`);
    console.log('Screenshot:', ss);
  }
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
