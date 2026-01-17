// main UI helpers used by pages
function showMessage(text, type = 'info'){
  console.log('MSG', type, text);
  // optional: could show a toast in UI later
}

// Safe fetch wrapper that returns parsed JSON or throws
async function safeFetch(url, options = {}){
  const res = await fetch(url, options);
  let data;
  try{ data = await res.json(); }catch(e){ data = null }
  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || 'Request failed');
    err.status = res.status; err.data = data;
    throw err;
  }
  return data;
}

window.UI = { showMessage, safeFetch };

// attach simple helpers to global for pages
window.addEventListener('error', (e) => console.error('Frontend error:', e.message));
